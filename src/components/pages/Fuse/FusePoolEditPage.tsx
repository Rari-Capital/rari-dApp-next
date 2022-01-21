// Chakra and UI
import {
  AvatarGroup,
  Box,
  Heading,
  Text,
  Switch,
  useDisclosure,
  Spinner,
  useToast,
  // Table
  Image,
  HStack,
  Th,
  Thead,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
} from "@chakra-ui/react";
import { ModalDivider } from "components/shared/Modal";
import DashboardBox from "components/shared/DashboardBox";
import { Column, RowOrColumn, Center, Row } from "lib/chakraUtils";
import { SliderWithLabel } from "components/shared/SliderWithLabel";

// Components
import AddAssetModal from "./Modals/AddAssetModal/AddAssetModal";
// import AssetSettings from "./Modals/AddAssetModal/AssetSettings";

// React
import { useQueryClient, useQuery } from "react-query";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";

// Components
import {
  CTokenAvatarGroup,
  CTokenIcon,
} from "components/shared/Icons/CTokenIcon";
import { WhitelistInfo } from "./FusePoolCreatePage";
import FuseStatsBar from "./FuseStatsBar";
import FuseTabBar from "./FuseTabBar";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useTokenData } from "hooks/useTokenData";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { useIsSemiSmallScreen } from "hooks/useIsSemiSmallScreen";
import { useFusePoolData } from "hooks/useFusePoolData";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Utils
import { createComptroller } from "utils/createComptroller";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { handleGenericError } from "utils/errorHandling";

// LogRocket
import LogRocket from "logrocket";

// Ethers
import { Contract, utils, BigNumber } from "ethers";
import {
  useCTokensUnderlying,
  usePoolIncentives,
} from "hooks/rewards/usePoolIncentives";
import {
  RewardsDistributor,
  useRewardsDistributorsForPool,
} from "hooks/rewards/useRewardsDistributorsForPool";
import { useTokenBalance } from "hooks/useTokenBalance";
import AddRewardsDistributorModal from "./Modals/AddRewardsDistributorModal";
import EditRewardsDistributorModal from "./Modals/EditRewardsDistributorModal";
import { useExtraPoolInfo } from "hooks/fuse/info/useExtraPoolInfo";
import AssetSettings from "./Modals/AddAssetModal/AssetSettings";
import useOraclesForPool from "hooks/fuse/useOraclesForPool";
import { OracleDataType, useOracleData } from "hooks/fuse/useOracleData";

const activeStyle = { bg: "#FFF", color: "#000" };
const noop = () => { };

const formatPercentage = (value: number) => value.toFixed(0) + "%";

export enum ComptrollerErrorCodes {
  NO_ERROR,
  UNAUTHORIZED,
  COMPTROLLER_MISMATCH,
  INSUFFICIENT_SHORTFALL,
  INSUFFICIENT_LIQUIDITY,
  INVALID_CLOSE_FACTOR,
  INVALID_COLLATERAL_FACTOR,
  INVALID_LIQUIDATION_INCENTIVE,
  MARKET_NOT_ENTERED, // no longer possible
  MARKET_NOT_LISTED,
  MARKET_ALREADY_LISTED,
  MATH_ERROR,
  NONZERO_BORROW_BALANCE,
  PRICE_ERROR,
  REJECTION,
  SNAPSHOT_ERROR,
  TOO_MANY_ASSETS,
  TOO_MUCH_REPAY,
  SUPPLIER_NOT_WHITELISTED,
  BORROW_BELOW_MIN,
  SUPPLY_ABOVE_MAX,
}

export const useIsUpgradeable = (comptrollerAddress: string) => {
  const { fuse } = useRari();

  const { data } = useQuery(comptrollerAddress + " isUpgradeable", async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const isUpgradeable: boolean =
      await comptroller.callStatic.adminHasRights();

    return isUpgradeable;
  });

  return data;
};

export async function testForComptrollerErrorAndSend(
  callStaticTxObject: Promise<any>,
  txObject: any,
  caller: string,
  failMessage: string
) {
  let response = await callStaticTxObject

  // For some reason `response` will be `["0"]` if no error but otherwise it will return a string number.
  if (!!response[0] && response[0].toString() !== "0") {
    const err = new Error(
      failMessage + " Code: " + ComptrollerErrorCodes[response]
    );

    LogRocket.captureException(err);
    throw err;
  }

  return txObject;
}

const FusePoolEditPage = memo(() => {
  const isMobile = useIsSemiSmallScreen();

  const {
    isOpen: isAddAssetModalOpen,
    onOpen: openAddAssetModal,
    onClose: closeAddAssetModal,
  } = useDisclosure();

  const {
    isOpen: isAddRewardsDistributorModalOpen,
    onOpen: openAddRewardsDistributorModal,
    onClose: closeAddRewardsDistributorModal,
  } = useDisclosure();

  const {
    isOpen: isEditRewardsDistributorModalOpen,
    onOpen: openEditRewardsDistributorModal,
    onClose: closeEditRewardsDistributorModal,
  } = useDisclosure();

  const authedOpenModal = useAuthedCallback(openAddAssetModal);

  const { t } = useTranslation();

  const router = useRouter();
  const poolId = router.query.poolId as string;

  const data = useFusePoolData(poolId);

  const { fuse } = useRari();
  const comptroller = createComptroller(data?.comptroller ?? "", fuse);
  console.log({ comptroller });

  // Maps underlying to oracle
  const oraclesMap = useOraclesForPool(
    data?.oracle,
    data?.assets?.map((asset: USDPricedFuseAsset) => asset.underlyingToken) ??
    []
  );

  // console.log({ oraclesMap });

  // RewardsDistributor stuff
  const poolIncentives = usePoolIncentives(data?.comptroller);
  const rewardsDistributors = useRewardsDistributorsForPool(data?.comptroller);
  const [rewardsDistributor, setRewardsDistributor] = useState<
    RewardsDistributor | undefined
  >();

  // console.log({ poolIncentives, rewardsDistributors });

  const handleRewardsRowClick = useCallback(
    (rD: RewardsDistributor) => {
      setRewardsDistributor(rD);
      openEditRewardsDistributorModal();
    },
    [setRewardsDistributor, openEditRewardsDistributorModal]
  );

  return (
    <>
      {data ? (
        <AddAssetModal
          comptrollerAddress={data.comptroller}
          poolOracleAddress={data.oracle}
          oracleModel={data.oracleModel}
          existingAssets={data.assets}
          poolName={data.name}
          poolID={poolId}
          isOpen={isAddAssetModalOpen}
          onClose={closeAddAssetModal}
        />
      ) : null}

      {data ? (
        <AddRewardsDistributorModal
          comptrollerAddress={data.comptroller}
          poolName={data.name}
          poolID={poolId}
          isOpen={isAddRewardsDistributorModalOpen}
          onClose={closeAddRewardsDistributorModal}
        />
      ) : null}

      {data && !!rewardsDistributor ? (
        <EditRewardsDistributorModal
          rewardsDistributor={rewardsDistributor}
          pool={data}
          isOpen={isEditRewardsDistributorModalOpen}
          onClose={closeEditRewardsDistributorModal}
        />
      ) : null}

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        color="#FFFFFF"
        mx="auto"
        width={isMobile ? "100%" : "1150px"}
        px={isMobile ? 4 : 0}
      // bg="pink"
      >
        {/* <FuseStatsBar />

        <FuseTabBar /> */}

        <RowOrColumn
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          isRow={!isMobile}
        >
          <DashboardBox
            width={isMobile ? "100%" : "50%"}
            height={isMobile ? "auto" : "440px"}
            mt={4}
          >
            {data ? (
              <PoolConfiguration
                assets={data.assets}
                comptrollerAddress={data.comptroller}
              />
            ) : (
              <Center expand>
                <Spinner my={8} />
              </Center>
            )}
          </DashboardBox>

          <Box pl={isMobile ? 0 : 4} width={isMobile ? "100%" : "50%"}>
            <DashboardBox
              width="100%"
              mt={4}
              height={isMobile ? "auto" : "440px"}
            >
              {data ? (
                data.assets.length > 0 ? (
                  <AssetConfiguration
                    openAddAssetModal={authedOpenModal}
                    assets={data.assets}
                    poolOracleAddress={data.oracle}
                    oracleModel={data.oracleModel}
                    comptrollerAddress={data.comptroller}
                    poolID={poolId}
                    poolName={data.name}
                  />
                ) : (
                  <Column
                    expand
                    mainAxisAlignment="center"
                    crossAxisAlignment="center"
                    py={4}
                  >
                    <Text mb={4}>{t("There are no assets in this pool.")}</Text>

                    <AddAssetButton
                      comptrollerAddress={data.comptroller}
                      openAddAssetModal={authedOpenModal}
                    />
                  </Column>
                )
              ) : (
                <Center expand>
                  <Spinner my={8} />
                </Center>
              )}
            </DashboardBox>
          </Box>
        </RowOrColumn>

        {/* Rewards Distributors */}
        <DashboardBox w="100%" h="100%" my={4}>
          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            p={3}
          >
            <Heading size="md">Rewards Distributors </Heading>
            {data?.comptroller && (
              <AddRewardsDistributorButton
                openAddRewardsDistributorModal={openAddRewardsDistributorModal}
                comptrollerAddress={data.comptroller}
              />
            )}
          </Row>

          {!!data && !rewardsDistributors.length && (
            <Column
              w="100%"
              h="100%"
              mainAxisAlignment="center"
              crossAxisAlignment="center"
              p={4}
            >
              <Text mb={4}>
                {t("There are no RewardsDistributors for this pool.")}
              </Text>
              <AddRewardsDistributorButton
                openAddRewardsDistributorModal={openAddRewardsDistributorModal}
                comptrollerAddress={data?.comptroller}
              />
            </Column>
          )}

          {!data && (
            <Column
              w="100%"
              h="100%"
              mainAxisAlignment="center"
              crossAxisAlignment="center"
              p={4}
            >
              <Spinner />
            </Column>
          )}

          {!!data && !!rewardsDistributors.length && (
            <Table>
              <Thead>
                <Tr>
                  <Th color="white" size="sm">
                    {t("Reward Token:")}
                  </Th>
                  <Th color="white">{t("Active CTokens:")}</Th>
                  <Th color="white">{t("Balance:")}</Th>
                  <Th color="white">{t("Admin?")}</Th>
                </Tr>
              </Thead>

              <Tbody minHeight="50px">
                {!data && !rewardsDistributors.length ? (
                  <Spinner />
                ) : (
                  rewardsDistributors.map((rD, i) => {
                    return (
                      <RewardsDistributorRow
                        key={rD.address}
                        rewardsDistributor={rD}
                        handleRowClick={handleRewardsRowClick}
                        hideModalDivider={i === rewardsDistributors.length - 1}
                        activeCTokens={
                          poolIncentives.rewardsDistributorCtokens[rD.address]
                        }
                      />
                    );
                  })
                )}
              </Tbody>
            </Table>
          )}
        </DashboardBox>
      </Column>
    </>
  );
});

export default FusePoolEditPage;

const PoolConfiguration = ({
  assets,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const poolId = router.query.poolId as string;

  const { fuse, address } = useRari();

  const queryClient = useQueryClient();
  const toast = useToast();

  const data = useExtraPoolInfo(comptrollerAddress);

  const changeWhitelistStatus = async (enforce: boolean) => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    try {
      await testForComptrollerErrorAndSend(
        comptroller.callStatic._setWhitelistEnforcement(enforce),
        comptroller._setWhitelistEnforcement(enforce),
        address,
        ""
      );

      LogRocket.track("Fuse-ChangeWhitelistStatus");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const addToWhitelist = async (newUser: string) => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const newList = [...data!.whitelist, newUser];

    try {
      await testForComptrollerErrorAndSend(
        comptroller.callStatic._setWhitelistStatuses(
          newList,
          Array(newList.length).fill(true)
        ),
        comptroller._setWhitelistStatuses(
          newList,
          Array(newList.length).fill(true)
        ),
        address,
        ""
      );

      LogRocket.track("Fuse-AddToWhitelist");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const removeFromWhitelist = async (removeUser: string) => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const whitelist = data!.whitelist;
    try {
      await testForComptrollerErrorAndSend(
        comptroller.callStatic._setWhitelistStatuses(
          whitelist,
          whitelist.map((user) => user !== removeUser)
        ),
        comptroller._setWhitelistStatuses(
          whitelist,
          whitelist.map((user) => user !== removeUser)
        ),
        address,
        ""
      );

      LogRocket.track("Fuse-RemoveFromWhitelist");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const renounceOwnership = async () => {
    const unitroller = new Contract(
      comptrollerAddress,
      JSON.parse(
        fuse.compoundContracts["contracts/Unitroller.sol:Unitroller"].abi
      ),
      fuse.provider.getSigner()
    );

    try {
      // TODO: Revoke admin rights on all the cTokens!
      await testForComptrollerErrorAndSend(
        unitroller.callStatic._renounceAdminRights(),
        unitroller._renounceAdminRights(),
        address,
        ""
      );

      LogRocket.track("Fuse-RenounceOwnership");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const [closeFactor, setCloseFactor] = useState(50);
  const [liquidationIncentive, setLiquidationIncentive] = useState(8);

  const scaleCloseFactor = (_closeFactor: number) => {
    return _closeFactor / 1e16;
  };

  const scaleLiquidationIncentive = (_liquidationIncentive: number) => {
    return _liquidationIncentive / 1e16 - 100;
  };

  // Update values on refetch!
  useEffect(() => {
    if (data) {
      setCloseFactor(scaleCloseFactor(data.closeFactor));
      setLiquidationIncentive(
        scaleLiquidationIncentive(data.liquidationIncentive)
      );
    }
  }, [data]);

  const updateCloseFactor = async () => {
    // 50% -> 0.5 * 1e18
    const bigCloseFactor: BigNumber = utils.parseUnits(
      (closeFactor / 100).toString()
    );

    const comptroller = createComptroller(comptrollerAddress, fuse);

    try {
      await testForComptrollerErrorAndSend(
        comptroller.callStatic._setCloseFactor(bigCloseFactor),
        comptroller._setCloseFactor(bigCloseFactor),
        address,
        ""
      );

      LogRocket.track("Fuse-UpdateCloseFactor");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const updateLiquidationIncentive = async () => {
    // 8% -> 1.08 * 1e8
    const bigLiquidationIncentive: BigNumber = utils.parseUnits(
      (liquidationIncentive / 100 + 1).toString()
    );

    const comptroller = createComptroller(comptrollerAddress, fuse);

    try {
      await testForComptrollerErrorAndSend(
        comptroller.callStatic._setLiquidationIncentive(bigLiquidationIncentive),
        comptroller._setLiquidationIncentive(bigLiquidationIncentive),
        address,
        ""
      );

      LogRocket.track("Fuse-UpdateLiquidationIncentive");

      queryClient.refetchQueries();
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height="100%"
    >
      <Heading size="sm" px={4} py={4}>
        {t("Pool {{num}} Configuration", { num: poolId })}
      </Heading>

      <ModalDivider />

      {data ? (
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          height="100%"
          width="100%"
          overflowY="auto"
        >
          <ConfigRow>
            <Text fontWeight="bold" mr={2}>
              {t("Assets:")}
            </Text>

            {assets.length > 0 ? (
              <>
                <AvatarGroup size="xs" max={30}>
                  {assets.map(({ underlyingToken, cToken }) => {
                    return (
                      <CTokenIcon key={cToken} address={underlyingToken} />
                    );
                  })}
                </AvatarGroup>

                <Text ml={2} flexShrink={0}>
                  {assets.map(({ underlyingSymbol }, index, array) => {
                    return (
                      underlyingSymbol +
                      (index !== array.length - 1 ? " / " : "")
                    );
                  })}
                </Text>
              </>
            ) : (
              <Text>{t("None")}</Text>
            )}
          </ConfigRow>

          <ModalDivider />

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            width="100%"
          >
            <ConfigRow>
              <Text fontWeight="bold">{t("Whitelist")}:</Text>

              <Switch
                ml="auto"
                h="20px"
                isDisabled={!data.upgradeable}
                isChecked={data.enforceWhitelist}
                onChange={() => {
                  changeWhitelistStatus(!data.enforceWhitelist);
                }}
                className="black-switch"
                colorScheme="#121212"
              />
            </ConfigRow>

            {data.enforceWhitelist ? (
              <WhitelistInfo
                whitelist={data.whitelist}
                addToWhitelist={addToWhitelist}
                removeFromWhitelist={removeFromWhitelist}
              />
            ) : null}

            <ModalDivider />

            <ConfigRow>
              <Text fontWeight="bold">{t("Upgradeable")}:</Text>

              {data.upgradeable ? (
                <DashboardBox
                  height="35px"
                  ml="auto"
                  as="button"
                  onClick={renounceOwnership}
                >
                  <Center expand px={2} fontWeight="bold">
                    {t("Renounce Ownership")}
                  </Center>
                </DashboardBox>
              ) : (
                <Text ml="auto" fontWeight="bold">
                  {t("Admin Rights Disabled")}
                </Text>
              )}
            </ConfigRow>

            <ModalDivider />

            <ConfigRow height="35px">
              <Text fontWeight="bold">{t("Close Factor")}:</Text>

              {data && scaleCloseFactor(data.closeFactor) !== closeFactor ? (
                <SaveButton onClick={updateCloseFactor} />
              ) : null}

              <SliderWithLabel
                ml="auto"
                value={closeFactor}
                setValue={setCloseFactor}
                formatValue={formatPercentage}
                min={5}
                max={90}
              />
            </ConfigRow>

            <ModalDivider />

            <ConfigRow height="35px">
              <Text fontWeight="bold">{t("Liquidation Incentive")}:</Text>

              {data &&
                scaleLiquidationIncentive(data.liquidationIncentive) !==
                liquidationIncentive ? (
                <SaveButton onClick={updateLiquidationIncentive} />
              ) : null}

              <SliderWithLabel
                ml="auto"
                value={liquidationIncentive}
                setValue={setLiquidationIncentive}
                formatValue={formatPercentage}
                min={0}
                max={50}
              />
            </ConfigRow>
          </Column>
        </Column>
      ) : (
        <Center expand>
          <Spinner />
        </Center>
      )}
    </Column>
  );
};

const AssetConfiguration = ({
  openAddAssetModal,
  assets,
  comptrollerAddress,
  poolName,
  poolID,
  poolOracleAddress,
  oracleModel,
}: {
  openAddAssetModal: () => any;
  assets: USDPricedFuseAsset[];
  comptrollerAddress: string;
  poolName: string;
  poolID: string;
  poolOracleAddress: string;
  oracleModel: string | undefined;
}) => {
  const isMobile = useIsSemiSmallScreen();

  const { t } = useTranslation();
  const { fuse } = useRari();
  const oracleData = useOracleData(poolOracleAddress, fuse, oracleModel);
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height={isMobile ? "auto" : "440px"}
      width="100%"
      flexShrink={0}
    >
      <ConfigRow mainAxisAlignment="space-between">
        <Heading size="sm">{t("Assets Configuration")}</Heading>

        <AddAssetButton
          comptrollerAddress={comptrollerAddress}
          openAddAssetModal={openAddAssetModal}
        />
      </ConfigRow>

      <ModalDivider />

      <ConfigRow>
        <Text fontWeight="bold" mr={2}>
          {t("Assets:")}
        </Text>

        {assets.map((asset, index, array) => {
          return (
            <Box
              pr={index === array.length - 1 ? 4 : 2}
              key={asset.cToken}
              flexShrink={0}
            >
              <DashboardBox
                as="button"
                onClick={() => setSelectedAsset(asset)}
                {...(asset.cToken === selectedAsset.cToken
                  ? activeStyle
                  : noop)}
              >
                <Center expand px={4} py={1} fontWeight="bold">
                  {asset.underlyingSymbol}
                </Center>
              </DashboardBox>
            </Box>
          );
        })}
      </ConfigRow>

      <ModalDivider />

      <ColoredAssetSettings
        comptrollerAddress={comptrollerAddress}
        tokenAddress={selectedAsset.underlyingToken}
        cTokenAddress={selectedAsset.cToken}
        poolName={poolName}
        poolID={poolID}
        poolOracleAddress={poolOracleAddress}
        oracleModel={oracleModel}
        oracleData={oracleData}
      />
    </Column>
  );
};

const ColoredAssetSettings = ({
  tokenAddress,
  poolName,
  poolID,
  comptrollerAddress,
  cTokenAddress,
  poolOracleAddress,
  oracleModel,
  oracleData,
}: {
  tokenAddress: string;
  poolName: string;
  poolID: string;
  comptrollerAddress: string;
  cTokenAddress: string;
  poolOracleAddress: string;
  oracleModel: string | undefined;
  oracleData: OracleDataType | undefined;
}) => {
  const tokenData = useTokenData(tokenAddress);

  return tokenData ? (
    <AssetSettings
      mode="Editing"
      tokenAddress={tokenAddress}
      poolOracleAddress={poolOracleAddress}
      oracleModel={oracleModel}
      oracleData={oracleData}
      closeModal={noop}
      comptrollerAddress={comptrollerAddress}
      poolName={poolName}
      poolID={poolID}
      tokenData={tokenData}
      cTokenAddress={cTokenAddress}
    />
  ) : (
    <Center expand>
      <Spinner />
    </Center>
  );
};

export const SaveButton = ({
  onClick,
  ...others
}: {
  onClick: () => any;
  [key: string]: any;
}) => {
  const { t } = useTranslation();

  return (
    <DashboardBox
      flexShrink={0}
      ml={2}
      width="60px"
      height="35px"
      as="button"
      fontWeight="bold"
      onClick={onClick}
      {...others}
    >
      {t("Save")}
    </DashboardBox>
  );
};

const AddAssetButton = ({
  openAddAssetModal,
  comptrollerAddress,
}: {
  openAddAssetModal: () => any;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();

  const isUpgradeable = useIsUpgradeable(comptrollerAddress);

  return isUpgradeable ? (
    <DashboardBox
      onClick={openAddAssetModal}
      as="button"
      py={1}
      px={2}
      fontWeight="bold"
    >
      {t("Add Asset")}
    </DashboardBox>
  ) : null;
};

export const ConfigRow = ({
  children,
  ...others
}: {
  children: ReactNode;
  [key: string]: any;
}) => {
  return (
    <Row
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      width="100%"
      my={4}
      px={4}
      overflowX="auto"
      flexShrink={0}
      {...others}
    >
      {children}
    </Row>
  );
};

const AddRewardsDistributorButton = ({
  openAddRewardsDistributorModal,
  comptrollerAddress,
}: {
  openAddRewardsDistributorModal: () => any;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();

  const isUpgradeable = useIsUpgradeable(comptrollerAddress);

  return isUpgradeable ? (
    <DashboardBox
      onClick={openAddRewardsDistributorModal}
      as="button"
      py={1}
      px={2}
      fontWeight="bold"
    >
      {t("Add Rewards Distributor")}
    </DashboardBox>
  ) : null;
};

const RewardsDistributorRow = ({
  rewardsDistributor,
  handleRowClick,
  hideModalDivider,
  activeCTokens,
}: {
  rewardsDistributor: RewardsDistributor;
  handleRowClick: (rD: RewardsDistributor) => void;
  hideModalDivider: boolean;
  activeCTokens: string[];
}) => {
  const { address, fuse } = useRari();
  const isAdmin = address === rewardsDistributor.admin;

  const tokenData = useTokenData(rewardsDistributor.rewardToken);
  //   Balances
  const { data: rDBalance } = useTokenBalance(
    rewardsDistributor.rewardToken,
    rewardsDistributor.address
  );

  const underlyingsMap = useCTokensUnderlying(activeCTokens);
  const underlyings = Object.values(underlyingsMap);

  return (
    <>
      <Tr
        _hover={{ background: "grey", cursor: "pointer" }}
        h="30px"
        p={5}
        flexDir="row"
        onClick={() => handleRowClick(rewardsDistributor)}
      >
        <Td>
          <HStack>
            {tokenData?.logoURL ? (
              <Image
                src={tokenData.logoURL}
                boxSize="30px"
                borderRadius="50%"
              />
            ) : null}
            <Heading fontSize="22px" color={tokenData?.color ?? "#FFF"} ml={2}>
              {tokenData
                ? tokenData.symbol ?? "Invalid Address!"
                : "Loading..."}
            </Heading>
          </HStack>
        </Td>

        <Td>
          {!!underlyings.length ? (
            <CTokenAvatarGroup tokenAddresses={underlyings} popOnHover={true} />
          ) : (
            <Badge colorScheme="red">Inactive</Badge>
          )}
        </Td>

        <Td>
          {(parseFloat(rDBalance?.toString() ?? "0") / 1e18).toFixed(3)}{" "}
          {tokenData?.symbol}
        </Td>

        <Td>
          <Badge colorScheme={isAdmin ? "green" : "red"}>
            {isAdmin ? "Is Admin" : "Not Admin"}
          </Badge>
        </Td>
      </Tr>
      {/* {!hideModalDivider && <ModalDivider />} */}
    </>
  );
};
