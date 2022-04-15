import { Box } from "@chakra-ui/react";
import { commify, formatEther } from "ethers/lib/utils";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { Heading, Statistic } from "rari-components";
import { smallUsdFormatter } from "utils/bigUtils";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, HStack } from "@chakra-ui/react";
import useAggregateSafeData from "hooks/turbo/useAggregateSafeData";
import { useState } from "react";
import SafeGrid from "./SafeGrid";

type SafeGridProps = {
  safes: SafeInfo[];
  onClickCreateSafe(): void;
};
const UserSafes: React.FC<SafeGridProps> = ({ safes, onClickCreateSafe }) => {
  const allStrategies = useTrustedStrategies();
  const getERC4626StrategyData = useERC4626StrategiesDataAsMap(allStrategies);

  const { totalBoosted, totalClaimableUSD, netAPY } = useAggregateSafeData(
    safes,
    getERC4626StrategyData
  );

  // TODO(sharad-s) write APY triangle implementation
  const [apyIncreasing, setApyIncreasing] = useState(true);

  return (
    <Box>
        <HStack>
            <Heading mb={7}>Your Safes</Heading>
        </HStack>
      <HStack spacing={8}>
        <Statistic
          title="Total boosted"
          // TODO(sharad-s) What should these tooltips say?
          tooltip="FEI Boosted across all your safes"
          value={
            commify(parseFloat(formatEther(totalBoosted)).toFixed(2)) + " FEI"
          }
        />
        <Statistic
          title="Total claimable interest"
          tooltip="Claimable FEI across all your safes"
          value={smallUsdFormatter(totalClaimableUSD)}
        />
        <Statistic
          title="Avg. APY"
          tooltip="Avg APY Across all your safes"
          value={
            // TODO(sharad-s) click here to toggle between states -- delete when
            // real implementation is done
            <Flex
              alignItems="center"
              onClick={() => setApyIncreasing(!apyIncreasing)}
            >
              <Heading size="lg" mr={4}>
                {netAPY.toFixed(2)}%
              </Heading>
              {/* {apyIncreasing ? (
                <TriangleUpIcon color="success" />
              ) : (
                <TriangleDownIcon color="danger" />
              )} */}
            </Flex>
          }
        />
      </HStack>
      <SafeGrid safes={safes} onClickCreateSafe={onClickCreateSafe} />
    </Box>
  );
};

export default UserSafes;
