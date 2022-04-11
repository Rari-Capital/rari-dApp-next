import { Box, Button, Flex, HStack, Image } from "@chakra-ui/react";
import {
  Heading,
  Link,
  Table,
  Text,
  TokenIcon,
  Tooltip,
} from "rari-components";

// Turbo
import { USDPricedStrategy } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { convertMantissaToAPY } from "utils/apyUtils";
import { FEI } from "lib/turbo/utils/constants";
import { useTurboSafe } from "context/TurboSafeContext";

export const SafeStrategies: React.FC<{
  onClickBoost: (strategyAddress: string) => void;
  onClickLess: (strategyAddress: string) => void;
}> = ({ onClickBoost, onClickLess }) => {
  const { usdPricedSafe, getERC4626StrategyData } = useTurboSafe();

  const safeStrategies: USDPricedStrategy[] =
    usdPricedSafe?.usdPricedStrategies ?? [];

  const userPercent = usdPricedSafe?.tribeDAOFee
    ? 1 - parseFloat(formatEther(usdPricedSafe?.tribeDAOFee))
    : 1;

  console.log({ safeStrategies });

  // TODO (@sharad-s) Need to find a way to merge "active" and "inactive" strategies elegantly. Inactive Strategies have no strat address
  return (
    <>
      <Table
        width="100%"
        headings={[
          "Pool Name",
          "Claimable Interest",
          "APY",
          "Active Boost",
          "",
        ]}
        rows={safeStrategies.map((strat: USDPricedStrategy, i) => {
          const strategyData = getERC4626StrategyData[strat.strategy];
          const poolId: string | undefined =
            strategyData?.symbol?.split("-")[1];
          const grossApy = convertMantissaToAPY(
            strategyData?.supplyRatePerBlock ?? 0,
            365
          );
          const netAPY = grossApy * userPercent;

          const canLess = strat.boostAmountUSD > 0;

          return {
            key: strat.strategy,
            items: [
              <Link href={poolId ? `/fuse/pool/${poolId}` : "#"}>
                <HStack>
                  <TokenIcon
                    tokenAddress={strategyData?.underlying ?? FEI}
                    size="sm"
                  />
                  <Text>{strategyData?.symbol}</Text>
                </HStack>
              </Link>,
              <Box>
                <Tooltip label={`${formatEther(strat.feiClaimable)} FEI`}>
                  <Text>
                    {strat.feiClaimableUSD > 0
                      ? smallUsdFormatter(strat.feiClaimableUSD)
                      : "-"}
                  </Text>
                </Tooltip>
              </Box>,
              <Box>
                <Tooltip
                  label={`${convertMantissaToAPY(
                    strategyData?.supplyRatePerBlock,
                    365
                  ).toFixed(2)}% from Fuse after ${formatUnits(
                    usdPricedSafe?.tribeDAOFee ?? 0,
                    16
                  )}% TribeDAO Revenue Split`}
                >
                  <Text>{netAPY.toFixed(2) + "%"}</Text>
                </Tooltip>
              </Box>,
              <HStack>
                {strat.boostedAmount.gt(0) && (
                  <Image
                    boxSize={"20px"}
                    src="/static/turbo/turbo-engine-green.svg"
                    align={"center"}
                    mr={1}
                  />
                )}
                <Tooltip label={`${formatEther(strat.boostedAmount)} FEI`}>
                  <Text color={!strat.boostedAmount.isZero() ? "#62DBA1" : ""}>
                    {strat.boostAmountUSD > 0
                      ? smallUsdFormatter(strat.boostAmountUSD)
                      : "-"}
                  </Text>
                </Tooltip>
              </HStack>,
              <HStack spacing={8}>
                <Tooltip label="Boost">
                  <Flex
                    cursor="pointer"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={8}
                    borderRadius="50%"
                    transition="0.2s opacity"
                    _hover={{
                      opacity: 0.5,
                    }}
                    background="success"
                    onClick={() => onClickBoost(strat.strategy)}
                  >
                    <Heading size="sm" color="black">
                      +
                    </Heading>
                  </Flex>
                </Tooltip>
                <Tooltip label="Less">
                  <Flex
                    cursor="pointer"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={8}
                    borderRadius="50%"
                    transition="0.2s opacity"
                    opacity={canLess ? 1 : 0.5}
                    _hover={{
                      opacity: 0.5,
                      cursor: canLess ? "pointer" : "not-allowed",
                    }}
                    background="danger"
                    onClick={() =>
                      canLess ? onClickLess(strat.strategy) : null
                    }
                  >
                    <Heading size="sm" color="black">
                      —
                    </Heading>
                  </Flex>
                </Tooltip>
              </HStack>,
            ],
          };
        })}
      />
    </>
  );
};
