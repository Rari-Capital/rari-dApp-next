// Chakra and UI
import {
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
  import { smallUsdFormatter } from "utils/bigUtils";
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

export const SupplyList = ({
    assets,
    supplyBalanceUSD,
    comptrollerAddress,
    incentivesData,
    pluginIncentives,
    rewardTokensData,
  }: {
    assets: USDPricedFuseAsset[];
    supplyBalanceUSD: number;
    comptrollerAddress: string;
    incentivesData: IncentivesData;
    pluginIncentives: FlywheelIncentivesData | undefined
    rewardTokensData: TokensDataMap;
  }) => {
    const { t } = useTranslation();
  
    const suppliedAssets = assets.filter(
      (asset) => asset.supplyBalanceUSD.gt(1)
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
          {"Supply Balance: " + smallUsdFormatter(supplyBalanceUSD)}
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
                {t("APY/LTV")}
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
              {assets.map((asset, index) => {
  
                if (!asset.supplyBalanceUSD.gt(1)) return null
  
                const supplyIncentivesForAsset = (
                  incentivesData?.incentives?.[asset.cToken] ?? []
                ).filter(({ supplySpeed }) => !!supplySpeed);
  
                const pluginIncentivesForAsset = pluginIncentives?.incentives?.[asset.cToken] ?? {}
                // if (!!Object.keys(pluginIncentivesForAsset).length) console.log({ pluginIncentivesForAsset })
  
                // if (!!pluginIncentivesForAsset.length) console.log({pluginIncentivesForAsset})
  
  
                return (
                  <AssetSupplyRow
                    comptrollerAddress={comptrollerAddress}
                    key={asset.underlyingToken}
                    assets={assets}
                    index={index}
                    supplyIncentives={supplyIncentivesForAsset}
                    pluginIncentives={pluginIncentivesForAsset}
                    rewardTokensData={rewardTokensData}
                    isPaused={asset.isPaused}
                  />
                );
              })}
  
              {suppliedAssets.length > 0 ? <ModalDivider my={2} /> : null}
  
              {assets.map((asset, index) => {
                if (!asset.supplyBalanceUSD.lt(1)) return null
                if (["0x814b02c1ebc9164972d888495927fe1697f0fb4c", "0xfb558ecd2d24886e8d2956775c619deb22f154ef"].includes(comptrollerAddress.toLowerCase())) {
                  if (asset.underlyingToken.toLowerCase() === "0xa47c8bf37f92abed4a126bda807a7b7498661acd") return null
                }
  
                const supplyIncentivesForAsset = (
                  incentivesData?.incentives?.[asset.cToken] ?? []
                ).filter(({ supplySpeed }) => !!supplySpeed);
  
                const pluginIncentivesForAsset = pluginIncentives?.incentives?.[asset.cToken] ?? {}
                // if (!!Object.keys(pluginIncentivesForAsset).length) console.log({ pluginIncentivesForAsset })
  
                return (
                  <AssetSupplyRow
                    comptrollerAddress={comptrollerAddress}
                    key={asset.underlyingToken}
                    assets={assets}
                    index={index}
                    supplyIncentives={supplyIncentivesForAsset}
                    pluginIncentives={pluginIncentivesForAsset}
                    rewardTokensData={rewardTokensData}
                    isPaused={asset.isPaused}
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
    supplyIncentives,
    rewardTokensData,
    pluginIncentives,
    isPaused,
  }: {
    assets: USDPricedFuseAsset[];
    index: number;
    comptrollerAddress: string;
    supplyIncentives: CTokenRewardsDistributorIncentivesWithRates[];
    pluginIncentives: FlywheelPluginRewardsMap
    rewardTokensData: TokensDataMap;
    isPaused: boolean;
  }) => {
    const {
      isOpen: isModalOpen,
      onOpen: openModal,
      onClose: closeModal,
    } = useDisclosure();
  
    const authedOpenModal = useAuthedCallback(openModal);
  
    const asset = assets[index];
  
    const { fuse, address, isAuthed } = useRari();
  
    const tokenData = useTokenData(asset.underlyingToken);
  
    const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  
    const queryClient = useQueryClient();
  
    const toast = useToast();
  
    const onToggleCollateral = async () => {
      const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);
  
      try {
        let tx;
        if (asset.membership) {
          tx = await testForComptrollerErrorAndSend(
            comptroller.callStatic.exitMarket(asset.cToken, { from: address }),
            comptroller.exitMarket(asset.cToken, { from: address }),
            address,
            "You cannot disable this asset as collateral as you would not have enough collateral posted to keep your borrow. Try adding more collateral of another type or paying back some of your debt.",
          )
          // tx = await comptroller.exitMarket(asset.cToken, { from: address });
        } else {
          tx = await testForComptrollerErrorAndSend(
            comptroller.callStatic.enterMarkets([asset.cToken], { from: address }),
            comptroller.enterMarkets([asset.cToken], { from: address }),
            address,
            "You cannot enable this asset as collateral at this time.",
          )
        }
        await tx.wait(1)
        LogRocket.track("Fuse-ToggleCollateral");
        queryClient.refetchQueries();
      } catch (err: any) {
        toast({
          title: "Error!",
          description:
            err?.message ?? "Oops",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
  
    const isStakedOHM =
      asset.underlyingToken.toLowerCase() ===
      "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F".toLowerCase();
  
    const { data: stakedOHMApyData } = useQuery("sOHM_APY", async () => {
      const data = (
        await fetch("https://api.rari.capital/fuse/pools/18/apy")
      ).json();
  
      return data as Promise<{ supplyApy: number; supplyWpy: number }>;
    });
  
    const isMobile = useIsMobile();
  
    const { t } = useTranslation();
  
    const hasSupplyIncentives = !!supplyIncentives.length;
    const hasPluginIncentives = !!Object.keys(pluginIncentives).length
    const totalSupplyAPR =
      supplyIncentives?.reduce((prev, incentive) => {
        const apr = incentive.supplyAPR;
        return prev + apr;
      }, 0) ?? 0;
  
    const [hovered, setHovered] = useState<number>(-1);
    const handleMouseEnter = (index: number) => setHovered(index);
    const handleMouseLeave = () => setHovered(-1);
  
    const displayedSupplyAPR =
      hovered >= 0 ? supplyIncentives[hovered].supplyAPR : totalSupplyAPR;
  
    const displayedSupplyAPRLabel =
      hovered >= 0
        ? `${supplyIncentives[hovered].supplyAPR.toFixed(2)} % APR in ${rewardTokensData?.[supplyIncentives[hovered].rewardToken]?.symbol
        } distributions.`
        : `${displayedSupplyAPR.toFixed(
          2
        )}% total APR distributed in ${supplyIncentives
          .map((incentive) => rewardTokensData?.[incentive.rewardToken]?.symbol ?? "")
          .join(", ")}
           `;
  
    const _hovered = hovered > 0 ? hovered : 0;
  
    const color =
      rewardTokensData?.[supplyIncentives?.[_hovered]?.rewardToken]?.color ??
      "white";
  
    const symbol = getSymbol(tokenData, asset);
  
    return (
      <>
        <PoolModal
          defaultMode={Mode.SUPPLY}
          comptrollerAddress={comptrollerAddress}
          assets={assets}
          index={index}
          isOpen={isModalOpen}
          onClose={closeModal}
          isBorrowPaused={asset.isPaused}
        />
  
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          px={4}
          py={1.5}
          className="hover-row"
        >
          {/* Underlying Token Data */}
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            width="27%"
            // bg="orange"
            flexWrap="wrap"
          >
            <Row
              mainAxisAlignment="flex-start"
              crossAxisAlignment="center"
              width="100%"
              as="button"
              onClick={authedOpenModal}
            >
              <CTokenIcon
                address={asset.underlyingToken}
                hasLink={true}
                bg="#FFF"
                boxSize="37px"
                name={symbol}
              />
              <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={1} overflowWrap={"break-word"}>
                {symbol}
              </Text>
            </Row>
          </Column>
  
          {/* APY */}
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            width="27%"
            as="button"
            onClick={authedOpenModal}
            // bg="pink"
            ml={"auto"}
          >
            <Text
              color={tokenData?.color ?? "#FF"}
              fontWeight="bold"
              fontSize="17px"
            >
              {isStakedOHM
                ? stakedOHMApyData
                  ? (stakedOHMApyData.supplyApy * 100).toFixed(2)
                  : "?"
                : supplyAPY.toFixed(2)}
              %
            </Text>
  
  
            {/* RewardsDistributor Supply Incentives */}
            {hasSupplyIncentives && <RDIncentivesRow
              incentives={supplyIncentives}
              label={displayedSupplyAPRLabel}
              apr={displayedSupplyAPR}
              color={color}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />}
  
            {/* Flywheel Supply Incentives */}
            {hasPluginIncentives && <PluginIncentivesRow
              incentives={pluginIncentives}
              market={asset}
              tokenData={tokenData}
            />}
  
            <SimpleTooltip
              label={t(
                "The Loan to Value (LTV) ratio defines the maximum amount of tokens in the pool that can be borrowed with a specific collateral. It’s expressed in percentage: if in a pool ETH has 75% LTV, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of other tokens in the pool."
              )}
            >
              <Text fontSize="sm">
                {parseFloat(asset.collateralFactor.toString()) / 1e16}% LTV
              </Text>
            </SimpleTooltip>
  
          </Column>
  
          {/* End Incentives */}
  
          {/* Balance */}
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
              {smallUsdFormatter(parseFloat(asset.supplyBalanceUSD.toString()))}
            </Text>
  
            <Text fontSize="sm">
              {parseFloat(
                formatUnits(asset.supplyBalance, asset.underlyingDecimals)
              ).toFixed(2)}
              {" " + symbol}
            </Text>
          </Column>
  
          {/* Set As Collateral  */}
          <Row
            width={isMobile ? "34%" : "20%"}
            mainAxisAlignment="flex-end"
            crossAxisAlignment="center"
          >
            <SwitchCSS symbol={symbol} color={tokenData?.color} />
            <Switch
              isChecked={asset.membership}
              className={symbol + "-switch"}
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