import {
  HStack,
  Spinner,
  useToast,
  VStack,
  Image,
  Box,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Card, Text, Button, TokenIcon } from "rari-components";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import AppLink from "components/shared/AppLink";
import Table from "lib/components/Table";

// Hooks
import { useState } from "react";
import { useRari } from "context/RariContext";

// Turbo
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { safeBoost, safeLess } from "lib/turbo/transactions/safe";
import { StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { formatEther, commify, parseEther } from "ethers/lib/utils";
import { constants } from "ethers";
import { handleGenericError } from "utils/errorHandling";
import { convertMantissaToAPY } from "utils/apyUtils";
import { useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import BoostModal from "./modals/BoostModal";


export const SafeStrategies: React.FC<{ safe: USDPricedTurboSafe }> = ({ safe }) => {
  // const trustedStrats: string[] = useTrustedStrategies();
  const safeStrategies: USDPricedStrategy[] = safe.usdPricedStrategies;

  // Fetches FuseERC4626 Data about each strategy
  const strategiesData = useERC4626StrategiesDataAsMap(safeStrategies.map(strat => strat.strategy))

  const { isOpen: isBoostModalOpen, onOpen: onBoostModalOpen, onClose: onBoostModalClose } = useDisclosure();

  const [activeStrategyIndex, setActiveStrategyIndex] = useState<number | undefined>()

  const handleBoostClick = (strategyIndex: number) => {
    setActiveStrategyIndex(strategyIndex);
    onBoostModalOpen();
  }

  const handleLessClick = (strategyIndex: number) => {
    setActiveStrategyIndex(strategyIndex);
    onBoostModalOpen();
  }


  const activeStrategy = activeStrategyIndex !== undefined ? safeStrategies[activeStrategyIndex] : undefined

  // TODO (@nathanhleung) Tooltips appear on top left for some reason
  // TODO (@nathanhleung) Table key rendering issues  
  return (
    <>
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={onBoostModalClose}
        safe={safe}
        strategy={activeStrategy}
        strategyIndex={activeStrategyIndex ?? 0}
        erc4626Strategy={activeStrategy ? strategiesData[activeStrategy.strategy] : undefined}
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
                    <AppLink href={poolId ? `/fuse/pool/${poolId}` : '#'}>
                      <HStack>
                        <TokenIcon tokenAddress={strategyData?.underlying ?? ""} size="sm" />
                        <Text>
                          {strategyData?.symbol}
                        </Text>
                      </HStack>
                    </AppLink>),
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

// TODO - consolidate this active n inactive strat compoonents. Various ways we can do this.
// At the UI levle or the backend level.
const ActiveStrategyItem: React.FC<{
  safe: SafeInfo;
  strategy: StrategyInfo;
}> = ({ safe, strategy }) => {
  const { provider, chainId } = useRari();
  const toast = useToast();

  const [amount, setAmount] = useState("1000000");
  const boostedAmount = strategy.boostedAmount;
  const feiAmount = strategy.feiAmount;
  const feiEarned = feiAmount.sub(boostedAmount);

  const [boosting, setBoosting] = useState(false);
  const [lessing, setLessing] = useState(false);

  // Boostst a strategy with hardcoded amount
  const handleBoostClick = async (strategy: string, amount: string) => {
    if (!safe.safeAddress || !provider || !amount) return;
    const amountBN = parseEther(amount);

    try {
      setBoosting(true);
      await safeBoost(
        safe.safeAddress,
        strategy,
        amountBN,
        //@ts-ignore
        await provider.getSigner()
      );
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setBoosting(false);
    }
  };

  const handleLessClick = async (strategy: StrategyInfo, amount: string) => {
    if (!safe.safeAddress || !provider || !amount) return;

    let amountBN = parseEther(amount);
    amountBN = amountBN.gte(strategy.boostedAmount)
      ? strategy.boostedAmount
      : amountBN;
    const lessingMax = strategy.boostedAmount.eq(amountBN);

    if (lessingMax) {
      alert("You slurpin too baby");
    }

    try {
      setLessing(true);
      await safeLess(
        safe.safeAddress,
        strategy.strategy,
        amountBN,
        lessingMax,
        await provider.getSigner(),
        chainId ?? 1
      );
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setLessing(false);
    }
  };

  return (
    <Card w="100%">
      <HStack justify="space-between">
        <VStack align="start">
          <Text>{strategy.strategy}</Text>

          <Text>
            Boosted Amount: {smallUsdFormatter(formatEther(boostedAmount))} (
            {formatEther(boostedAmount)})
          </Text>

          <Text>
            FEI Amount: {smallUsdFormatter(formatEther(feiAmount))} (
            {formatEther(feiAmount)})
          </Text>

          <Text>
            FEI Earned: {smallUsdFormatter(formatEther(feiEarned))} (
            {formatEther(feiEarned)})
          </Text>
        </VStack>
        <VStack align="start">
          <Button onClick={() => handleBoostClick(strategy.strategy, amount)}>
            {boosting ? (
              <Spinner />
            ) : (
              <>{`Boost ${commify(amount)} FEI`}</>
            )}
          </Button>
          {boostedAmount.gt(0) ? (
            <Button onClick={() => handleLessClick(strategy, amount)}>
              {lessing ? (
                <Spinner />
              ) : (
                <>{` Less Vault ${commify(amount)}`}</>
              )}
            </Button>
          ) : null}
        </VStack>
      </HStack>
    </Card>
  );
};

const InactiveStrategyItem: React.FC<{
  safe: SafeInfo;
  strategy: string;
}> = ({ safe, strategy }) => {
  const { provider } = useRari();
  const toast = useToast();

  const [amount, setAmount] = useState("1000000");

  const boostedAmount = constants.Zero;
  const feiAmount = constants.Zero;
  const feiEarned = feiAmount.sub(boostedAmount);

  // Boostst a strategy with hardcoded amount
  const handleBoostClick = async (strategy: string, amount: string) => {
    console.log(safe, provider, amount);

    if (!safe.safeAddress || !provider || !amount) return;
    const amountBN = parseEther(amount);

    try {
      await safeBoost(
        safe.safeAddress,
        strategy,
        amountBN,
        //@ts-ignore
        await provider.getSigner()
      );
    } catch (err) {
      handleGenericError(err, toast);
    }
  };

  return (
    <Card w="100%">
      <HStack justify="space-between">
        <VStack align="start">
          <Text>{strategy}</Text>

          <Text>
            Boosted Amount: {smallUsdFormatter(formatEther(boostedAmount))} (
            {formatEther(boostedAmount)})
          </Text>

          <Text>
            FEI Amount: {smallUsdFormatter(formatEther(feiAmount))} (
            {formatEther(feiAmount)})
          </Text>

          <Text>
            FEI Earned: {smallUsdFormatter(formatEther(feiEarned))} (
            {formatEther(feiEarned)})
          </Text>
        </VStack>
        <VStack align="start">
          <Button onClick={() => handleBoostClick(strategy, amount)}>
            Boost {commify(amount)} FEI
          </Button>
        </VStack>
      </HStack>
    </Card>
  );
};

// const InactiveStrategyItem: React.FC<
//     {
//         safe: SafeInfo,
//         strategy: StrategyInfo | undefined
//     }
// > = ({ safe, strategy }) => {

//     console.log({ strategy })

//     const { provider } = useRari();

//     const [amount, setAmount] = useState('100')

//     const boostedAmount =
//         strategy?.boostedAmount ?? constants.Zero;
//     const feiAmount =
//         strategy?.feiAmount ?? constants.Zero;
//     const feiEarned = feiAmount.sub(boostedAmount);

//     // Boostst a strategy with hardcoded amount
//     const handleBoostClick = async (strategy: string, amount: string) => {
//         if (!safe.safeAddress || !provider || !amount) return;
//         const amountBN = parseEther(amount)

//         await safeBoost(
//             safe.safeAddress,
//             strategy,
//             amountBN,
//             //@ts-ignore
//             await provider.getSigner()
//         );
//     };

//     return (
//         <Card w="100%">
//             <HStack justify="space-between">
//                 <VStack align="start">
//                     <Text>{strategy?.strategy}</Text>

//                     {/* <Button onClick={() => handleBoostClick(strategy)}>
//                 Boost {commify(amount)} FEI
//             </Button> */}

//                     <Text>Boosted Amount: {smallUsdFormatter(formatEther(boostedAmount))} ({formatEther(boostedAmount)})</Text>

//                     <Text>FEI Amount: {smallUsdFormatter(formatEther(feiAmount))} ({formatEther(feiAmount)})</Text>

//                     <Text>FEI Earned: {smallUsdFormatter(formatEther(feiEarned))} ({formatEther(feiEarned)})</Text>
//                 </VStack>
//                 <VStack align="start">
//                     <Button onClick={() => handleBoostClick(strategy?.strategy ?? '', amount)}>
//                         Boost {commify(amount)} FEI
//                     </Button>
//                 </VStack>
//             </HStack>
//         </Card>
//     );
// }
