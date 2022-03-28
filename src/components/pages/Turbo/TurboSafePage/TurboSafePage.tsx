// Components
import { BigNumber } from "ethers";
import useSafeHealth from "hooks/turbo/useSafeHealth";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
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
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import { useRariTokenData } from "rari-components/hooks";
import {
  Box,
  Flex,
  HStack,
  Image,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import DepositSafeCollateralModal from "./DepositSafeCollateralModal";
import { SafeStats } from "./SafeStats";
import { SafeStrategies } from "./Strategies";

const MOCK_SAFE = {
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
    },
  ],
};

const TurboSafePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const safeId = id as string;

  const safe =
    useSafeInfo(safeId) ??
    // TODO(nathanhleung): Remove mock safe
    MOCK_SAFE;

  const safeHealth = useSafeHealth(safe);
  const { data: tokenData } = useRariTokenData(safe.collateralAsset);

  const {
    isOpen: isDepositModalOpen,
    onOpen: openDepositModal,
    onClose: closeDepositModal,
  } = useDisclosure();

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
      <Stack
        direction={"row"}
        justify="space-between"
        alignItems="center"
        spacing={3}
      >
        <HStack>
          <TokenIcon tokenAddress={safe.collateralAsset} mr={2} />
          <Heading>
            <TokenSymbol tokenAddress={safe.collateralAsset} /> Safe
          </Heading>
        </HStack>
        <Spacer />
        <HStack>
          <Button variant="cardmatte" onClick={openDepositModal}>
            <Image
              src="/static/turbo/action-icons/deposit-collateral.png"
              height={4}
              mr={3}
            />
            Deposit Collateral
          </Button>
          <Button variant="cardmatte">
            <Image
              src="/static/turbo/action-icons/withdraw-collateral.png"
              height={4}
              mr={3}
            />
            Withdraw Collateral
          </Button>
          <Button variant="cardmatte">
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
      <Box mt={12}>
        {/* TODO(nathanhleung): actually calculate these values */}
        <Flex justifyContent="space-between" alignItems="baseline">
          <Flex alignItems="baseline">
            <Heading variant="success" size="lg" mr={2}>
              $0 boost
            </Heading>
            <Text variant="neutral">/ $53k (67%)</Text>
          </Flex>
          <Text variant="secondary">
            Liquidated when{" "}
            <TokenIcon boxSize={6} tokenAddress={safe.collateralAsset} /> =
            $0.25
          </Text>
        </Flex>
        <Progress barVariant="success" value={10} height={4} mt={4} hideLabel />
      </Box>
      <Stack spacing={12} mt={12}>
        {!!safe && <SafeStats safe={safe} />}
      </Stack>
      <Divider mt={10} mb={8} />
      <Stack spacing={12}>{!!safe && <SafeStrategies safe={safe} />}</Stack>
    </TurboLayout>
  );
};

export default TurboSafePage;
