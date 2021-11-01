// Chakra and UI stuff
import {
  Heading,
  Box,
  Button,
  Text,
  Image,
  Input,
  useToast,
  Switch,
  Tab,
  TabList,
  Tabs,
  Spinner,
} from "@chakra-ui/react";
import { Row, Column, Center, useIsMobile } from "lib/chakraUtils";
import DashboardBox from "../../../../shared/DashboardBox";
import { ModalDivider } from "../../../../shared/Modal";
import { SwitchCSS } from "../../../../shared/SwitchCSS";

// React
import { useState } from "react";
import { HashLoader } from "react-spinners";
import { useQuery, useQueryClient } from "react-query";

// LogRocket
import LogRocket from "logrocket";

// Rari
import { useRari } from "../../../../../context/RariContext";
import { Fuse } from "../../../../../esm/index";

// Hooks
import { useTranslation } from "next-i18next";
import { fetchTokenBalance } from "../../../../../hooks/useTokenBalance";
import {
  ETH_TOKEN_DATA,
  useTokenData,
} from "../../../../../hooks/useTokenData";
import { useBorrowLimit } from "../../../../../hooks/useBorrowLimit";
import useUpdatedUserAssets from "hooks/fuse/useUpdatedUserAssets";

// Utils
import { BN, smallUsdFormatter } from "../../../../../utils/bigUtils";
import { Mode } from ".";
import { USDPricedFuseAsset } from "../../../../../utils/fetchFusePoolData";
import { createComptroller } from "../../../../../utils/createComptroller";
import { handleGenericError } from "../../../../../utils/errorHandling";
import { ComptrollerErrorCodes } from "../../FusePoolEditPage";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
} from "../../../../../utils/apyUtils";

import { Contract } from 'ethers';
import { BigNumber, utils, constants} from 'ethers'
import { toInt } from "utils/ethersUtils";

enum UserAction {
  NO_ACTION,
  WAITING_FOR_TRANSACTIONS,
}

export enum CTokenErrorCodes {
  NO_ERROR,
  UNAUTHORIZED,
  BAD_INPUT,
  COMPTROLLER_REJECTION,
  COMPTROLLER_CALCULATION_ERROR,
  INTEREST_RATE_MODEL_ERROR,
  INVALID_ACCOUNT_PAIR,
  INVALID_CLOSE_AMOUNT_REQUESTED,
  INVALID_COLLATERAL_FACTOR,
  MATH_ERROR,
  MARKET_NOT_FRESH,
  MARKET_NOT_LISTED,
  TOKEN_INSUFFICIENT_ALLOWANCE,
  TOKEN_INSUFFICIENT_BALANCE,
  TOKEN_INSUFFICIENT_CASH,
  TOKEN_TRANSFER_IN_FAILED,
  TOKEN_TRANSFER_OUT_FAILED,
  UTILIZATION_ABOVE_MAX,
}

interface Props {
  onClose: () => any;
  assets: USDPricedFuseAsset[];
  index: number;
  mode: Mode;
  setMode: (mode: Mode) => any;
  comptrollerAddress: string;
}

const AmountSelect = ({
  onClose,
  assets,
  index,
  mode,
  setMode,
  comptrollerAddress,
}: Props) => {
  const asset = assets[index];

  const { address, fuse } = useRari();

  const toast = useToast();

  const queryClient = useQueryClient();

  const tokenData = useTokenData(asset.underlyingToken);

  const [userAction, setUserAction] = useState(UserAction.NO_ACTION);

  const [userEnteredAmount, _setUserEnteredAmount] = useState("");

  const [amount, _setAmount] = useState<BigNumber>( constants.Zero );

  const showEnableAsCollateral = !asset.membership && mode === Mode.SUPPLY;
  const [enableAsCollateral, setEnableAsCollateral] = useState(
    showEnableAsCollateral
  );

  const { t } = useTranslation();

  const updateAmount = (newAmount: string) => {
    if (newAmount.startsWith("-")) return;

    _setUserEnteredAmount(newAmount);

    const bigAmount = utils.parseUnits(newAmount, tokenData?.decimals)

    bigAmount.lt(constants.Zero)
      ? _setAmount(constants.Zero)
      : _setAmount(bigAmount);

    setUserAction(UserAction.NO_ACTION);
  };

  const { data: amountIsValid } = useQuery(
    (amount?.toString() ?? "null") + " " + mode + " isValid",
    async () => {
      if (amount === null || amount.isZero()) {
        return false;
      }

      try {
        const max = await fetchMaxAmount(
          mode,
          fuse,
          address,
          asset,
          comptrollerAddress
        );

        return (amount.div(constants.WeiPerEther)).lte(max);
      } catch (e) {
        handleGenericError(e, toast);
        return false;
      }
    }
  );

  let depositOrWithdrawAlert = null;

  if (amount === null || amount.isZero()) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = t("Enter a valid amount to supply.");
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = t("Enter a valid amount to borrow.");
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = t("Enter a valid amount to withdraw.");
    } else {
      depositOrWithdrawAlert = t("Enter a valid amount to repay.");
    }
  } else if (amountIsValid === undefined) {
    depositOrWithdrawAlert = t("Loading your balance of {{token}}...", {
      token: asset.underlyingSymbol,
    });
  } else if (!amountIsValid) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = t("You don't have enough {{token}}!", {
        token: asset.underlyingSymbol,
      });
    } else if (mode === Mode.REPAY) {
      depositOrWithdrawAlert = t(
        "You don't have enough {{token}} or are over-repaying!",
        {
          token: asset.underlyingSymbol,
        }
      );
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = t("You cannot withdraw this much!");
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = t("You cannot borrow this much!");
    }
  } else {
    depositOrWithdrawAlert = null;
  }

  const isMobile = useIsMobile();

  const length = depositOrWithdrawAlert?.length ?? 0;
  let depositOrWithdrawAlertFontSize;
  if (length < 40) {
    depositOrWithdrawAlertFontSize = !isMobile ? "xl" : "17px";
  } else if (length < 50) {
    depositOrWithdrawAlertFontSize = !isMobile ? "15px" : "11px";
  } else if (length < 60) {
    depositOrWithdrawAlertFontSize = !isMobile ? "14px" : "10px";
  }

  const onConfirm = async () => {
    try {
      setUserAction(UserAction.WAITING_FOR_TRANSACTIONS);

      const isETH = asset.underlyingToken === ETH_TOKEN_DATA.address;

      const isRepayingMax =
        amount!.eq(asset.borrowBalance) && !isETH && mode === Mode.REPAY;

      isRepayingMax && console.log("Using max repay!");

      const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #

      const cToken = new Contract(
        asset.cToken,
        isETH
          ? JSON.parse(
              fuse.compoundContracts[
                "contracts/CEtherDelegate.sol:CEtherDelegate"
              ].abi
            )
          : JSON.parse(
              fuse.compoundContracts[
                "contracts/CErc20Delegate.sol:CErc20Delegate"
              ].abi
            ),
          fuse.provider.getSigner()
      );

      if (mode === Mode.SUPPLY || mode === Mode.REPAY) {
        // if not eth check if amounti is approved for thsi token
        if (!isETH) {
          const token = new Contract(
            asset.underlyingToken,
            JSON.parse( fuse.compoundContracts[ "contracts/EIP20Interface.sol:EIP20Interface"].abi ),
            fuse.provider.getSigner()
          );

          const hasApprovedEnough = (
            await token.callStatic.allowance(address, cToken.address)).gte(amount);

            if (!hasApprovedEnough) {
              await token.approve(cToken.address, max)
            }

          LogRocket.track("Fuse-Approve");
        }

        // if ur suplying, then
        if (mode === Mode.SUPPLY) {
          // If they want to enable as collateral now, enter the market:
          if (enableAsCollateral) {
            const comptroller = createComptroller(comptrollerAddress, fuse);
            // Don't await this, we don't care if it gets executed first!
            comptroller.enterMarkets([asset.cToken])

            LogRocket.track("Fuse-ToggleCollateral");
          }

          if (isETH) {
            const call = cToken.mint; //

            if (
              // If they are supplying their whole balance:
              amount === (await fuse.provider.getBalance(address))
            ) {
              // full balance of ETH

              // Subtract gas for max ETH
              const { gasWEI, gasPrice, estimatedGas } = await fetchGasForCall(
                call,
                amount,
                fuse,
                address
              );

              await call({
                from: address,
                value: amount.sub(gasWEI),

                gasPrice,
                gas: estimatedGas,
              });
            } else {
              // custom amount of ETH
              await call({
                from: address,
                value: amount,
              });
            }
          } else {
            //  Custom amount of ERC20
            await testForCTokenErrorAndSend(
              cToken.callStatic.mint,
              amount,
              cToken.mint,
              "Cannot deposit this amount right now!"
            );
          }

          await testForCTokenErrorAndSend(
            cToken.callStatic.borrow,
            amount,
            cToken.borrow,
            "Cannot borrow this amount right now!"
          );

          LogRocket.track("Fuse-Supply");
        } else if (mode === Mode.REPAY) {
          if (isETH) {
            const call = cToken.repayBorrow();

            if (
              // If they are repaying their whole balance:
              amount === (await fuse.provider.getBalance(address))
            ) {
              // Subtract gas for max ETH

              const { gasWEI, gasPrice, estimatedGas } = await fetchGasForCall(
                call,
                amount,
                fuse,
                address
              );

              await call.send({
                from: address,
                value: amount.sub(gasWEI),

                gasPrice,
                gas: estimatedGas,
              });
            } else {
              await call.send({
                from: address,
                value: amount,
              });
            }
          } else {
            await testForCTokenErrorAndSend(
              cToken.callStatic.repayBorrow,
              isRepayingMax ? max : amount,
              address,
              "Cannot repay this amount right now!"
            );
          }

          LogRocket.track("Fuse-Repay");
        }
      } else if (mode === Mode.BORROW) {
        await testForCTokenErrorAndSend(
          cToken.borrow,
          amount,
          address,
          "Cannot borrow this amount right now!"
        );

        LogRocket.track("Fuse-Borrow");
      } else if (mode === Mode.WITHDRAW) {
        await testForCTokenErrorAndSend(
          cToken.redeemUnderlying,
          amount,
          address,
          "Cannot withdraw this amount right now!"
        );

        LogRocket.track("Fuse-Withdraw");
      }

      queryClient.refetchQueries();

      // Wait 2 seconds for refetch and then close modal.
      // We do this instead of waiting the refetch because some refetches take a while or error out and we want to close now.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("made it")
      onClose();
    } catch (e) {
      handleGenericError(e, toast);
      setUserAction(UserAction.NO_ACTION);
    }
  };

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height={showEnableAsCollateral ? "575px" : "500px"}
    >
      {userAction === UserAction.WAITING_FOR_TRANSACTIONS ? (
        <Column
          expand
          mainAxisAlignment="center"
          crossAxisAlignment="center"
          p={4}
        >
          <HashLoader size={70} color={tokenData?.color ?? "#FFF"} loading />
          <Heading mt="30px" textAlign="center" size="md">
            {t("Check your wallet to submit the transactions")}
          </Heading>
          <Text fontSize="sm" mt="15px" textAlign="center">
            {t("Do not close this tab until you submit all transactions!")}
          </Text>
        </Column>
      ) : (
        <>
          <Row
            width="100%"
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            p={4}
            height="72px"
            flexShrink={0}
          >
            <Box height="35px" width="35px">
              <Image
                width="100%"
                height="100%"
                borderRadius="50%"
                src={
                  tokenData?.logoURL ??
                  "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
                }
                alt=""
              />
            </Box>

            <Heading fontSize="27px" ml={3}>
              {!isMobile && asset.underlyingName.length < 25
                ? asset.underlyingName
                : asset.underlyingSymbol}
            </Heading>
          </Row>

          <ModalDivider />

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            px={4}
            pb={4}
            pt={1}
            height="100%"
          >
            <Column
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-start"
              width="100%"
            >
              <TabBar color={tokenData?.color} mode={mode} setMode={setMode} />

              <DashboardBox width="100%" height="70px">
                <Row
                  p={4}
                  mainAxisAlignment="space-between"
                  crossAxisAlignment="center"
                  expand
                >
                  <AmountInput
                    color={tokenData?.color ?? "#FFF"}
                    displayAmount={userEnteredAmount}
                    updateAmount={updateAmount}
                  />
                  <TokenNameAndMaxButton
                    comptrollerAddress={comptrollerAddress}
                    mode={mode}
                    logoURL={
                      tokenData?.logoURL ??
                      "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
                    }
                    asset={asset}
                    updateAmount={updateAmount}
                  />
                </Row>
              </DashboardBox>
            </Column>

            <StatsColumn
              amount={amount}
              color={tokenData?.color ?? "#FFF"}
              assets={assets}
              index={index}
              mode={mode}
              enableAsCollateral={enableAsCollateral}
            />

            {showEnableAsCollateral ? (
              <DashboardBox p={4} width="100%" mt={4}>
                <Row
                  mainAxisAlignment="space-between"
                  crossAxisAlignment="center"
                  width="100%"
                >
                  <Text fontWeight="bold">{t("Enable As Collateral")}:</Text>
                  <SwitchCSS
                    symbol={asset.underlyingSymbol}
                    color={tokenData?.color}
                  />
                  <Switch
                    h="20px"
                    className={asset.underlyingSymbol + "-switch"}
                    isChecked={enableAsCollateral}
                    onChange={() => {
                      setEnableAsCollateral((past) => !past);
                    }}
                  />
                </Row>
              </DashboardBox>
            ) : null}

            <Button
              mt={4}
              fontWeight="bold"
              fontSize={
                depositOrWithdrawAlert ? depositOrWithdrawAlertFontSize : "2xl"
              }
              borderRadius="10px"
              width="100%"
              height="70px"
              bg={tokenData?.color ?? "#FFF"}
              color={tokenData?.overlayTextColor ?? "#000"}
              // If the size is small, this means the text is large and we don't want the font size scale animation.
              className={
                isMobile ||
                depositOrWithdrawAlertFontSize === "14px" ||
                depositOrWithdrawAlertFontSize === "15px"
                  ? "confirm-button-disable-font-size-scale"
                  : ""
              }
              _hover={{ transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.95)" }}
              onClick={onConfirm}
              isDisabled={!amountIsValid}
            >
              {depositOrWithdrawAlert ?? t("Confirm")}
            </Button>
          </Column>
        </>
      )}
    </Column>
  );
};

export default AmountSelect;

const TabBar = ({
  color,
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => any;
  color: string | null | undefined;
}) => {
  const isSupplySide = mode < 2;
  const { t } = useTranslation();

  // Woohoo okay so there's some pretty weird shit going on in this component.

  // The AmountSelect component gets passed a `mode` param which is a `Mode` enum. The `Mode` enum has 4 values (SUPPLY, WITHDRAW, BORROW, REPAY).
  // The `mode` param is used to determine what text gets rendered and what action to take on clicking the confirm button.

  // As part of our simple design for the modal, we only show 2 mode options in the tab bar at a time.

  // When the modal is triggered it is given a `defaultMode` (starting mode). This is passed in by the component which renders the modal.
  // - If the user starts off in SUPPLY or WITHDRAW, we only want show them the option to switch between SUPPLY and WITHDRAW.
  // - If the user starts off in BORROW or REPAY, we want to only show them the option to switch between BORROW and REPAY.

  // However since the tab list has only has 2 tabs under it. It accepts an `index` parameter which determines which tab to show as "selected". Since we only show 2 tabs, it can either be 0 or 1.
  // This means we can't just pass `mode` to `index` because `mode` could be 2 or 3 (for BORROW or REPAY respectively) which would be invalid.

  // To solve this, if the mode is BORROW or REPAY we pass the index as `mode - 2` which transforms the BORROW mode to 0 and the REPAY mode to 1.

  // However, we also need to do the opposite of that logic in `onChange`:
  // - If a user clicks a tab and the current mode is SUPPLY or WITHDRAW we just pass that index (0 or 1 respectively) to setMode.
  // - But if a user clicks on a tab and the current mode is BORROW or REPAY, we need to add 2 to the index of the tab so it's the right index in the `Mode` enum.
  //   - Otherwise whenver you clicked on a tab it would always set the mode to SUPPLY or BORROW when clicking the left or right button respectively.

  // Does that make sense? Everything I described above is basically a way to get around the tab component's understanding that it only has 2 tabs under it to make it fit into our 4 value enum setup.
  // Still confused? DM me on Twitter (@transmissions11) for help.

  return (
    <>
      <style>
        {`
            
            .chakra-tabs__tab {
              color: ${color ?? "#FFFFFF"} !important;

              border-bottom-width: 1px;
            }

            .chakra-tabs__tablist {
              border-bottom: 1px solid;
              border-color: #272727;
            }
            
        `}
      </style>
      <Box px={3} width="100%" mt={1} mb="-1px" zIndex={99999}>
        <Tabs
          isFitted
          width="100%"
          align="center"
          index={isSupplySide ? mode : mode - 2}
          onChange={(index: number) => {
            if (isSupplySide) {
              return setMode(index);
            } else {
              return setMode(index + 2);
            }
          }}
        >
          <TabList>
            {isSupplySide ? (
              <>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Supply")}
                </Tab>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Withdraw")}
                </Tab>
              </>
            ) : (
              <>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Borrow")}
                </Tab>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Repay")}
                </Tab>
              </>
            )}
          </TabList>
        </Tabs>
      </Box>
    </>
  );
};

const StatsColumn = ({
  color,
  mode,
  assets,
  index,
  amount,
  enableAsCollateral,
}: {
  color: string;
  mode: Mode;
  assets: USDPricedFuseAsset[];
  index: number;
  amount: BigNumber;
  enableAsCollateral: boolean;
}) => {
  const { t } = useTranslation();

  console.log(amount.toString())

  // Get the new representation of a user's USDPricedFuseAssets after proposing a supply amount.
  const updatedAssets: USDPricedFuseAsset[] | undefined = useUpdatedUserAssets({
    mode,
    assets,
    index,
    amount,
  });

  // Define the old and new asset (same asset different numerical values)
  const asset = assets[index];
  const updatedAsset = updatedAssets ? updatedAssets[index] : null;

  // Calculate Old and new Borrow Limits
  const borrowLimit = useBorrowLimit(assets, {}, index);
  const updatedBorrowLimit = useBorrowLimit(updatedAssets ?? [], {
    ignoreIsEnabledCheckFor: enableAsCollateral ? asset.cToken : undefined,
  }, index);

  const isSupplyingOrWithdrawing =
    mode === Mode.SUPPLY || mode === Mode.WITHDRAW;

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const borrowAPR = convertMantissaToAPR(asset.borrowRatePerBlock);

  const updatedSupplyAPY = convertMantissaToAPY(
    updatedAsset?.supplyRatePerBlock ?? constants.Zero,
    365
  );

  const updatedBorrowAPR = convertMantissaToAPR(
    updatedAsset?.borrowRatePerBlock ?? constants.Zero
  );
  
  console.log(borrowLimit.toString(), "borrow Limit")
  console.log(updatedBorrowLimit.toString(), "updated borrow limit")

  // If the difference is greater than a 0.1 percentage point change, alert the user
  const updatedAPYDiffIsLarge = isSupplyingOrWithdrawing
    ? Math.abs(updatedSupplyAPY - supplyAPY) > 0.1
    : Math.abs(updatedBorrowAPR - borrowAPR) > 0.1;


  const parsedUpdatedBorrowLimit = utils.formatEther(updatedBorrowLimit.div(constants.WeiPerEther).div(constants.WeiPerEther))
  const parsedUpdatedDebtBalance = updatedAsset ? utils.formatEther(updatedAsset.borrowBalanceUSD.div(constants.WeiPerEther)) : "0.00"

  return (
    <DashboardBox width="100%" height="190px" mt={4}>
      {updatedAsset ? (
        <Column
          mainAxisAlignment="space-between"
          crossAxisAlignment="flex-start"
          expand
          py={3}
          px={4}
          fontSize="lg"
        >
          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
            color={color}
          >
            <Text fontWeight="bold" flexShrink={0}>
              {t("Supply Balance")}:
            </Text>
            <Text
              fontWeight="bold"
              flexShrink={0}
              fontSize={isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {utils.commify(utils.formatUnits(asset.supplyBalance, asset.underlyingDecimals)) }
              {isSupplyingOrWithdrawing ? (
                <>
                  {" → "}
                  {utils.commify(utils.formatUnits(updatedAsset.supplyBalance, updatedAsset.underlyingDecimals)) }
                </>
              ) : null}{" "}
              {asset.underlyingSymbol}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold" flexShrink={0}>
              {isSupplyingOrWithdrawing ? t("Supply APY") : t("Borrow APR")}:
            </Text>
            <Text
              fontWeight="bold"
              fontSize={updatedAPYDiffIsLarge ? "sm" : "lg"}
            >
              {isSupplyingOrWithdrawing
                ? supplyAPY.toFixed(2)
                : borrowAPR.toFixed(2)}
              %
              {updatedAPYDiffIsLarge ? (
                <>
                  {" → "}
                  {isSupplyingOrWithdrawing
                    ? updatedSupplyAPY.toFixed(2)
                    : updatedBorrowAPR.toFixed(2)}
                  %
                </>
              ) : null}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold" flexShrink={0}>
              {t("Borrow Limit")}:
            </Text>
            <Text
              fontWeight="bold"
              fontSize={isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {smallUsdFormatter( parseInt(utils.formatEther(borrowLimit.div(constants.WeiPerEther))) )
                }
              {isSupplyingOrWithdrawing ? (
                <>
                  {" → "} {"$" + utils.commify(parsedUpdatedBorrowLimit.slice(0, (parsedUpdatedBorrowLimit.indexOf(".") + 3)))
                                  }
                </>
              ) : null}{" "}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold">{t("Debt Balance")}:</Text>
            <Text
              fontWeight="bold"
              fontSize={!isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {"$" + utils.formatEther(asset.borrowBalanceUSD)//smallUsdFormatter(
                }
              {!isSupplyingOrWithdrawing ? (
                <>
                  {" → "}
                  {"$" + utils.commify(parsedUpdatedDebtBalance.slice(0, (parsedUpdatedDebtBalance.indexOf(".") + 3))) // smallUsdFormatter(
                    }
                </>     
              ) : null}
            </Text>
          </Row>
        </Column>
      ) : (
        <Center expand>
          <Spinner />
        </Center>
      )}
    </DashboardBox>
  );
};

const TokenNameAndMaxButton = ({
  updateAmount,
  logoURL,
  asset,
  mode,
  comptrollerAddress,
}: {
  logoURL: string;
  asset: USDPricedFuseAsset;
  mode: Mode;
  comptrollerAddress: string;
  updateAmount: (newAmount: string) => any;
}) => {
  const { fuse, address } = useRari();

  const toast = useToast();

  const [isMaxLoading, setIsMaxLoading] = useState(false);

  const setToMax = async () => {
    setIsMaxLoading(true);

    try {
      const maxBN = await fetchMaxAmount(
        mode,
        fuse,
        address,
        asset,
        comptrollerAddress
      );

      if (maxBN!.lt(constants.Zero) || maxBN!.isZero()) {
        updateAmount("");
      } else {
        const str = maxBN.div(asset.underlyingDecimals).toString()

        updateAmount(str);
      }

      setIsMaxLoading(false);
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const { t } = useTranslation();

  return (
    <Row
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      flexShrink={0}
    >
      <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
        <Box height="25px" width="25px" mb="2px" mr={2}>
          <Image
            width="100%"
            height="100%"
            borderRadius="50%"
            backgroundImage={`url(/static/small-white-circle.png)`}
            src={logoURL}
            alt=""
          />
        </Box>
        <Heading fontSize="24px" mr={2} flexShrink={0}>
          {asset.underlyingSymbol}
        </Heading>
      </Row>

      <Button
        ml={1}
        height="28px"
        width="58px"
        bg="transparent"
        border="2px"
        borderRadius="8px"
        borderColor="#272727"
        fontSize="sm"
        fontWeight="extrabold"
        _hover={{}}
        _active={{}}
        onClick={setToMax}
        isLoading={isMaxLoading}
      >
        {t("MAX")}
      </Button>
    </Row>
  );
};

const AmountInput = ({
  displayAmount,
  updateAmount,
  color,
}: {
  displayAmount: string;
  updateAmount: (symbol: string) => any;
  color: string;
}) => {
  return (
    <Input
      type="number"
      inputMode="decimal"
      fontSize="3xl"
      fontWeight="bold"
      variant="unstyled"
      _placeholder={{ color }}
      placeholder="0.0"
      value={displayAmount}
      color={color}
      onChange={(event) => updateAmount(event.target.value)}
      mr={4}
    />
  );
};

export async function testForCTokenErrorAndSend(
  txObjectStaticCall: any, // for static calls
  txArgs: any,
  txObject: any, // actual method
  failMessage: string
) {
  let response = await txObjectStaticCall(txArgs);
  console.log(response)
  // For some reason `response` will be `["0"]` if no error but otherwise it will return a string of a number.
  if (response.toString() !== "0") {
    response = parseInt(response);

    let err;

    if (response >= 1000) {
      const comptrollerResponse = response - 1000;

      let msg = ComptrollerErrorCodes[comptrollerResponse];

      if (msg === "BORROW_BELOW_MIN") {
        msg =
          "As part of our guarded launch, you cannot borrow less than 1 ETH worth of tokens at the moment.";
      }

      // This is a comptroller error:
      err = new Error(failMessage + " Comptroller Error: " + msg);
    } else {
      // This is a standard token error:
      err = new Error(
        failMessage + " CToken Code: " + CTokenErrorCodes[response]
      );
    }

    LogRocket.captureException(err);
    throw err;
  }

  return txObject(txArgs);
}

export const fetchGasForCall = async (
  call: any,
  amountBN: BigNumber,
  fuse: Fuse,
  address: string
) => {
  const estimatedGas = BigNumber.from(
    (
      (await call.estimateGas({
        from: address,
        // Cut amountBN in half in case it screws up the gas estimation by causing a fail in the event that it accounts for gasPrice > 0 which means there will not be enough ETH (after paying gas)
        value: amountBN.div(BigNumber.from(2)),
      })) *
      // 50% more gas for limit:
      1.5
    ).toFixed(0)
  );

  // Ex: 100 (in GWEI)
  const { standard } = await fetch("https://gasprice.poa.network").then((res) =>
    res.json()
  );

  const gasPrice = utils.parseUnits(standard.toString(), "gwei")
  const gasWEI = estimatedGas.mul(gasPrice);

  return { gasWEI, gasPrice, estimatedGas };
};

async function fetchMaxAmount(
  mode: Mode,
  fuse: Fuse,
  address: string,
  asset: USDPricedFuseAsset,
  comptrollerAddress: string
) {
  if (mode === Mode.SUPPLY) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );

    return balance;
  }

  if (mode === Mode.REPAY) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );
    const debt = BigNumber.from(asset.borrowBalance);

    if (balance.gt(debt)) {
      return debt;
    } else {
      return balance;
    }
  }

  if (mode === Mode.BORROW) {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const { 0: err, 1: maxBorrow } = await comptroller.callStatic.getMaxBorrow(address, asset.cToken)

    if (err !== 0) {
      return maxBorrow.mul(utils.parseUnits("0.75")).toString()
    } else {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }

  if (mode === Mode.WITHDRAW) {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const { 0: err, 1: maxRedeem } = await comptroller.callStatic.getMaxRedeem(address, asset.cToken)

    if (err !== 0) {
      return BigNumber.from(maxRedeem);
    } else {
      throw new Error("Could not fetch your max withdraw amount! Code: " + err);
    }
  }
}
