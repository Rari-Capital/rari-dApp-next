import {
  Flex,
  HStack,
  VStack,
  Image,
  Box,
  useDisclosure
} from "@chakra-ui/react";
import { Heading, Link, Table, Text, TokenIcon, TokenSymbol, Tooltip } from "rari-components";

// Hooks
import { useMemo, useState } from "react";

// Turbo
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { keyBy } from 'lodash';
import { formatEther } from "ethers/lib/utils";
import { convertMantissaToAPY } from "utils/apyUtils";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import BoostModal from "./modals/BoostModal";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { FEI } from "lib/turbo/utils/constants";
import useBoostCapsForStrategies from "hooks/turbo/useBoostCapsForStrategies";
import { filterUsedStrategies } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { useTurboSafe } from "context/TurboSafeContext";

export const SafeStrategies: React.FC = () => {
  const { usdPricedSafe } = useTurboSafe();

  const trustedStrats: string[] = useTrustedStrategies();
  const safeStrategies: USDPricedStrategy[] = usdPricedSafe?.usdPricedStrategies ?? [];

  // Construct a new object where safe strategies are indexed by address
  // for O(1) access by address (order in the table is not necessarily
  // stable).
  const safeStrategiesByAddress = useMemo(() => keyBy(
    safeStrategies,
    strategy => strategy.strategy
  ), [safeStrategies]);

  // Fetches FuseERC4626 Data about each strategy
  const strategiesData = useERC4626StrategiesDataAsMap(trustedStrats)

  // Modal Context
  const { isOpen: isBoostModalOpen, onOpen: onBoostModalOpen, onClose: onBoostModalClose } = useDisclosure();
  const [activeStrategyAddress, setActiveStrategyAddress] = useState<string>()
  const [mode, setMode] = useState<SafeInteractionMode.BOOST | SafeInteractionMode.LESS>(SafeInteractionMode.BOOST)

  const handleBoostClick = (strategyAddress: string) => {
    setActiveStrategyAddress(strategyAddress);
    setMode(SafeInteractionMode.BOOST)
    onBoostModalOpen();
  }

  const handleLessClick = (strategyAddress: string) => {
    setActiveStrategyAddress(strategyAddress);
    setMode(SafeInteractionMode.LESS)
    onBoostModalOpen();
  }

  const activeStrategy = !!activeStrategyAddress
    ? safeStrategiesByAddress[activeStrategyAddress]
    : undefined;

  // For now, a bunch of other components rely on the assumption that the
  // order of the strategies *stored in the source `safe.usdPricedStrategies`
  // array* is stable. Since the order of items in the table is not
  // necessarily stable, we need to translate from a table index to a source
  // array index using `Array.prototype.findIndex`.
  const activeStrategyIndex = useMemo(() =>
    safeStrategies.findIndex(
      (strategy) => strategy.strategy === activeStrategyAddress
    ),
    [safeStrategies, activeStrategyAddress]
  );

  const getBoostCapForStrategy = useBoostCapsForStrategies(
    safeStrategies.map(({ strategy }) => strategy)
  )

  // TODO (@sharad-s) Need to find a way to merge "active" and "inactive" strategies elegantly. Inactive Strategies have no strat address 
  return (
    <>
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={onBoostModalClose}
        safe={usdPricedSafe}
        strategy={activeStrategy}
        strategyIndex={activeStrategyIndex}
        erc4626Strategy={activeStrategy ? strategiesData[activeStrategy.strategy] : undefined}
        mode={mode}
      />
      <VStack w="100%">
        <Table
          width="100%"
          headings={[
            "Strategy",
            "Earned FEI",
            "APY",
            "Active Boost",
            "",
          ]}
          rows={
            safeStrategies.map((strat: USDPricedStrategy, i) => {
              const strategyData = strategiesData[strat.strategy]
              const poolId: string | undefined = strategyData?.symbol?.split('-')[1]
              return ({
                key: strat.strategy,
                items: [
                  (
                    <Link href={poolId ? `/fuse/pool/${poolId}` : '#'}>
                      <HStack>
                        <TokenIcon tokenAddress={strategyData?.underlying ?? FEI} size="sm" />
                        <Text>
                          {strategyData?.symbol}
                        </Text>
                      </HStack>
                    </Link>),
                  (
                    <Box>
                      <Tooltip label={`${formatEther(strat.feiEarned)} FEI`}>
                        <Text>
                          {smallUsdFormatter(strat.feiEarnedUSD)}
                        </Text>
                      </Tooltip>
                    </Box>
                  ),
                  convertMantissaToAPY(strategyData?.supplyRatePerBlock, 365).toFixed(2) + "%",
                  (
                    <HStack>
                      {strat.boostedAmount.gt(0) && <Image
                        boxSize={"20px"}
                        src="/static/turbo/turbo-engine-green.svg"
                        align={"center"}
                        mr={2}
                      />}
                      <Tooltip label={`${formatEther(strat.boostedAmount)} FEI`}>
                        <Text>
                          {smallUsdFormatter(strat.boostAmountUSD)}
                        </Text>
                      </Tooltip>
                    </HStack>
                  ),
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
                        onClick={() => handleBoostClick(strat.strategy)}
                      >
                        <Heading size="sm">+</Heading>
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
                        _hover={{
                          opacity: 0.5,
                        }}
                        background="danger"
                        onClick={() => handleLessClick(strat.strategy)}
                      >
                        <Heading size="sm">—</Heading>
                      </Flex>
                    </Tooltip>
                  </HStack>

                ]
              })
            })
          }

        />
      </VStack>
    </>
  );
};