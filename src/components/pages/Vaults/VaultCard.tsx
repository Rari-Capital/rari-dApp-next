import { Text, HStack, VStack, Heading, Box, Flex } from "@chakra-ui/layout";
import { BigNumber } from "@ethersproject/bignumber";

import AppLink from "components/shared/AppLink";
import { CTokenIcon } from "components/shared/Icons/CTokenIcon";
import { ModalDivider } from "components/shared/Modal";
import { SubgraphStrategy } from "lib/vaultsv2/types";
// import { useTokenData } from "hooks/useTokenData";
import { GetVaultsResult_Vault } from "lib/vaultsv2/vaults";
import { useMemo } from "react";
import { HoverCard } from "../ExplorePage/ExplorePage";
import ColorHash from "color-hash";
import { formatUnits } from "@ethersproject/units";

const colorHash = new ColorHash();

const VaultCard = ({ vault }: { vault: GetVaultsResult_Vault }) => {
  const totalHoldings = useMemo(
    () =>
      parseFloat(
        formatUnits(
          BigNumber.from(vault.totalHoldings ?? "0"),
          vault.underlyingDecimals
        )
      ).toFixed(),
    [vault.totalHoldings]
  );

  return (
    <AppLink
      href={`/vaults/${vault.underlying}`}
      as={HoverCard}
      w="100%"
      h="300px"
      p={4}
      color="white"
    >
      <VStack w="100%" h="100%">
        {/* Title */}
        <HStack flexBasis="35%" flexGrow={0} w="100%" h="100%" bg="">
          {/* <Text>{vault.underlyingSymbol}</Text> */}
          <CTokenIcon address={vault.underlying} chainId={42} />
          <Heading size="lg">{vault.underlyingSymbol} Vault</Heading>
        </HStack>
        <ModalDivider />

        {/* Data */}
        <VStack
          h="100%"
          w="100%"
          flexBasis="65%"
          justifyContent="flex-start"
          alignItems="flex-start"
          px={4}
          py={2}
          // bg="aqua"
        >
          <HStack
            w="100%"
            h="100%"
            //   bg="pink"
          >
            {/* Left Side */}
            <VStack
              h="100%"
              w="100%"
              flexBasis="50%"
              justifyContent="flex-start"
              alignItems="flex-start"
              // bg="aqua"
            >
              <HStack>
                <Text fontSize={["sm"]} color="grey">
                  Current APY
                </Text>
              </HStack>
              <Heading
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
              >
                25%
              </Heading>
            </VStack>
            {/* Right Side */}
            <VStack
              h="100%"
              w="100%"
              alignItems="flex-start"
              flexBasis="50%"
              // bg="lime"
            >
              <Text fontSize={["sm"]} color="grey">
                Total Supply
              </Text>
              <Heading fontSize="2xl">
                {" "}
                {totalHoldings} {vault.underlyingSymbol}
              </Heading>
            </VStack>
            ;{/* <Text>{vault.underlyingSymbol}</Text> */}
          </HStack>
        </VStack>
      </VStack>

      {/* BarBar */}
      <Box width="100%" h="100%" px={4} mb="auto">
        <BaarBaar
          strategies={vault.trustedStrategies}
          totalHoldings={vault.totalHoldings}
        />
      </Box>
    </AppLink>
  );
};

type BalanceObj = Pick<SubgraphStrategy, "balance">;

export const useVaultStrategyPercentages = (strategies: SubgraphStrategy[]) => {
  return useMemo(() => {
    const map: { [id: string]: number } = {};
    if (strategies.length) {
      // Get the total balance of all the strategies
      const totalBalance = BigNumber.from(
        (strategies as BalanceObj[]).reduce((a, b) => {
          return {
            balance: BigNumber.from(a.balance)
              .add(BigNumber.from(b.balance))
              .toString(),
          };
        }).balance
      );

      //  For each strategy, calculate the percentage of
      strategies.forEach((strat) => {
        const stratBalance = BigNumber.from(strat.balance);

        let percent = Math.ceil(
          stratBalance.mul(10000).div(BigNumber.from(totalBalance)).toNumber() /
            100
        );

        map[strat.id] = percent;
      });
    }
    return map;
  }, [strategies]);
};

const BaarBaar = ({
  strategies,
  totalHoldings,
}: {
  strategies: SubgraphStrategy[];
  totalHoldings: string;
}) => {
  const strategiesMap = useVaultStrategyPercentages(strategies);
  console.log({ strategiesMap });

  return (
    <Box>
      <Flex width="100%" height="4px" justify="flex-start" borderRadius="lg">
        {!!Object.keys(strategiesMap).length ? (
          Object.keys(strategiesMap).map((strategy) => (
            <Box
              h="100%"
              flexBasis={`${strategiesMap[strategy].toFixed()}%`}
              bg={colorHash.hex(strategy + "a")}
            />
          ))
        ) : (
          <Box h="100%" bg="grey" />
        )}
      </Flex>
    </Box>
  );
};

export default VaultCard;
