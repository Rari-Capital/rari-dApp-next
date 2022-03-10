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
  HStack,
  AvatarGroup,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { Column, Center, Row, RowOrColumn, useIsMobile } from "lib/chakraUtils";
import DashboardBox from "components/shared/DashboardBox";
import { ModalDivider } from "components/shared/Modal";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { SwitchCSS } from "components/shared/SwitchCSS";

// React
import { memo, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, UseQueryResult } from "react-query";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useTranslation } from "next-i18next";
import { useQueryClient } from "react-query";
import { useBorrowLimit } from "hooks/useBorrowLimit";
import { useFusePoolData } from "hooks/useFusePoolData";
import { useIsSemiSmallScreen } from "hooks/useIsSemiSmallScreen";
import { TokenData, useTokenData, useTokensDataAsMap } from "hooks/useTokenData";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import {
  CTokenRewardsDistributorIncentives,
  IncentivesData,
  usePoolIncentives,
} from "hooks/rewards/usePoolIncentives";

// Utils
import { convertMantissaToAPR, convertMantissaToAPY } from "utils/apyUtils";
import { shortUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { useCreateComptroller } from "utils/createComptroller";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

// Components
import FuseStatsBar from "../FuseStatsBar";
import FuseTabBar from "../FuseTabBar";
import PoolModal, { Mode } from "../Modals/PoolModal";

// LogRocket
import LogRocket from "logrocket";

// Ethers
import { toInt } from "utils/ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { useIsComptrollerAdmin } from "hooks/fuse/useIsComptrollerAdmin";
import { motion } from "framer-motion";
import { GlowingBox } from "components/shared/GlowingButton";
import {
  CTokenAvatarGroup,
  CTokenIcon,
} from "components/shared/Icons/CTokenIcon";
import { TokensDataMap } from "types/tokens";
import { AdminAlert, PendingAdminAlert } from "components/shared/AdminAlert";
import AppLink from "components/shared/AppLink";
import { EditIcon } from "@chakra-ui/icons";
import { getSymbol } from "utils/symbolUtils";
import { CTokenRewardsDistributorIncentivesWithRates } from "hooks/rewards/useRewardAPY";
import { formatUnits } from "ethers/lib/utils";
import { testForComptrollerErrorAndSend } from "../FusePoolEditPage";
import { FlywheelIncentivesData, FlywheelPluginRewardsMap, useConvexPoolIncentives } from "hooks/convex/useConvexRewards";
import PluginModal from "../Modals/PluginModal";

const FuseRewardsBanner = ({
  rewardTokensData,
}: {
  rewardTokensData: TokensDataMap;
}) => {

  if (!Object.keys(rewardTokensData).length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ width: "100%" }}
    >
      <GlowingBox w="100%" h="50px" mt={4}>
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          h="100%"
          w="100"
          p={3}
        >
          <Heading fontSize="md" ml={2}>
            {" "}
            🎉 This pool is offering rewards
          </Heading>
          <CTokenAvatarGroup
            tokenAddresses={Object.keys(rewardTokensData)}
            ml={2}
            mr={2}
            popOnHover={true}
          />
        </Row>
      </GlowingBox>
    </motion.div>
  );
};

const FuseUniV3Alert = ({
  univ3Tokens,
}: {
  univ3Tokens?: string[];
}) => {
  if (!univ3Tokens || !univ3Tokens.length) return null
  return (
    <Alert
      colorScheme={"yellow"}
      borderRadius={5}
      mt="5"
    >
      <AlertIcon />
      <span style={{ color: "black" }}>
        🚧 Warning - The following tokens in this pool utilize Univ3 Oracles - Use pool with caution: {univ3Tokens.join(', ')}
      </span>
    </Alert >
  );
};

const FusePoolPage = memo(() => {
  const { isAuthed, fuse } = useRari();

  const isMobile = useIsSemiSmallScreen();
  const router = useRouter();

  let { poolId } = router.query;
  const data = useFusePoolData(poolId as string | undefined, true);

  const incentivesData: IncentivesData = usePoolIncentives(data?.comptroller);
  const { rewardTokens: rdRewardTokens } = incentivesData;

  const pluginIncentives = useConvexPoolIncentives(data?.comptroller);
  const { rewardTokens: pluginRewardTokens = [] } = pluginIncentives ?? {}

  const rewardTokens = useMemo(() => [...rdRewardTokens, ...pluginRewardTokens], [pluginRewardTokens, rdRewardTokens])
  const rewardTokensData = useTokensDataAsMap(rewardTokens)

  const isAdmin = useIsComptrollerAdmin(data?.comptroller);

  const { data: univ3Assets }: UseQueryResult<string[]> = useQuery("univ3 assets for " + data?.assets?.map(a => a.cToken),
    async () => {
      if (!data) return []
      let res: string[] = []
      data.assets.forEach(

        async asset => {
          const identity = await fuse.identifyPriceOracle(asset.oracle)
          const includes = [
            "UniswapV3TwapPriceOracle_Uniswap_3000",
            "UniswapV3TwapPriceOracle_Uniswap_10000",
            "UniswapV3TwapPriceOracleV2_Uniswap_500_USDC",
            "UniswapV3TwapPriceOracleV2_Uniswap_3000_USDC",
            "UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC",
            "UniswapV3TwapPriceOracleV2"
          ].includes(identity)
          if (!!includes) {
            res.push(asset.underlyingSymbol)
          }
        }
      )

      return res
    })

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

        {
          /* If they have some asset enabled as collateral, show the collateral ratio bar */
          data && data.assets.some((asset) => asset.membership) ? (
            <CollateralRatioBar
              assets={data.assets}
              borrowUSD={data.totalBorrowBalanceUSD}
            />
          ) : null
        }

        {!!data && isAdmin && (
          <AdminAlert
            isAdmin={isAdmin}
            isAdminText="You are the admin of this Fuse Pool!"
            rightAdornment={
              <Box h="100%" ml="auto" color="black">
                <AppLink
                  /* @ts-ignore */
                  href={router.asPath + "/edit"}
                >
                  <HStack>
                    <Text fontWeight="bold">Edit </Text>
                    <EditIcon />
                  </HStack>
                </AppLink>
              </Box>
            }
          />
        )}

        {!!data && isAuthed && (
          <PendingAdminAlert comptroller={data?.comptroller} />
        )}

        <FuseRewardsBanner
          rewardTokensData={rewardTokensData}
        />

        <FuseUniV3Alert univ3Tokens={univ3Assets} />

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
                supplyBalanceUSD={data.totalSupplyBalanceUSD.toNumber()}
                incentivesData={incentivesData}
                pluginIncentives={pluginIncentives}
                rewardTokensData={rewardTokensData}
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
                borrowBalanceUSD={data.totalBorrowBalanceUSD.toNumber()}
                incentivesData={incentivesData}
                rewardTokensData={rewardTokensData}
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
  const ratio = useMemo(() => !maxBorrow.isZero() ? borrowUSD.mul(100).div(maxBorrow) : constants.Zero, [maxBorrow, borrowUSD]);

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
              smallUsdFormatter(parseFloat(borrowUSD.toString())) //smallUsdFormatter
            }
          </Text>
        </SimpleTooltip>

        <SimpleTooltip
          label={`You're using ${ratio.toString()}% of your ${smallUsdFormatter(
            parseFloat(maxBorrow.toString())
          )} borrow limit.`}
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
            {smallUsdFormatter(parseFloat(maxBorrow.toString()))}
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
              if (!!Object.keys(pluginIncentivesForAsset).length) console.log({ pluginIncentivesForAsset })

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
              if (!!Object.keys(pluginIncentivesForAsset).length) console.log({ pluginIncentivesForAsset })

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

const RDIncentivesRow: React.FC<{
  incentives: CTokenRewardsDistributorIncentivesWithRates[],
  handleMouseEnter: any,
  handleMouseLeave: any,
  color: string,
  label: string,
  apr: number,
}> = ({ incentives, handleMouseEnter, handleMouseLeave, color, label, apr }) => {
  return (
    <Row
      // ml={1}
      // mb={.5}
      crossAxisAlignment="center"
      mainAxisAlignment="flex-end"
      py={2}
    >
      <Text fontWeight="bold" mr={1}>
        +
      </Text>
      <AvatarGroup size="xs" max={30} ml={2} mr={1} spacing={1}>
        {incentives?.map((supplyIncentive, i) => {
          return (
            <CTokenIcon
              key={i}
              address={supplyIncentive.rewardToken}
              boxSize="20px"
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave()}
              _hover={{
                zIndex: 9,
                border: ".5px solid white",
                transform: "scale(1.3);",
              }}
            />
          );
        })}
      </AvatarGroup>
      <SimpleTooltip label={label}>
        <Text color={color} fontWeight="bold" pl={1} fontSize="sm">
          {/* {(supplyIncentive.supplySpeed / 1e18).toString()}%  */}
          {apr.toFixed(2)}% APR
        </Text>
      </SimpleTooltip>
    </Row>
  )
}

const PluginIncentivesRow: React.FC<{
  incentives: FlywheelPluginRewardsMap,
  market: USDPricedFuseAsset,
  tokenData: TokenData | undefined
}> = ({ incentives, market, tokenData }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PluginModal market={market} isOpen={isOpen} onClose={onClose} tokenData={tokenData} />
      <Row
        // ml={1}
        // mb={.5}
        crossAxisAlignment="center"
        mainAxisAlignment="flex-end"
        py={2}
        zIndex={10}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        <Text fontWeight="bold" mr={1}>
          🔌
        </Text>
        <SimpleTooltip label={"Click for more info"}>
          <AvatarGroup size="xs" max={30} ml={2} mr={1} spacing={1} >
            {Object.keys(incentives).map((flywheel, i) => {
              return (
                <CTokenIcon
                  key={i}
                  address={incentives[flywheel].rewardToken}
                  boxSize="20px"
                  // onMouseEnter={() => handleMouseEnter(i)}
                  // onMouseLeave={() => handleMouseLeave()}
                  _hover={{
                    zIndex: 9,
                    border: ".5px solid white",
                    transform: "scale(1.3);",
                  }}
                />
              );
            })}
          </AvatarGroup>
        </SimpleTooltip>
      </Row>
    </>
  )
}


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

const BorrowList = ({
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
