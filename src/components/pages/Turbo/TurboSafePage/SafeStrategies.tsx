import {
  HStack,
  VStack,
  Image,
  Box,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Link, Text, TokenIcon } from "rari-components";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import Table from "lib/components/Table";

// Hooks
import { useState } from "react";

// Turbo
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { formatEther } from "ethers/lib/utils";
import { convertMantissaToAPY } from "utils/apyUtils";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import BoostModal from "./modals/BoostModal";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { FEI } from "lib/turbo/utils/constants";

export const SafeStrategies: React.FC<{ safe: USDPricedTurboSafe }> = ({ safe }) => {
  const trustedStrats: string[] = useTrustedStrategies();
  const safeStrategies: USDPricedStrategy[] = safe.usdPricedStrategies;
  

  // Fetches FuseERC4626 Data about each strategy
  const strategiesData = useERC4626StrategiesDataAsMap(trustedStrats)

  console.log({ safeStrategies, trustedStrats, strategiesData })


  const { isOpen: isBoostModalOpen, onOpen: onBoostModalOpen, onClose: onBoostModalClose } = useDisclosure();

  const [activeStrategyIndex, setActiveStrategyIndex] = useState<number | undefined>()
  const [mode, setMode] = useState<SafeInteractionMode.BOOST | SafeInteractionMode.LESS>(SafeInteractionMode.BOOST)

  const handleBoostClick = (strategyIndex: number) => {
    setActiveStrategyIndex(strategyIndex);
    setMode(SafeInteractionMode.BOOST)
    onBoostModalOpen();
  }

  const handleLessClick = (strategyIndex: number) => {
    setActiveStrategyIndex(strategyIndex);
    setMode(SafeInteractionMode.LESS)
    onBoostModalOpen();
  }

  const activeStrategy = activeStrategyIndex !== undefined ? safeStrategies[activeStrategyIndex] : undefined

  // TODO (@nathanhleung) Tooltips appear on top left for some reason
  // TODO (@nathanhleung) Table key rendering issues  
  // TODO (@sharad-s) Need to find a way to merge "active" and "inactive" strategies elegantly. Inactive Strategies have no strat address 
  return (
    <>
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={onBoostModalClose}
        safe={safe}
        strategy={activeStrategy}
        strategyIndex={activeStrategyIndex ?? 0}
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
          ]}
          rows={
            safeStrategies.map((strat: USDPricedStrategy, i) => {
              const strategyData = strategiesData[strat.strategy]
              const poolId: string | undefined = strategyData?.symbol?.split('-')[1]
              return ({
                key: strat.strategy,
                data: [
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
                      <SimpleTooltip label={`${formatEther(strat.feiEarned)} FEI`}>
                        <Text>
                          {smallUsdFormatter(strat.feiEarnedUSD)}
                        </Text>
                      </SimpleTooltip>
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
                      <SimpleTooltip label={`${formatEther(strat.boostedAmount)} FEI`}>
                        <Text>
                          {smallUsdFormatter(strat.boostAmountUSD)}
                        </Text>
                      </SimpleTooltip>
                    </HStack>
                  ),
                  <HStack>
                    <SimpleTooltip label="Boost">
                      <IconButton bg="green" aria-label="boost" onClick={() => handleBoostClick(i)}>
                        <PlusSquareIcon />
                      </IconButton>
                    </SimpleTooltip>
                    <SimpleTooltip label="Less">
                      <IconButton bg="red" aria-label="less" onClick={() => handleLessClick(i)}>
                        <MinusIcon />
                      </IconButton>
                    </SimpleTooltip>
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