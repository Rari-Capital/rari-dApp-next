import { VStack } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { StrategyInfosMap } from "hooks/turbo/useStrategyInfo";
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { ModalProps, Text } from "rari-components";
import { smallUsdFormatter } from "utils/bigUtils";

type ClaimInterestCtx = {
  incrementStepIndex(): void;
  claiming: boolean;
  onClickClaimInterest(): void;
  onClose(): void;
  totalClaimable: BigNumber;
  claimableFromStrategies: BigNumber;
  safeFeiBalance: BigNumber;
  activeStrategies: USDPricedStrategy[];
  strategyData: StrategyInfosMap,
  safe?: USDPricedTurboSafe
};

type ModalStep = Omit<
  ModalProps<ClaimInterestCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Claim Interest",
  children: ({ totalClaimable, claimableFromStrategies, safeFeiBalance, activeStrategies, strategyData, safe }) => (
    <>
      <Text>You can claim {smallUsdFormatter(formatEther(totalClaimable))} in interest.</Text>
      {/* <Text> - {smallUsdFormatter(formatEther(safeFeiBalance))} in the safe.</Text> */}
      {/* <Text> - {smallUsdFormatter(formatEther(claimableFromStrategies))} from {activeStrategies.length} strategies</Text> */}
      <Text> You will be {
        activeStrategies.length ? `
      slurping ${activeStrategies.length} strategies for ${smallUsdFormatter(formatEther(claimableFromStrategies))} and `
          : null} sweeping the safe for {smallUsdFormatter(formatEther(safeFeiBalance))}</Text>

      <VStack>
        {activeStrategies.map(strat => {
          return (
            <Text>{strategyData[strat.strategy]?.symbol} - {strat.feiEarnedUSD * parseFloat(formatEther(safe?.tribeDAOFee ?? constants.Zero))}</Text>
          )
        })}
      </VStack>
    </>
  ),
  buttons: ({
    claiming,
    onClickClaimInterest,
    incrementStepIndex,
    onClose,
  }) => [
      {
        children: claiming ? "Claiming..." : "Claim Interest",
        variant: "neutral",
        loading: claiming,
        async onClick() {
          await onClickClaimInterest();
        },
      },
    ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1];

export { MODAL_STEPS };
export type { ClaimInterestCtx };
