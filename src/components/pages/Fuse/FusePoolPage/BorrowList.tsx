// Chakra and UI
import {
    Box,
    Heading,
    Switch,
    Text,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
  import { Column, Center, Row, useIsMobile } from "lib/chakraUtils";
  import { ModalDivider } from "components/shared/Modal";
  import { SimpleTooltip } from "components/shared/SimpleTooltip";
  import { SwitchCSS } from "components/shared/SwitchCSS";
  
  // React
  import {useState } from "react";
  import { useQuery } from "react-query";
  
  // Rari
  import { useRari } from "context/RariContext";
  
  // Hooks
  import { useTranslation } from "next-i18next";
  import { useQueryClient } from "react-query";

  import { useTokenData } from "hooks/useTokenData";
  import { useAuthedCallback } from "hooks/useAuthedCallback";
  import {
    IncentivesData,
  } from "hooks/rewards/usePoolIncentives";
  
  // Utils
  import { convertMantissaToAPY } from "utils/apyUtils";
  import { shortUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
  import { useCreateComptroller } from "utils/createComptroller";
  import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
  
  import PoolModal, { Mode } from "../Modals/PoolModal";
  
  // LogRocket
  import LogRocket from "logrocket";

  import {
    CTokenIcon,
  } from "components/shared/Icons/CTokenIcon";
  import { TokensDataMap } from "types/tokens";

  import { getSymbol } from "utils/symbolUtils";
  import { CTokenRewardsDistributorIncentivesWithRates } from "hooks/rewards/useRewardAPY";
  import { formatUnits } from "ethers/lib/utils";
  import { testForComptrollerErrorAndSend } from "../FusePoolEditPage";
  import { FlywheelIncentivesData, FlywheelPluginRewardsMap } from "hooks/convex/useConvexRewards";
import { PluginIncentivesRow, RDIncentivesRow } from "./IncentivesRows";
import { BigNumber } from "ethers";


export const BorrowList = ({
    assets,
    borrowBalanceUSD,
    comptrollerAddress,
    incentivesData,
    rewardTokensData
  }: {
    assets: USDPricedFuseAsset[];
    borrowBalanceUSD: number;
    comptrollerAddress: string;
    incentivesData: IncentivesData;
    rewardTokensData: TokensDataMap
  }) => {
    const { t } = useTranslation();
    const borrowedAssets = assets.filter(
      (asset) => asset.borrowBalanceUSD.gt(1)
    );
    const disabledAssets = assets.filter(
      (a) => (a.isPaused || !!a.borrowGuardianPaused)
    )
  
    const [showPausedAssets, setShowPausedAssets] = useState(false)
  
    const isMobile = useIsMobile();
  
    return (
      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        height="100%"
        pb={1}
      >
        <Heading size="md" px={4} py={3}>
          {"Borrow Balance: " + smallUsdFormatter(borrowBalanceUSD)}
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
                {t("APY/TVL")}
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
              {assets.map((asset, index) => {
                if (!asset.borrowBalanceUSD.gt(1)) return null
  
                const incentivesForAsset = (
                  incentivesData?.incentives?.[asset.cToken] ?? []
                ).filter(({ borrowSpeed }) => !!borrowSpeed);
  
                return (
                  <AssetBorrowRow
                    comptrollerAddress={comptrollerAddress}
                    key={asset.underlyingToken}
                    assets={assets}
                    index={index}
                    borrowIncentives={incentivesForAsset}
                    rewardTokensData={rewardTokensData}
                    isPaused={asset.isPaused}
                  />
                );
              })}
  
              {borrowedAssets.length > 0 ? <ModalDivider my={2} /> : null}
  
              {assets.map((asset, index) => {
                if (!asset.borrowBalanceUSD.lt(1)) return null
                // Don't show paused assets if not enabled
                if (asset.isPaused || asset.borrowGuardianPaused) return null
                // Don't show UST on Pool 6/7
                if (["0x814b02c1ebc9164972d888495927fe1697f0fb4c", "0xfb558ecd2d24886e8d2956775c619deb22f154ef"].includes(comptrollerAddress.toLowerCase())) {
                  if (asset.underlyingToken.toLowerCase() === "0xa47c8bf37f92abed4a126bda807a7b7498661acd") return null
                }
  
                const incentivesForAsset = (
                  incentivesData?.incentives?.[asset.cToken] ?? []
                ).filter(({ borrowSpeed }) => !!borrowSpeed);
  
                return (
                  <AssetBorrowRow
                    comptrollerAddress={comptrollerAddress}
                    key={asset.underlyingToken}
                    assets={assets}
                    index={index}
                    borrowIncentives={incentivesForAsset}
                    rewardTokensData={rewardTokensData}
                    isPaused={asset.isPaused || !!asset.borrowGuardianPaused}
                  />
                );
              })}
  
  
              {showPausedAssets && disabledAssets.map((asset, index) => {
                return (
                  <AssetBorrowRow
                    comptrollerAddress={comptrollerAddress}
                    key={asset.underlyingToken}
                    assets={disabledAssets}
                    index={index}
                    borrowIncentives={[]}
                    rewardTokensData={{}}
                    isPaused={asset.isPaused || !!asset.borrowGuardianPaused}
                  />
                );
              })}
              <Row
                mainAxisAlignment="flex-start"
                crossAxisAlignment="flex-start"
                width="100%"
                px={4}
                mt={4}
                py={4}
                cursor="pointer"
                className="hover-row"
                onClick={() => setShowPausedAssets(!showPausedAssets)}>
                <Text
                  textAlign={'center'}
                  width="100%"
                >
                  {!assets.length ? null : showPausedAssets ? t("Hide unborrowable assets") : t("Show unborrowable assets")}
                </Text>
  
              </Row>
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
    borrowIncentives,
    rewardTokensData,
    isPaused,
  }: {
    assets: USDPricedFuseAsset[];
    index: number;
    comptrollerAddress: string;
    borrowIncentives: CTokenRewardsDistributorIncentivesWithRates[];
    rewardTokensData: TokensDataMap;
    isPaused: boolean;
  }) => {
    const asset = assets[index];
  
    const {
      isOpen: isModalOpen,
      onOpen: openModal,
      onClose: closeModal,
    } = useDisclosure();
  
    const authedOpenModal = useAuthedCallback(openModal);
  
    const tokenData = useTokenData(asset.underlyingToken);
  
    const borrowAPY = convertMantissaToAPY(asset.borrowRatePerBlock, 365);
  
    const { t } = useTranslation();
  
    const isMobile = useIsMobile();
  
    const hasBorrowIncentives = !!borrowIncentives.length;
  
    const totalBorrowAPY =
      borrowIncentives?.reduce((prev, incentive) => {
        const apy = incentive.borrowAPR;
        return prev + apy;
      }, 0) ?? 0;
  
    const [hovered, setHovered] = useState<number>(-1);
  
    const handleMouseEnter = (index: number) => setHovered(index);
    const handleMouseLeave = () => setHovered(-1);
  
    const displayedBorrowAPY =
      hovered >= 0
        ? borrowIncentives[hovered].borrowAPR
        : totalBorrowAPY;
  
    const symbol = getSymbol(tokenData, asset);
  
    const _hovered = hovered > 0 ? hovered : 0;
    const color =
      rewardTokensData?.[borrowIncentives?.[_hovered]?.rewardToken]?.color ??
      "white";
    return (
      <>
        <PoolModal
          comptrollerAddress={comptrollerAddress}
          defaultMode={Mode.BORROW}
          assets={assets}
          index={index}
          isOpen={isModalOpen}
          onClose={closeModal}
          isBorrowPaused={isPaused}
        />
  
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="100%"
          px={4}
          py={1.5}
          className="hover-row"
          as="button"
          onClick={isPaused ? () => { } : authedOpenModal}
          opacity={isPaused ? 0.2 : 1.0}
          cursor={isPaused ? 'initial' : 'pointer'}
        >
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            width="27%"
          >
            <CTokenIcon
              address={asset.underlyingToken}
              hasLink={true}
              bg="#FFF"
              boxSize="37px"
              name={symbol}
            />
            <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={0}>
              {symbol}
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
                {borrowAPY.toFixed(2)}%
              </Text>
  
              {/* Demo Borrow Incentives */}
              {hasBorrowIncentives && <RDIncentivesRow
                incentives={borrowIncentives}
                label={''}
                apr={displayedBorrowAPY}
                color={color}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />}
              <SimpleTooltip
                label={t(
                  "Total Value Lent (TVL) measures how much of this asset has been supplied in total. TVL does not account for how much of the lent assets have been borrowed, use 'liquidity' to determine the total unborrowed assets lent."
                )}
              >
                <Text fontSize="sm">
                  {shortUsdFormatter(parseFloat(asset.totalSupplyUSD.toString()))}{" "}
                  TVL
                </Text>
              </SimpleTooltip>
  
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
              {smallUsdFormatter(parseFloat(asset.borrowBalanceUSD.toString()))}
            </Text>
  
            <Text fontSize="sm">
              {smallUsdFormatter(parseFloat(
                asset.borrowBalance
                  .div(BigNumber.from(10).pow(asset.underlyingDecimals))
                  .toString())
              ).replace("$", "")}{" "}
              {symbol}
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
                  {shortUsdFormatter(parseFloat(asset.liquidityUSD.toString()))}
                </Text>
  
                <Text fontSize="sm">
                  {parseFloat(
                    formatUnits(asset.liquidity, asset.underlyingDecimals)
                  ).toFixed(2)}
                  {" " + symbol}
                </Text>
              </Column>
            </Box>
          </SimpleTooltip>
        </Row>
      </>
    );
  };
  