import { commify, formatEther } from "ethers/lib/utils";
import { useIsUserAuthorizedToCreateSafes } from "hooks/turbo/useIsUserAuthorizedToCreateSafes";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import {
  Button,
  Divider,
  Heading,
  HoverableCard,
  Statistic,
  Text,
} from "rari-components";
import { smallUsdFormatter } from "utils/bigUtils";
import { TriangleDownIcon, TriangleUpIcon, WarningIcon } from "@chakra-ui/icons";
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
import SafeCard from "./SafeCard";
import useAggregateSafeData from "hooks/turbo/useAggregateSafeData";
import { useState } from "react";
import { useRariTokenData } from "rari-components/hooks";
import { TRIBE } from "lib/turbo/utils/constants";

const TurboIndexPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const safes = useAllUserSafes() ?? [];
  const hasSafes = safes.length > 0;

  const isAuthorized = useIsUserAuthorizedToCreateSafes();
  // Prefetch Tribe data so it's in the `TokenIcon`/`TokenSymbol` cache.
  // This allows collateral types to load instantly when the "Create Safe"
  // modal is initially opened.
  const _ = useRariTokenData(TRIBE);

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
          {/* Buttons */}
          <VStack w="100%" align="flex-start">
            <HStack pt={8} spacing={4} mb={4}>
              {!hasSafes && (
                <Button variant={isAuthorized ? "success" : "warning"} onClick={onOpen} disabled={!isAuthorized}>
                  Create a safe
                </Button>
              )}
              <Button
                variant="cardmatte"
                as="a"
                // TypeScript doesn't realize that `as="a"` means that this can
                // have an `href` prop.
                // @ts-ignore
                href="https://medium.com/fei-protocol/the-tribe-dao-strongly-believes-that-a-healthy-and-thriving-defi-ecosystem-needs-a-robust-platform-b1faea700dfa"
                target="_blank"
              >
                Learn more
              </Button>
            </HStack>
            {!hasSafes && !isAuthorized && (
              <HStack>
                <WarningIcon color="warning" />
                <Text color={"warning"}>
                  Turbo is in beta, and safe creation is only open to authorized users.
                </Text>
              </HStack>
            )}


          </VStack>
        </Box>
        <Box flex={1}>
          <Image src="/static/turbo/turbo.png" />
        </Box>
      </Stack>

      <Divider mt={20} mb={16} />
      {hasSafes ? (
        <SafeGrid safes={safes} onClickCreateSafe={onOpen} />
      ) : (
        <TurboFAQ />
      )}
    </TurboLayout>
  );
};

type SafeGridProps = {
  safes: SafeInfo[];
  onClickCreateSafe(): void;
};

const SafeGrid: React.FC<SafeGridProps> = ({ safes, onClickCreateSafe }) => {
  const allStrategies = useTrustedStrategies();
  const getERC4626StrategyData = useERC4626StrategiesDataAsMap(allStrategies);

  const {
    totalBoosted,
    totalClaimable,
    totalClaimableUSD,
    netAPY
  } = useAggregateSafeData(safes, getERC4626StrategyData)

  // TODO(sharad-s) write APY triangle implementation
  const [apyIncreasing, setApyIncreasing] = useState(true);

  return (
    <Box>
      <HStack spacing={8}>
        <Statistic
          title="Total boosted"
          // TODO(sharad-s) What should these tooltips say?
          tooltip="Tooltip"
          value={commify(parseFloat(formatEther(totalBoosted)).toFixed(2)) + " FEI"}
        />
        <Statistic
          title="Total claimable interest"
          tooltip="Tooltip"
          value={smallUsdFormatter(totalClaimableUSD)}
        />
        <Statistic title="Net APY" tooltip="Tooltip" value={(
          // TODO(sharad-s) click here to toggle between states -- delete when
          // real implementation is done
          <Flex alignItems="center" onClick={() => setApyIncreasing(!apyIncreasing)}>
            <Heading size="lg" mr={4}>
              {netAPY.toFixed(2)}%
            </Heading>
            {apyIncreasing ? <TriangleUpIcon color="success" /> : <TriangleDownIcon color="danger" />}
          </Flex>
        )} />
      </HStack>
      <SimpleGrid columns={[1, 1, 2, 3]} spacing={4} mt={12}>
        <HoverableCard variant="active" onClick={onClickCreateSafe}>
          {(hovered) => (
            <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
              <Heading display="flex" alignItems="center" size="lg">
                Add safe <Flex
                  alignItems="center"
                  justifyContent="center"
                  boxSize={6}
                  borderRadius="50%"
                  background="white"
                  ml={4}
                >
                  <Heading size="sm" color="black">+</Heading>
                </Flex>
              </Heading>
              <Text variant="secondary" mt={4} fontSize="lg">
                You may create one safe per approved collateral type.
              </Text>
            </Box>
          )}
        </HoverableCard>
        {safes.map((safe) => (
          <SafeCard
            key={safe.safeAddress}
            safe={safe}
            getERC4626StrategyData={getERC4626StrategyData}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

const TurboFAQ = () => (
  <Stack spacing={12}>

    <HStack>
      <Image boxSize={"md"} src="https://media.discordapp.net/attachments/958411922330509314/959902592236929154/otrorr.png?width=1220&height=1220" />
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
    </HStack>

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
