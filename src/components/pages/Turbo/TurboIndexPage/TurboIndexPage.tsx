import { commify, formatEther } from "ethers/lib/utils";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { TokenData, useTokensDataAsMap } from "hooks/useTokenData";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";

import { Button, Divider, Heading, HoverableCard, Link, Progress, Statistic, Text } from "rari-components";
import Tooltip from "rari-components/components/Tooltip";
import { abbreviateAmount, smallUsdFormatter } from "utils/bigUtils";
import {
  Box,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import CreateSafeModal from "./CreateSafeModal/";
import { constants } from "ethers";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

const TurboIndexPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const safes = useAllUserSafes() ?? [];
  const hasSafes = safes.length > 0;

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
            {!hasSafes && (
              <Button variant="success" onClick={onOpen}>
                Create a safe
              </Button>
            )}
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
      {hasSafes ? <SafeGrid safes={safes} onClickCreateSafe={onOpen} /> : <TurboFAQ />}
    </TurboLayout>
  );
};

type SafeGridProps = {
  safes: SafeInfo[];
  onClickCreateSafe(): void;
}

const SafeGrid: React.FC<SafeGridProps> = ({ safes, onClickCreateSafe }) => {
  const underlyings = safes.map((safe) => safe.collateralAsset);
  // TODO(sharad-s) I think `boostedAmount` is in the native token -- needs to
  // be a USD value
  const totalBoosted = safes.reduce((acc, safe) => {
    return acc.add(safe.boostedAmount);
  }, constants.Zero);

  console.log({ totalBoosted })
  const totalClaimableInterest = safes.reduce((acc, safe) => {
    // TODO(sharad-s) Calculate interest from safes here
    return constants.Zero;
  }, constants.Zero)
  const netApy = 10;
  const tokensData = useTokensDataAsMap(underlyings);

  return (
    <Box>
      <HStack spacing={8}>
        <Statistic
          title="Total boosted"
          // TODO(sharad-s) What should these tooltips say?
          tooltip="Tooltip"
          value={(formatEther(totalBoosted) + " FEI")}
        />
        <Statistic
          title="Total claimable interest"
          tooltip="Tooltip"
          value={smallUsdFormatter(totalClaimableInterest.toString())}
        />
        <Statistic
          title="Net APY"
          tooltip="Tooltip"
          value={`${netApy}%`}
        />
      </HStack>
      <SimpleGrid columns={2} spacing={8} mt={12}>
        <HoverableCard variant="ghost" onClick={onClickCreateSafe}>
          {(hovered) => (
            <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
              <Heading display="flex" alignItems="center">
                Add safe <PlusSquareIcon ml={4} />
              </Heading>
              <Text variant="secondary" mt={4} fontSize="xl">
                You may create one safe per approved collateral type.
              </Text>
            </Box>
          )}
        </HoverableCard>
        {safes.map((safe, i) => (
          <SafeCard
            key={safe.safeAddress}
            safe={safe}
            tokenData={tokensData[safe.collateralAsset]}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

type SafeCardProps = {
  safe: SafeInfo;
  tokenData?: TokenData;
}

const SafeCard: React.FC<SafeCardProps> = ({ safe, tokenData }) => {
  return (
    <Link href={`/turbo/safe/${safe.safeAddress}`}>
      <HoverableCard w="100%" variant="ghost" cursor="pointer">
        {(hovered) => (
          <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
            <HStack justify={"start"}>
              <Image src={tokenData?.logoURL} boxSize="40px" />
              <Heading>{tokenData?.symbol}</Heading>
            </HStack>
            <VStack spacing={2} mt={8} alignItems="flex-start">
              <Flex alignItems="baseline">
                <Tooltip label={`${commify(formatEther(safe.boostedAmount))} FEI`}>
                  <>
                    <Heading size="md">
                      {abbreviateAmount(formatEther(safe.boostedAmount))}
                    </Heading>
                    <Text variant="secondary" ml={2}>boosted</Text>
                  </>
                </Tooltip>
              </Flex>
            </VStack>
            <Box mt={8}>
              <Text variant="secondary" mb={2}>Active boost</Text>
              <Progress height={4} hideLabel value={safe.safeUtilization.toNumber()} />
            </Box>
          </Box>
        )}
      </HoverableCard>
    </Link >
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
