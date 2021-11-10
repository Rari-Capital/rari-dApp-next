// Chakra and UI
import {
  Box,
  Avatar,
  Heading,
  Progress,
  Spinner,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Column, Center, Row, RowOrColumn, useIsMobile } from "lib/chakraUtils";
import DashboardBox from "components/shared/DashboardBox";
import { ModalDivider } from "components/shared/Modal";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { SwitchCSS } from "components/shared/SwitchCSS";

// React
import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useTranslation } from "next-i18next";
import { useQueryClient } from "react-query";
import { useBorrowLimit } from "hooks/useBorrowLimit";
import { useFusePoolData } from "hooks/useFusePoolData";
import { useIsSemiSmallScreen } from "hooks/useIsSemiSmallScreen";
import { useTokenData } from "hooks/useTokenData";
import { useAuthedCallback } from "hooks/useAuthedCallback";

// Utils
import { convertMantissaToAPR, convertMantissaToAPY } from "utils/apyUtils";
import { shortUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { createComptroller } from "utils/createComptroller";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

// Components
import FuseStatsBar from "./FuseStatsBar";
import FuseTabBar from "./FuseTabBar";
import PoolModal, { Mode } from "./Modals/PoolModal";

// LogRocket
import LogRocket from "logrocket";

// Ethers
import { toInt } from "utils/ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";
import { constants, utils } from "ethers";

const FusePoolPage = memo(() => {
  const { isAuthed } = useRari();

  const isMobile = useIsSemiSmallScreen();
  const router = useRouter();

  let { poolId } = router.query;

  const data = useFusePoolData(poolId as string | undefined, true);

  console.log({ data });

  return (
    <>
      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        color="#FFFFFF"
        mx="auto"
        width={isMobile ? "100%" : "1150px"}
        px={isMobile ? 4 : 0}
      >
        <FuseStatsBar data={data} />

        <FuseTabBar />

        <RowOrColumn
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          mt={4}
          isRow={!isMobile}
        >
          <DashboardBox width={isMobile ? "100%" : "50%"}>
            {data ? (
              <SupplyList
                assets={data.assets}
                comptrollerAddress={data.comptroller}
                supplyBalanceUSD={data.totalSupplyBalanceUSD}
              />
            ) : (
              <Center height="200px">
                <Spinner />
              </Center>
            )}
          </DashboardBox>

          <DashboardBox
            ml={isMobile ? 0 : 4}
            mt={isMobile ? 4 : 0}
            width={isMobile ? "100%" : "50%"}
          >
            {data ? (
              <BorrowList
                comptrollerAddress={data.comptroller}
                assets={data.assets}
                borrowBalanceUSD={data.totalBorrowBalanceUSD}
              />
            ) : (
              <Center height="200px">
                <Spinner />
              </Center>
            )}
          </DashboardBox>
        </RowOrColumn>
      </Column>
    </>
  );
});

export default FusePoolPage;

const CollateralRatioBar = ({
  assets,
  borrowUSD,
}: {
  assets: USDPricedFuseAsset[];
  borrowUSD: BigNumber;
}) => {
  const { t } = useTranslation();

  const maxBorrow = useBorrowLimit(assets);

  const ratio = borrowUSD.div(maxBorrow).mul(100);

  useEffect(() => {
    if (ratio.gt(95)) {
      LogRocket.track("Fuse-AtRiskOfLiquidation");
    }
  }, [ratio]);

  return (
    <DashboardBox width="100%" height="65px" mt={4} p={4}>
      <Row mainAxisAlignment="flex-start" crossAxisAlignment="center" expand>
        <SimpleTooltip
          label={t("Keep this bar from filling up to avoid being liquidated!")}
        >
          <Text flexShrink={0} mr={4}>
            {t("Borrow Limit")}
          </Text>
        </SimpleTooltip>

        <SimpleTooltip label={t("This is how much you have borrowed.")}>
          <Text flexShrink={0} mt="2px" mr={3} fontSize="10px">
            {
              borrowUSD.toString() //smallUsdFormatter
            }
          </Text>
        </SimpleTooltip>

        <SimpleTooltip
          label={
            `You're using ${
              ratio.toString
            }% of your ${maxBorrow.toString()} borrow limit.` //smallUsdFormatter(
          }
        >
          <Box width="100%">
            <Progress
              size="xs"
              width="100%"
              colorScheme={
                ratio.lte(40)
                  ? "whatsapp"
                  : ratio.lte(60)
                  ? "yellow"
                  : ratio.lte(80)
                  ? "orange"
                  : "red"
              }
              borderRadius="10px"
              value={toInt(ratio)}
            />
          </Box>
        </SimpleTooltip>

        <SimpleTooltip
          label={t(
            "If your borrow amount reaches this value, you will be liquidated."
          )}
        >
          <Text flexShrink={0} mt="2px" ml={3} fontSize="10px">
            {maxBorrow.toString} //smallUsdFormatter
          </Text>
        </SimpleTooltip>
      </Row>
    </DashboardBox>
  );
};

const SupplyList = ({
  assets,
  supplyBalanceUSD,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  supplyBalanceUSD: BigNumber;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();

  const suppliedAssets = assets.filter((asset) =>
    asset.supplyBalanceUSD.gt(constants.One)
  );
  const nonSuppliedAssets = assets.filter((asset) =>
    asset.supplyBalanceUSD.lt(constants.One)
  );

  const isMobile = useIsMobile();

  const { data: stakedOHMApyData } = useQuery("sOHM_APY", async () => {
    const data = (
      await fetch("https://api.rari.capital/fuse/pools/18/apy")
    ).json();

    return data as Promise<{ supplyApy: number; supplyWpy: number }>;
  });

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height="100%"
      pb={1}
    >
      <Heading size="md" px={4} py={3}>
        {"Supply Balance: "}{" "}
        {smallUsdFormatter(parseFloat(supplyBalanceUSD.toString()))}
      </Heading>
      <ModalDivider />

      {assets.length > 0 ? (
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          px={4}
          mt={4}
        >
          <Text width="27%" fontWeight="bold" pl={1}>
            {t("Asset")}
          </Text>

          {isMobile ? null : (
            <Text width="27%" fontWeight="bold" textAlign="right">
              {t("APY/WPY")}
            </Text>
          )}

          <Text
            width={isMobile ? "40%" : "27%"}
            fontWeight="bold"
            textAlign="right"
          >
            {t("Balance")}
          </Text>

          <Text
            width={isMobile ? "34%" : "20%"}
            fontWeight="bold"
            textAlign="right"
          >
            {t("Collateral")}
          </Text>
        </Row>
      ) : null}

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        expand
        mt={1}
      >
        {assets.length > 0 ? (
          <>
            {suppliedAssets.map((asset, index) => {
              return (
                <AssetSupplyRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={suppliedAssets}
                  index={index}
                  stakedOHMApyData={stakedOHMApyData}
                />
              );
            })}

            {suppliedAssets.length > 0 ? <ModalDivider my={2} /> : null}

            {nonSuppliedAssets.map((asset, index) => {
              return (
                <AssetSupplyRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={nonSuppliedAssets}
                  index={index}
                  stakedOHMApyData={stakedOHMApyData}
                />
              );
            })}
          </>
        ) : (
          <Center expand my={8}>
            {t("There are no assets in this pool.")}
          </Center>
        )}
      </Column>
    </Column>
  );
};

const AssetSupplyRow = ({
  assets,
  index,
  comptrollerAddress,
  stakedOHMApyData,
}: {
  assets: USDPricedFuseAsset[];
  index: number;
  comptrollerAddress: string;
  stakedOHMApyData: { supplyApy: number; supplyWpy: number } | undefined;
}) => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const authedOpenModal = useAuthedCallback(openModal);

  const asset = assets[index];

  const { fuse, address } = useRari();

  const tokenData = useTokenData(asset.underlyingToken);

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const supplyWPY = convertMantissaToAPY(asset.supplyRatePerBlock, 7);

  const queryClient = useQueryClient();

  const toast = useToast();

  const onToggleCollateral = async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    let call;
    let callArgs;
    if (asset.membership) {
      call = comptroller.callStatic.exitMarket;
      callArgs = asset.cToken;
    } else {
      call = comptroller.callStatic.enterMarkets;
      callArgs = [asset.cToken];
    }

    let response = await call(callArgs, { from: address });
    // For some reason `response` will be `["0"]` if no error but otherwise it will return a string number.
    if (response[0] !== "0") {
      if (asset.membership) {
        toast({
          title: "Error! Code: " + response,
          description:
            "You cannot disable this asset as collateral as you would not have enough collateral posted to keep your borrow. Try adding more collateral of another type or paying back some of your debt.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Error! Code: " + response,
          description:
            "You cannot enable this asset as collateral at this time.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }

      return;
    }

    if (asset.membership) {
      call = comptroller.exitMarket;
      callArgs = asset.cToken;
    } else {
      call = comptroller.enterMarkets;
      callArgs = [asset.cToken];
    }

    await call(callArgs, { from: address });

    LogRocket.track("Fuse-ToggleCollateral");

    queryClient.refetchQueries();
  };

  const isStakedOHM =
    asset.underlyingToken.toLowerCase() ===
    "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F".toLowerCase();

  const isMobile = useIsMobile();

  return (
    <>
      <PoolModal
        defaultMode={Mode.SUPPLY}
        comptrollerAddress={comptrollerAddress}
        assets={assets}
        index={index}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        px={4}
        py={1.5}
        className="hover-row"
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="27%"
          as="button"
          onClick={authedOpenModal}
        >
          <Avatar
            bg="#FFF"
            boxSize="37px"
            name={asset.underlyingSymbol}
            src={
              tokenData?.logoURL ??
              "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
            }
          />
          <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={0}>
            {asset.underlyingSymbol}
          </Text>
        </Row>

        {isMobile ? null : (
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            width="27%"
            as="button"
            onClick={authedOpenModal}
          >
            <Text
              color={tokenData?.color ?? "#FF"}
              fontWeight="bold"
              fontSize="17px"
            >
              {isStakedOHM
                ? stakedOHMApyData
                  ? (stakedOHMApyData.supplyApy * 100).toFixed(3)
                  : "?"
                : supplyAPY.toFixed(3)}
              %
            </Text>

            <Text fontSize="sm">
              {isStakedOHM
                ? stakedOHMApyData
                  ? (stakedOHMApyData.supplyWpy * 100).toFixed(3)
                  : "?"
                : supplyWPY.toFixed(3)}
              %
            </Text>
          </Column>
        )}

        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-end"
          width={isMobile ? "40%" : "27%"}
          as="button"
          onClick={authedOpenModal}
        >
          <Text
            color={tokenData?.color ?? "#FFF"}
            fontWeight="bold"
            fontSize="17px"
          >
            {smallUsdFormatter(toInt(asset.supplyBalanceUSD))}
          </Text>

          <Text fontSize="sm">
            {smallUsdFormatter(
              toInt(
                asset.supplyBalance.div(
                  BigNumber.from(10).pow(asset.underlyingDecimals)
                )
              )
            ).replace("$", "")}{" "}
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Column>

        <Row
          width={isMobile ? "34%" : "20%"}
          mainAxisAlignment="flex-end"
          crossAxisAlignment="center"
        >
          <SwitchCSS symbol={asset.underlyingSymbol} color={tokenData?.color} />
          <Switch
            isChecked={asset.membership}
            className={asset.underlyingSymbol + "-switch"}
            onChange={onToggleCollateral}
            size="md"
            mt={1}
            mr={5}
          />
        </Row>
      </Row>
    </>
  );
};

const BorrowList = ({
  assets,
  borrowBalanceUSD,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  borrowBalanceUSD: BigNumber;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();
  const borrowedAssets = assets.filter((asset) =>
    asset.borrowBalanceUSD.gt(constants.One)
  );
  const nonBorrowedAssets = assets.filter((asset) =>
    asset.borrowBalanceUSD.lt(constants.One)
  );

  const isMobile = useIsMobile();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height="100%"
      pb={1}
    >
      <Heading size="md" px={4} py={3}>
        {"Borrow Balance:"} {smallUsdFormatter(toInt(borrowBalanceUSD))}
      </Heading>
      <ModalDivider />

      {assets.length > 0 ? (
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          px={4}
          mt={4}
        >
          <Text width="27%" fontWeight="bold" pl={1}>
            {t("Asset")}
          </Text>

          {isMobile ? null : (
            <Text width="27%" fontWeight="bold" textAlign="right">
              {t("APR/WPR")}
            </Text>
          )}

          <Text
            fontWeight="bold"
            textAlign="right"
            width={isMobile ? "40%" : "27%"}
          >
            {t("Balance")}
          </Text>

          <Text
            fontWeight="bold"
            textAlign="right"
            width={isMobile ? "34%" : "20%"}
          >
            {t("Liquidity")}
          </Text>
        </Row>
      ) : null}

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        expand
        mt={1}
      >
        {assets.length > 0 ? (
          <>
            {borrowedAssets.map((asset, index) => {
              return (
                <AssetBorrowRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={borrowedAssets}
                  index={index}
                />
              );
            })}

            {borrowedAssets.length > 0 ? <ModalDivider my={2} /> : null}

            {nonBorrowedAssets.map((asset, index) => {
              return (
                <AssetBorrowRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={nonBorrowedAssets}
                  index={index}
                />
              );
            })}
          </>
        ) : (
          <Center expand my={8}>
            {t("There are no assets in this pool.")}
          </Center>
        )}
      </Column>
    </Column>
  );
};

const AssetBorrowRow = ({
  assets,
  index,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  index: number;
  comptrollerAddress: string;
}) => {
  const asset = assets[index];

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const authedOpenModal = useAuthedCallback(openModal);

  const tokenData = useTokenData(asset.underlyingToken);

  const borrowAPR = convertMantissaToAPR(asset.borrowRatePerBlock);
  const borrowWPR = convertMantissaToAPR(asset.borrowRatePerBlock) / 52;

  const { t } = useTranslation();

  const isMobile = useIsMobile();

  console.log({ asset });

  return (
    <>
      <PoolModal
        comptrollerAddress={comptrollerAddress}
        defaultMode={Mode.BORROW}
        assets={assets}
        index={index}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        px={4}
        py={1.5}
        className="hover-row"
        as="button"
        onClick={authedOpenModal}
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="27%"
        >
          <Avatar
            bg="#FFF"
            boxSize="37px"
            name={asset.underlyingSymbol}
            src={
              tokenData?.logoURL ??
              "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
            }
          />
          <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={0}>
            {asset.underlyingSymbol}
          </Text>
        </Row>

        {isMobile ? null : (
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            width="27%"
          >
            <Text
              color={tokenData?.color ?? "#FF"}
              fontWeight="bold"
              fontSize="17px"
            >
              {borrowAPR.toFixed(3)}%
            </Text>

            <Text fontSize="sm">{borrowWPR.toFixed(3)}%</Text>
          </Column>
        )}

        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-end"
          width={isMobile ? "40%" : "27%"}
        >
          <Text
            color={tokenData?.color ?? "#FFF"}
            fontWeight="bold"
            fontSize="17px"
          >
            {smallUsdFormatter(toInt(asset.borrowBalanceUSD))}
          </Text>

          <Text fontSize="sm">
            {smallUsdFormatter(
              toInt(
                asset.borrowBalance.div(
                  BigNumber.from(10).pow(asset.underlyingDecimals)
                )
              )
            ).replace("$", "")}{" "}
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Column>

        <SimpleTooltip
          label={t(
            "Liquidity is the amount of this asset that is available to borrow (unborrowed). To see how much has been supplied and borrowed in total, navigate to the Pool Info tab."
          )}
          placement="top-end"
        >
          <Box width={isMobile ? "34%" : "20%"}>
            <Column
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-end"
            >
              <Text
                color={tokenData?.color ?? "#FFF"}
                fontWeight="bold"
                fontSize="17px"
              >
                {shortUsdFormatter(toInt(asset.liquidityUSD))}
              </Text>

              <Text fontSize="sm">
                {shortUsdFormatter(
                  toInt(
                    asset.liquidity.div(
                      BigNumber.from(10).pow(asset.underlyingDecimals)
                    )
                  )
                ).replace("$", "")}{" "}
                {tokenData?.symbol}
              </Text>
            </Column>
          </Box>
        </SimpleTooltip>
      </Row>
    </>
  );
};
