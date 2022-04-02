import { BigNumber } from "ethers";
import { motion } from "framer-motion";
// Components
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { TokenData, useTokenData } from "hooks/useTokenData";
import Head from "next/head";
// Hooks
import { useRouter } from "next/router";
import {
  Badge,
  Button,
  Card,
  Divider,
  Heading,
  Progress,
  Text,
} from "rari-components";
import { useMemo } from "react";
import { shortUsdFormatter } from "utils/bigUtils";
import { toInt } from "utils/ethersUtils";
import { ChevronLeftIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Flex,
  HStack,
  Image,
  Skeleton,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import { SafeStats } from "./SafeStats";
import { SafeStrategies } from "./SafeStrategies";
import ClaimInterestModal from "./modals/ClaimInterestModal";
import DepositSafeCollateralModal from "./modals/DepositSafeCollateralModal/DepositSafeCollateralModal";
import SafeInfoModal from "./modals/TurboInfoModal";
import WithdrawSafeCollateralModal from "./modals/WithdrawSafeCollateralModal";
import AppLink from "components/shared/AppLink";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import { filterUsedStrategies, StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { convertMantissaToAPY } from "utils/apyUtils";

const MOCK_SAFE: USDPricedTurboSafe = {
  safeAddress: "0xCd6442eB75f676671FBFe003A6A6F022CbbB8d38",
  collateralAsset: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  collateralAmount: BigNumber.from("5000001000000000000000000"),
  collateralValue: BigNumber.from("1158926336594045961765"),
  collateralPrice: BigNumber.from("231785220961765"),
  debtAmount: BigNumber.from("2000000000000000000000000"),
  debtValue: BigNumber.from("651700000000000000000"),
  boostedAmount: BigNumber.from("2000000000000000000000000"),
  feiPrice: BigNumber.from("325850000000000"),
  feiAmount: BigNumber.from("2000000046982030418498691"),
  tribeDAOFee: BigNumber.from("750000000000000000"),
  strategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
    },
  ],
  safeUtilization: BigNumber.from(50),
  collateralUSD: 100,
  debtUSD: 50,
  boostedUSD: 50,
  feiAmountUSD: 50,
  feiPriceUSD: 1,
  usdPricedStrategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
      boostAmountUSD: 50,
      feiAmountUSD: 50,
      feiEarnedUSD: 10,
    },
  ],
};

const TurboSafePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const safeId = id as string;

  // const safe = useSafeInfo(safeId) ?? MOCK_SAFE;
  const safe = useSafeInfo(safeId)
  const tokenData = useTokenData(safe?.collateralAsset);

  const loading = !tokenData || !safe;

  const {
    isOpen: isDepositModalOpen,
    onOpen: openDepositModal,
    onClose: closeDepositModal,
  } = useDisclosure();

  const {
    isOpen: isSafeModalOpen,
    onOpen: openSafeModal,
    onClose: closeSafeModal,
  } = useDisclosure();

  const {
    isOpen: isWithdrawModalOpen,
    onOpen: openWithdrawModal,
    onClose: closeWithdrawModal,
  } = useDisclosure();

  const {
    isOpen: isClaimInterestModalOpen,
    onOpen: openClaimInterestModal,
    onClose: closeClaimInterestModal,
  } = useDisclosure();

  const safeHealth = safe?.safeUtilization;
  const safeStrategies: StrategyInfo[] = safe?.strategies ?? [];
  const activeStrategies: StrategyInfo[] = filterUsedStrategies(safeStrategies)
  const strategiesData = useERC4626StrategiesDataAsMap(safeStrategies.map(strat => strat.strategy))

  // Average APY across all strategies you have supplied to
  // TODO(@sharad-s) - refactor into a hook
  const netAPY = Object.keys(strategiesData)
    .reduce((num, strategyAddress) => {
      const erc4626Strategy = strategiesData[strategyAddress]
      if (erc4626Strategy && erc4626Strategy.supplyRatePerBlock) {
        num += convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365)
      }
      return num / activeStrategies.length
    }, 0)


  const isAtLiquidationRisk = safeHealth?.gt(80) ?? false;

  const colorScheme = useMemo(() => {
    return safeHealth?.lte(40)
      ? "success"
      : safeHealth?.lte(60)
        ? "whatsapp"
        : safeHealth?.lte(80)
          ? "orange"
          : "red";
  }, [safeHealth]);

  return (
    <TurboLayout>
      <Head>
        <title>{tokenData?.symbol} Safe | Tribe Turbo</title>
      </Head>
      <DepositSafeCollateralModal
        isOpen={isDepositModalOpen}
        onClose={closeDepositModal}
        safe={safe}
      />
      <WithdrawSafeCollateralModal
        isOpen={isWithdrawModalOpen}
        onClose={closeWithdrawModal}
        safe={safe}
      />
      <ClaimInterestModal
        isOpen={isClaimInterestModalOpen}
        onClose={closeClaimInterestModal}
        safe={safe}
      />
      <SafeInfoModal
        isOpen={isSafeModalOpen}
        onClose={closeSafeModal}
        safe={safe}
      />

      {isAtLiquidationRisk && <LiquidationAlert safeHealth={safeHealth} />}

      <HStack>
        <AppLink href="/turbo">
          <ChevronLeftIcon />
        </AppLink>
      </HStack>

      <Stack
        direction={"row"}
        justify="space-between"
        alignItems="center"
        spacing={3}
      >
        <Skeleton isLoaded={!!tokenData}>
          <HStack>
            <Avatar src={tokenData?.logoURL} mr={2} />
            <Heading>{tokenData?.symbol} Safe</Heading>
            <InfoIcon
              onClick={openSafeModal}
              _hover={{
                cursor: "pointer",
              }}
            />
          </HStack>
        </Skeleton>
        <Spacer />

        <HStack>
          <Button
            variant="cardmatte"
            onClick={openDepositModal}
            disabled={!tokenData}
          >
            <Image
              src="/static/turbo/action-icons/deposit-collateral.png"
              height={4}
              mr={3}
            />
            Deposit Collateral
          </Button>
          <Button
            variant="cardmatte"
            onClick={openWithdrawModal}
            disabled={!tokenData}
          >
            <Image
              src="/static/turbo/action-icons/withdraw-collateral.png"
              height={4}
              mr={3}
            />
            Withdraw Collateral
          </Button>
          <Button
            variant="cardmatte"
            onClick={openClaimInterestModal}
            disabled={!tokenData}
          >
            <Image
              src="/static/turbo/action-icons/claim-interest.png"
              height={4}
              mr={3}
            />
            Claim Interest
          </Button>
        </HStack>
      </Stack>
      <Divider my={12} />

      {!safe?.boostedAmount && !loading && <OnboardingCard />}

      <BoostBar safe={safe} tokenData={tokenData} colorScheme={colorScheme} />
      <Stack spacing={12} my={12}>
        {!!safe && <SafeStats safe={safe} netAPY={netAPY} tokenData={tokenData} />}
      </Stack>
      {!!safe && <SafeStrategies safe={safe} />}
    </TurboLayout>
  );
};

export default TurboSafePage;

export const BoostBar: React.FC<{
  safe: USDPricedTurboSafe | undefined;
  tokenData: TokenData | undefined;
  colorScheme: string;
}> = ({ safe, tokenData, colorScheme }) => {
  const { boostedUSD, collateralUSD, safeUtilization } = safe ?? {};

  return (
    <Box mt={12}>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Flex alignItems="baseline">
          <Image
            boxSize={"30px"}
            src="/static/turbo/turbo-engine-green.svg"
            align={"center"}
            mr={2}
          />
          <Heading variant="success" size="lg" mr={2}>
            {shortUsdFormatter(boostedUSD ?? 0)} boosted
          </Heading>
          <Text variant="neutral">
            / {shortUsdFormatter(collateralUSD ?? 0)} ({toInt(safeUtilization)}
            %)
          </Text>
        </Flex>
        <Text variant="secondary">
          Liquidated when <Avatar src={tokenData?.logoURL} boxSize={6} mx={1} />
          $0.25
        </Text>
      </Flex>
      <Progress
        size="xs"
        width="100%"
        height={4}
        mt={4}
        hideLabel
        barVariant={colorScheme}
        value={toInt(safeUtilization)}
      />
    </Box>
  );
};

export const OnboardingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
    >
      <Card>
        <Heading size="lg">Getting Started</Heading>
        <HStack mt={12} spacing={8}>
          <HStack flex={1} spacing={6}>
            <Badge variant="neutral" fontSize="lg" boxSize={12}>
              <Heading size="lg">1</Heading>
            </Badge>
            <Box>
              <Heading size="md">Deposit collateral</Heading>
              <Text variant="secondary">
                Collateralizing is required step before boosting pools.
              </Text>
            </Box>
          </HStack>
          <HStack flex={1} spacing={6}>
            <Badge variant="neutral" fontSize="lg" boxSize={12}>
              <Heading size="lg">2</Heading>
            </Badge>
            <Box>
              <Heading size="md">Boost a pool</Heading>
              <Text variant="secondary">
                Click to boost a random pool, or scroll below for options.
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Card>
    </motion.div>
  );
};

const LiquidationAlert: React.FC<{ safeHealth: BigNumber | undefined }> = ({
  safeHealth,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
    >
      <Alert colorScheme={"#DB6464"} borderRadius={5} mb={10}>
        <AlertIcon />
        <Text>
          With a <b>{safeHealth?.toNumber()}%</b> utilization, you are at
          liquidation risk. Please deposit more collateral, or unboost.
        </Text>
        <Box h="100%" ml="auto"></Box>
      </Alert>
    </motion.div>
  );
};
