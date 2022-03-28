import {
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Card, Text, Button } from "rari-components";

// Hooks
import { useState } from "react";
import { useRari } from "context/RariContext";

// Turbo
import { SafeInfo, StrategyInfo } from "lib/turbo/fetchers/getSafeInfo";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { formatEther } from "ethers/lib/utils";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { utils } from "ethers";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { safeBoost, safeLess } from "lib/turbo/transactions/safe";
import { handleGenericError } from "utils/errorHandling";

export const SafeStrategies: React.FC<{ safe: SafeInfo }> = ({ safe }) => {
  const trustedStrats = useTrustedStrategies();
  const activeStrategies: StrategyInfo[] = safe.strategies;

  return (
    <>
      <VStack>
        <Heading>Active Strategies</Heading>
        {activeStrategies?.map((strategy, index) => (
          <ActiveStrategyItem key={index} strategy={strategy} safe={safe} />
        ))}
        <Heading>Strategies</Heading>
        {trustedStrats?.map((strategyAddress, index) => (
          <InactiveStrategyItem
            key={index}
            strategy={strategyAddress}
            safe={safe}
          />
        ))}
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
              <>{`Boost ${utils.commify(amount)} FEI`}</>
            )}
          </Button>
          {boostedAmount.gt(0) ? (
            <Button onClick={() => handleLessClick(strategy, amount)}>
              {lessing ? (
                <Spinner />
              ) : (
                <>{` Less Vault ${utils.commify(amount)}`}</>
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
            Boost {utils.commify(amount)} FEI
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
//                 Boost {utils.commify(amount)} FEI
//             </Button> */}

//                     <Text>Boosted Amount: {smallUsdFormatter(formatEther(boostedAmount))} ({formatEther(boostedAmount)})</Text>

//                     <Text>FEI Amount: {smallUsdFormatter(formatEther(feiAmount))} ({formatEther(feiAmount)})</Text>

//                     <Text>FEI Earned: {smallUsdFormatter(formatEther(feiEarned))} ({formatEther(feiEarned)})</Text>
//                 </VStack>
//                 <VStack align="start">
//                     <Button onClick={() => handleBoostClick(strategy?.strategy ?? '', amount)}>
//                         Boost {utils.commify(amount)} FEI
//                     </Button>
//                 </VStack>
//             </HStack>
//         </Card>
//     );
// }
