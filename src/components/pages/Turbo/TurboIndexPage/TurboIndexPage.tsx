import AppLink from "components/shared/AppLink";
import { formatEther } from "ethers/lib/utils";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { TokenData, useTokensDataAsMap } from "hooks/useTokenData";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { Button, Card, Divider, Heading, Text } from "rari-components";
import { smallUsdFormatter } from "utils/bigUtils";
import {
  Box,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import CreateSafeModal from "./CreateSafeModal/";

const TurboIndexPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const safes = useAllUserSafes();
  const hasSafes = !!safes?.length;

  return (
    <TurboLayout>
      <CreateSafeModal onClose={onClose} isOpen={isOpen} />
      <Stack
        direction={["column", "column", "row"]}
        alignItems="center"
        spacing={12}
      >
        <Box flex={1}>
          <Heading size="xl">Introducing Turbo</Heading>
          <Text variant="secondary" pt={4} fontSize="xl">
            Turbo allows any DeFi token to become productive by sharing in the
            yield generated from approved strategies earning off of a costless
            FEI line of credit.
          </Text>
          <HStack pt={8} spacing={4}>
            <Button variant="success" onClick={onOpen}>
              Create a safe
            </Button>
            <Button
              variant="cardmatte"
              as="a"
              // @ts-ignore
              // TypeScript doesn't ignore that `as="a"` means that this can
              // have an `href` prop.
              href="https://medium.com/fei-protocol/the-tribe-dao-strongly-believes-that-a-healthy-and-thriving-defi-ecosystem-needs-a-robust-platform-b1faea700dfa"
            >
              Learn more
            </Button>
          </HStack>
        </Box>
        <Box flex={1}>
          <Image src="/static/turbo/turbo.png" />
        </Box>
      </Stack>
      <Divider mt={20} mb={16} />
      {hasSafes ? <SafeGrid safes={safes} /> : <TurboFAQ />}
    </TurboLayout>
  );
};

const SafeGrid: React.FC<{
  safes: SafeInfo[];
}> = ({ safes }) => {
  const underlyings = safes.map((safe) => safe.collateralAsset);
  const tokensData = useTokensDataAsMap(underlyings);
  return (
    <VStack minW="100%">
      <SimpleGrid columns={3} spacingX="40px" spacingY="20px">
        {safes.map((safe, i) => (
          <SafeCard
            key={safe.safeAddress}
            safe={safe}
            i={i}
            tokenData={tokensData[safe.collateralAsset]}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

const SafeCard: React.FC<{
  safe: SafeInfo;
  i: number;
  tokenData: TokenData | undefined;
}> = ({ safe, i, tokenData }) => {
  return (
    <AppLink href={`/turbo/safe/${safe.safeAddress}`}>
      <Card w="100%">
        <VStack alignItems="start">
          <HStack justify={"start"}>
            <Image src={tokenData?.logoURL} boxSize="40px" />
            <Heading>{tokenData?.symbol}</Heading>
          </HStack>
          <Text>
            Boosted: {smallUsdFormatter(formatEther(safe.boostedAmount))}
          </Text>
          <Text>
            Collateral Balance: {formatEther(safe.collateralAmount)}{" "}
            {tokenData?.symbol}
          </Text>
          <Text>Utilization: {safe.safeUtilization?.toString()}%</Text>
        </VStack>
      </Card>
    </AppLink>
  );
};

const TurboFAQ = () => (
  <Stack spacing={12}>
    <Box>
      <Heading size="md">How does it work?</Heading>
      <Text variant="secondary" mt={4}>
        Turbo can be used by individuals, treasuries, DAOs, protocols, or any
        on-chain entity. Turbo Safes allow these parties to create a
        collateralized Fuse position with an approved DeFi token as the primary
        collateral type.
        <br />
        <br />
        Once the DeFi token is collateralized in a Fuse pool, the owner of this
        safe can then mint FEI at 0% APR, making this process completely free to
        the borrower. The FEI is minted at no cost so long as that FEI is
        supplied into a yield generating strategy that is compliant with
        ERC-4626, such as: Fuse plug-ins, tokenized vaults, etc.
        <br />
        <br />
        The users of Turbo will most likely deposit this FEI back into their own
        Fuse pool so that their community can borrow FEI against their
        collateral types and provide a revenue split to the issuer and the
        minter (Tribe DAO).
      </Text>
    </Box>
    <Box>
      <Heading size="md">Should I use Turbo?</Heading>
      <Text variant="secondary" mt={4}>
        DAOs are often seen with large treasuries consisting of their native
        governance token and very little stablecoins due to the cost and
        undertaking that must occur. Turbo allows a DAO to become a premier
        minter of FEI, just as easily as the Tribe DAO. The DAO affiliate will
        mint a specific percentage of FEI from a collateralized position, while
        creating a revenue split agreement with the Tribe DAO to keep both
        organizations incentivized from the yield being earned.
        <br />
        <br />
        If you are a DAO that needs stablecoin liquidity and an alternate source
        of revenue, Turbo is for you.
      </Text>
    </Box>
  </Stack>
);

export default TurboIndexPage;
