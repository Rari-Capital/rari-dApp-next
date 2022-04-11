// Chakra and UI
import { Heading, Spinner, useToast } from "@chakra-ui/react";
import { Column, Center, RowOrColumn, Row } from "lib/chakraUtils";
import { Fade } from "@chakra-ui/react";

// React
import { useEffect, useState, useMemo, createContext, useContext } from "react";

// React Query
import { useQueryClient } from "react-query";

// Rari
import { Fuse } from "esm";
import { useRari } from "context/RariContext";

// Hooks
import { ETH_TOKEN_DATA, TokenData } from "hooks/useTokenData";
import { createOracle } from "utils/createComptroller";
import { CTokenData, useCTokenData } from "hooks/fuse/useCTokenData";
import { OracleDataType } from "hooks/fuse/useOracleData";
import useIRMCurves from "hooks/fuse/useIRMCurves";

// Utils
import { handleGenericError } from "utils/errorHandling";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { isTokenETHOrWETH } from "utils/tokenUtils";
import { BigNumber } from "ethers";

// Libraries
import LogRocket from "logrocket";

// Components
import DeployButton from "./DeployButton";
import AssetConfig from "./AssetConfig";
import Screen1 from "./Screens/Screen1";
import Screen2 from "./Screens/Screen2";
import Screen3 from "./Screens/Screen3";
import { AddAssetContextData, AddAssetContext } from "context/AddAssetContext";
import { constants } from "ethers";
import { parseEther } from "@ethersproject/units";

const SimpleDeployment = [
  "Configuring your Fuse pool's Master Price Oracle",
  "Configuring your Fuse pool to support new asset market",
  "All Done!",
];

const UniSwapV3DeploymentSimple = [
  "Checking for pair's cardinality",
  "Increasing Uniswap V3 pair cardinality",
  "Deploying Uniswap V3 Twap Oracle",
  "Configuring your Fuse pool's Master Price Oracle",
  "Configuring your Fuse pool to support new asset market",
  "All Done!",
];

export type RETRY_FLAG = 1 | 2 | 3 | 4 | 5;

const AssetSettings = ({
  mode,
  poolID,
  poolName,
  tokenData,
  closeModal,
  oracleData,
  oracleModel,
  tokenAddress,
  cTokenAddress,
  existingAssets,
  poolOracleAddress,
  comptrollerAddress,
}: {
  comptrollerAddress: string; // Fuse pool's comptroller address
  poolOracleAddress: string; // Fuse pool's oracle address
  tokenAddress: string; // Underlying token's addres. i.e. USDC, DAI, etc.
  oracleModel: string | undefined; // Fuse pool's oracle model name. i.e MasterPrice, Chainlink, etc.
  oracleData: OracleDataType | undefined; // Fuse pool's oracle contract, admin, overwriting permissions.
  tokenData: TokenData; // Token's data i.e. symbol, logo, css color, etc.
  poolName: string; // Fuse pool's name.
  poolID: string; // Fuse pool's ID.

  // Only for editing mode
  cTokenAddress?: string; // CToken for Underlying token. i.e f-USDC-4

  // Only for add asset modal
  existingAssets?: USDPricedFuseAsset[]; // A list of assets in the pool

  // Modal config
  closeModal: () => any;
  mode: "Editing" | "Adding";
}) => {
  const toast = useToast();
  const { fuse, address } = useRari();
  const queryClient = useQueryClient();
  const isMobile = false;

  // Component state
  const [isDeploying, setIsDeploying] = useState(false);

  // Asset's general configurations.
  const [adminFee, setAdminFee] = useState(0);
  const [reserveFactor, setReserveFactor] = useState(10);
  const [isBorrowPaused, setIsBorrowPaused] = useState(false);
  const [collateralFactor, setCollateralFactor] = useState(50);

  const [checked, setChecked] = useState<boolean>(false);

  const [interestRateModel, setInterestRateModel] = useState(
    fuse.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES
      .JumpRateModel_Cream_Stables_Majors
  );

  const curves = useIRMCurves({ interestRateModel, adminFee, reserveFactor });
  // const curves = undefined

  // Asset's Oracle Configuration
  const [oracleTouched, setOracleTouched] = useState(false);
  const [activeOracleModel, setActiveOracleModel] = useState<string>(""); // Will store the oracle's model selected for this asset. i.e. Rari Master Price Oracle, Custome Oracle, etc.
  const [oracleAddress, setOracleAddress] = useState<string>(""); // Will store the actual address of the oracle.
  // Uniswap V3 base token oracle config - these following lines are used only
  // if you choose Uniswap V3 Twap Oracle as the asset's oracle.
  const [feeTier, setFeeTier] = useState<number>(0);
  const [uniV3BaseTokenAddress, setUniV3BaseTokenAddress] =
    useState<string>(""); // This will store the pair's base token.
  const [uniV3BaseTokenOracle, setUniV3BaseTokenOracle] = useState<string>(""); // This will store the oracle chosen for the uniV3BaseTokenAddress.
  const [baseTokenActiveOracleName, setBaseTokenActiveOracleName] =
    useState<string>("");
  const [uniV3BaseTokenHasOracle, setUniV3BaseTokenHasOracle] =
    useState<boolean>(false); // Will let us know if fuse pool's oracle has a price feed for the pair's base token.

  // This will be used to index whitelistPools array (fetched from the graph.)
  // It also helps us know if user has selected anything or not. If they have, detail fields are shown.
  const [activeUniSwapPair, setActiveUniSwapPair] = useState<string>("");

  // If uniV3BaseTokenAddress doesn't have an oracle in the fuse pool's oracle, then show the form
  // Or if the baseToken is weth then dont show form because we already have a hardcoded oracle for it
  const shouldShowUniV3BaseTokenOracleForm = useMemo(
    () =>
      !!uniV3BaseTokenAddress &&
      !uniV3BaseTokenHasOracle &&
      !isTokenETHOrWETH(uniV3BaseTokenAddress) &&
      (activeOracleModel === "Uniswap_V3_Oracle" ||
        activeOracleModel === "Uniswap_V2_Oracle" ||
        activeOracleModel === "SushiSwap_Oracle"),
    [uniV3BaseTokenHasOracle, uniV3BaseTokenAddress, activeOracleModel]
  );

  // If you choose a UniV3 Pool as the oracle, check if fuse pool's oracle can get a price for uniV3BaseTokenAddress
  useEffect(() => {
    if (
      !!uniV3BaseTokenAddress &&
      !isTokenETHOrWETH(uniV3BaseTokenAddress) &&
      !!oracleData &&
      typeof oracleData !== "string"
    ) {
      oracleData.oracleContract.callStatic
        .price(uniV3BaseTokenAddress)
        .then((price: string) => {
          // if you're able to get a price for this asset then
          return parseFloat(price) > 0
            ? setUniV3BaseTokenHasOracle(true)
            : setUniV3BaseTokenHasOracle(false);
        })
        .catch((err: any) => {
          console.log("Could not fetch price using pool's oracle");
          setUniV3BaseTokenHasOracle(false);
        });
    }
  }, [uniV3BaseTokenAddress, oracleData, setUniV3BaseTokenHasOracle]);

  // Sharad: New stuff  - to skip oracle step if possible
  const [defaultOracle, setDefaultOracle] = useState<string>(
    oracleData?.defaultOracle ?? ETH_TOKEN_DATA.address
  );
  const [customOracleForToken, setCustomOracleForToken] = useState<string>(
    ETH_TOKEN_DATA.address
  );
  const [priceForAsset, setPriceForAsset] = useState<undefined | number>();

  const hasDefaultOracle = useMemo(
    () => defaultOracle !== ETH_TOKEN_DATA.address,
    [defaultOracle]
  );

  const hasCustomOracleForToken = useMemo(
    () => customOracleForToken !== ETH_TOKEN_DATA.address,
    [customOracleForToken]
  );

  const hasPriceForAsset = useMemo(
    () => !!priceForAsset && priceForAsset > 0,
    [priceForAsset]
  );

  // For this asset, check for a defaultOracle, customOracle, and Pool MPO price for this token
  useEffect(() => {
    // If its a legacy oracle (type === string) then we cant create a MasterPriceOracle isntance for it and the user wont even be able to configure the oracle.
    if (!!oracleData && typeof oracleData !== "string") {
      const mpo = createOracle(poolOracleAddress, fuse, "MasterPriceOracle");

      // 1. Check if it has a default oracle
      mpo.callStatic
        .defaultOracle()
        .then((defaultOracle: string) => {
          // const defaultOracle = createOracle(defaultOracle, fuse, "MasterPriceOracle");
          setDefaultOracle(defaultOracle);
          return mpo.callStatic.oracles(tokenAddress);
        })
        .then((oracleForToken: string) => {
          // 2.) Check for Custom oracle
          setCustomOracleForToken(oracleForToken);
          return mpo.callStatic.price(tokenAddress);
        })
        .then((priceForAsset: string) => {
          // 3.) Check for price
          setPriceForAsset(parseFloat(priceForAsset));
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [oracleData, fuse, tokenAddress, poolOracleAddress]);

  // Modal Pages
  const [stage, setStage] = useState<number>(1);

  const handleSetStage = (incr: number) => {
    const newStage = stage + incr;

    // increment stage
    if (incr > 0) {
      if (isTokenETHOrWETH(tokenAddress) && newStage === 2) {
        setStage(3);
      } else setStage(newStage);
    }

    // decrement (previous page)
    else if (incr < 0) {
      if (isTokenETHOrWETH(tokenAddress) && newStage === 2) {
        setStage(1);
      } else setStage(newStage);
    }
  };

  // Transaction Stepper
  const [activeStep, setActiveStep] = useState<number>(0);

  // Retry Flag - start deploy function from here
  const [retryFlag, setRetryFlag] = useState<RETRY_FLAG>(1);
  const [needsRetry, setNeedsRetry] = useState<boolean>(false);

  // Set transaction steps based on type of Oracle deployed
  const steps: string[] =
    activeOracleModel === "Rari_Default_Oracle" ||
      activeOracleModel === "Chainlink_Oracle"
      ? SimpleDeployment
      : activeOracleModel === "Uniswap_V3_Oracle"
        ? UniSwapV3DeploymentSimple
        : SimpleDeployment;

  const increaseActiveStep = (step: string) => {
    setActiveStep(steps.indexOf(step));
  };

  const preDeployValidate = (oracleAddressToUse: string) => {
    // If pool already contains this asset:
    if (
      existingAssets!.some(
        (asset) => asset.underlyingToken === tokenData.address
      )
    ) {
      toast({
        title: "Error!",
        description: "You have already added this asset to this pool.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      throw new Error("You have already added this asset to this pool.");
    }

    // If you have not chosen an oracle
    if (!isTokenETHOrWETH(tokenAddress)) {
      if (oracleAddressToUse === "") {
        toast({
          title: "Error!",
          description: "Please choose a valid oracle for this asset",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });

        throw new Error("Please choose a valid oracle for this asset");
      }
    }
  };

  const checkUniV3Oracle = async () => {
    // If this oracle is set in the optional form (only if u have a univ3pair and the base token isnt in the oracle)
    // Then u have to deploy the base token )

    // Check for observation cardinality and fix if necessary
    const shouldPrime = await fuse.checkCardinality(oracleAddress);

    if (shouldPrime) {
      increaseActiveStep("Increasing Uniswap V3 pair cardinality");

      await fuse.primeUniswapV3Oracle(oracleAddress, { from: address });
    }
  };

  const deployUniV3Oracle = async () => {
    increaseActiveStep("Deploying Uniswap V3 Twap Oracle");

    // alert("deploying univ3twapOracle");

    // Deploy UniV3 oracle
    const oracleAddressToUse = await fuse.deployPriceOracle(
      "UniswapV3TwapPriceOracleV2",
      { feeTier, baseToken: uniV3BaseTokenAddress },
      { from: address }
    );

    // alert("finished univ3twapOracle " + oracleAddressToUse);

    return oracleAddressToUse;
  };

  // Deploy Oracle
  const addOraclesToMasterPriceOracle = async (oracleAddressToUse: string) => {
    /** Configure the pool's MasterPriceOracle  **/
    increaseActiveStep("Configuring your Fuse pool's Master Price Oracle");

    // Instantiate Fuse Pool's Oracle contract (Always "MasterPriceOracle")
    const poolOracleContract = createOracle(
      poolOracleAddress,
      fuse,
      "MasterPriceOracle"
    );

    const tokenArray = shouldShowUniV3BaseTokenOracleForm
      ? [tokenAddress, uniV3BaseTokenAddress] // univ3 only
      : [tokenAddress];

    const oracleAddress = shouldShowUniV3BaseTokenOracleForm
      ? [oracleAddressToUse, uniV3BaseTokenOracle] // univ3 only
      : [oracleAddressToUse];

    const hasOracles = await Promise.all(
      tokenArray.map(async (tokenAddr) => {
        const address: string = await poolOracleContract.callStatic.oracles(
          tokenAddr
        );

        // if address  is EmptyAddress then there is no oracle for this token
        return !(address === "0x0000000000000000000000000000000000000000");
      })
    );

    const tokenHasOraclesInPool = hasOracles.some((x) => !!x);

    // if (!tokenHasOraclesInPool) {
    const tx = await poolOracleContract.add(tokenArray, oracleAddress, {
      from: address,
    });

    toast({
      title: "You have successfully configured the oracle for this asset!",
      description:
        "Oracle will now point to the new selected address. Now, lets add you asset to the pool.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
    // }
  };

  const deployAssetToPool = async () => {
    increaseActiveStep(
      "Configuring your Fuse pool to support new asset market"
    );

    // 50% -> 0.5 * 1e18
    const bigCollateralFactor = parseEther(collateralFactor.toString())
      .div(100)
      .toString();

    // 10% -> 0.1 * 1e18
    const bigReserveFactor = parseEther(reserveFactor.toString())
      .div(100)
      .toString();

    // 5% -> 0.05 * 1e18
    const bigAdminFee = parseEther(adminFee.toString()).div(100).toString();

    const conf: any = {
      underlying: tokenData.address,
      comptroller: comptrollerAddress,
      interestRateModel,
      initialExchangeRateMantissa: constants.WeiPerEther,

      // Ex: BOGGED USDC
      name: poolName + " " + tokenData.name,
      // Ex: fUSDC-456
      symbol: "f" + tokenData.symbol + "-" + poolID,
      decimals: 8,
    };


    await fuse.deployAsset(
      conf,
      bigCollateralFactor,
      bigReserveFactor,
      bigAdminFee,
      { from: address },
      // TODO: Disable this. This bypasses the price feed check. Only using now because only trusted partners are deploying assets.
      true
    );

    increaseActiveStep("All Done!");
  };

  // Deploy Asset!
  const deploy = async () => {
    let oracleAddressToUse = oracleAddress;
    try {
      preDeployValidate(oracleAddressToUse);
    } catch (err) {
      return;
    }

    setIsDeploying(true);

    let _retryFlag = retryFlag;

    try {
      // It should be 1 if we haven't had to retry anything

      /** IF UNISWAP V3 ORACLE **/
      if (_retryFlag === 1) {
        setNeedsRetry(false);
        if (activeOracleModel === "Uniswap_V3_Oracle") {
          await checkUniV3Oracle();
        }
        _retryFlag = 2; // set it to two after we fall through step 1
      }

      console.log({ _retryFlag });

      /** IF UNISWAP V3 ORACLE **/
      if (_retryFlag === 2) {
        setNeedsRetry(false);
        if (activeOracleModel === "Uniswap_V3_Oracle") {
          oracleAddressToUse = await deployUniV3Oracle();
        }
        _retryFlag = 3;
      }


      console.log({ _retryFlag });

      // if (activeOracleModel === "Uniswap_V2_Oracle" || activeOracleModel === "SushiSwap_Oracle") {
      //   _retryFlag = 4;
      // } else {
      //   _retryFlag = 5;A
      // }

      /**  CONFIGURE MASTERPRICEORACLE **/
      // You dont need to configure if your asset is ETH / WETH
      // You dont need to configure if a default oracle is available and you have chosen it

      if (_retryFlag === 3) {
        const shouldAddToMasterPriceOracle =
          !isTokenETHOrWETH(tokenAddress) && oracleAddress !== defaultOracle;
        setNeedsRetry(false);
        if (
          shouldAddToMasterPriceOracle
          // If you have not selected the default oracle you will have to configure.
        ) {
          // alert("addOraclesToMasterPriceOracle");
          await addOraclesToMasterPriceOracle(oracleAddressToUse);
        }
        _retryFlag = 4;
      }

      console.log({ _retryFlag });

      /** DEPLOY ASSET  **/
      if (_retryFlag === 4) {
        setNeedsRetry(false);

        console.log({ _retryFlag });


        await deployAssetToPool();

        LogRocket.track("Fuse-DeployAsset");

        queryClient.refetchQueries();
        // Wait 2 seconds for refetch and then close modal.
        // We do this instead of waiting the refetch because some refetches take a while or error out and we want to close now.
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast({
          title: "You have successfully added an asset to this pool!",
          description: "You may now lend and borrow with this asset.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      }

      closeModal();
    } catch (e) {
      handleGenericError(e, toast);
      setRetryFlag(_retryFlag);
      console.log({ _retryFlag });
      setNeedsRetry(true);
    }
  };

  // Update values on refetch!
  const cTokenData = useCTokenData(comptrollerAddress, cTokenAddress);

  useEffect(() => {
    if (cTokenData) {
      setIsBorrowPaused(cTokenData.isPaused);
      setAdminFee(cTokenData.adminFeeMantissa / 1e16);
      setReserveFactor(cTokenData.reserveFactorMantissa / 1e16);
      setInterestRateModel(cTokenData.interestRateModelAddress);
      setCollateralFactor(cTokenData.collateralFactorMantissa / 1e16);
    }
  }, [cTokenData]);

  const args2: AddAssetContextData = {
    mode,
    isDeploying,
    setIsDeploying,
    adminFee,
    setAdminFee,
    reserveFactor,
    setReserveFactor,
    isBorrowPaused,
    setIsBorrowPaused,
    collateralFactor,
    setCollateralFactor,
    interestRateModel,
    setInterestRateModel,
    curves,
    oracleTouched,
    setOracleTouched,
    activeOracleModel,
    setActiveOracleModel,
    oracleAddress,
    setOracleAddress,
    feeTier,
    setFeeTier,
    uniV3BaseTokenAddress,
    setUniV3BaseTokenAddress: setUniV3BaseTokenAddress,
    uniV3BaseTokenOracle,
    setUniV3BaseTokenOracle,
    baseTokenActiveOracleName,
    setBaseTokenActiveOracleName,
    uniV3BaseTokenHasOracle,
    setUniV3BaseTokenHasOracle,
    activeUniSwapPair,
    setActiveUniSwapPair,
    shouldShowUniV3BaseTokenOracleForm,
    defaultOracle,
    setDefaultOracle,
    customOracleForToken,
    setCustomOracleForToken,
    priceForAsset,
    setPriceForAsset,
    hasDefaultOracle,
    hasCustomOracleForToken,
    hasPriceForAsset,
    stage,
    setStage,
    handleSetStage,
    activeStep,
    setActiveStep,
    increaseActiveStep,
    retryFlag,
    setRetryFlag,
    needsRetry,
    setNeedsRetry,
    cTokenData,
    cTokenAddress,
    oracleData,
    poolOracleAddress,
    poolOracleModel: oracleModel,
    tokenData,
    tokenAddress,
    comptrollerAddress,
  };

  if (mode === "Editing")
    return (
      <AddAssetContext.Provider value={args2}>
        <AssetConfig checked={checked} setChecked={setChecked} />
      </AddAssetContext.Provider>
    );

  return (
    cTokenAddress ? cTokenData?.cTokenAddress === cTokenAddress : true
  ) ? (
    <AddAssetContext.Provider value={args2}>
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        height="100%"
        minHeight="100%"
      >
        <Row
          mainAxisAlignment={"center"}
          crossAxisAlignment={"center"}
          w="100%"
          flexBasis={"10%"}
        // bg="green"
        >
          <Title stage={stage} />
        </Row>
        <RowOrColumn
          maxHeight="70%"
          isRow={!isMobile}
          crossAxisAlignment={stage < 3 ? "flex-start" : "center"}
          mainAxisAlignment={stage < 3 ? "flex-start" : "center"}
          height={!isDeploying ? "70%" : "60%"}
          width="100%"
          overflowY="auto"
          flexBasis={"80%"}
          flexGrow={1}
        // bg="red"
        >
          {stage === 1 ? (
            <Column
              width="100%"
              height="100%"
              d="flex"
              direction="row"
              mainAxisAlignment="center"
              crossAxisAlignment="center"
              alignItems="center"
              justifyContent="center"
            >
              <Screen1 checked={checked} setChecked={setChecked} />
            </Column>
          ) : stage === 2 ? (
            <Row
              width="100%"
              height="100%"
              d="flex"
              mainAxisAlignment="center"
              crossAxisAlignment="center"
              alignItems="center"
              justifyContent="center"
            // bg="aqua"
            >
              <Screen2 mode="Adding" checked={checked} setChecked={setChecked} />
            </Row>
          ) : (
            <Screen3 />
            // <Heading>SCREEN3</Heading>
          )}
        </RowOrColumn>
        <DeployButton steps={steps} deploy={deploy} />
        {/* {needsRetry && <Button onClick={deploy}>Retry</Button>} */}
      </Column>
    </AddAssetContext.Provider>
  ) : (
    <Center expand>
      <Spinner my={8} />
    </Center>
  );
};

export default AssetSettings;

const Title = ({ stage }: { stage: number }) => {
  return (
    <>
      <Fade
        in={stage === 1}
        unmountOnExit
        style={{ background: "transparent" }}
      >
        <Heading size="md"> Configure Interest Rate Model </Heading>
      </Fade>
      <Fade
        in={stage === 2}
        unmountOnExit
        style={{ background: "transparent" }}
      >
        <Heading size="md"> Configure Oracle </Heading>
      </Fade>
      <Fade
        in={stage === 3}
        unmountOnExit
        style={{ background: "transparent" }}
      >
        <Heading size="md"> Asset Config Summary </Heading>
      </Fade>
    </>
  );
};
