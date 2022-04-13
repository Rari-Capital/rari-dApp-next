import { HStack, VStack } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { StrategyInfosMap } from "hooks/turbo/useStrategyInfo";
import {
  USDPricedStrategy,
  USDPricedTurboSafe,
} from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { FEI } from "lib/turbo/utils/constants";
import {
  Divider,
  Heading,
  ModalProps,
  StatisticTable,
  Text,
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import { abbreviateAmount, smallUsdFormatter } from "utils/bigUtils";

type ClaimInterestCtx = {
  incrementStepIndex(): void;
  claiming: boolean;
  onClickClaimInterest(): void;
  onClose(): void;
  totalClaimable: BigNumber;
  claimableFromStrategies: BigNumber;
  safeFeiBalance: BigNumber;
  activeStrategies: USDPricedStrategy[];
  strategyData: StrategyInfosMap;
  safe?: USDPricedTurboSafe;
};

type ModalStep = Omit<
  ModalProps<ClaimInterestCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  children: ({
    totalClaimable,
    claimableFromStrategies,
    safeFeiBalance,
    activeStrategies,
    strategyData,
    safe,
  }) => (
    <VStack>
      <HStack py={3}>
        <Heading fontSize={"lg"}>Claim Interest</Heading>
      </HStack>
      <Divider />

      <HStack mb={4} py={4}>
        <TokenIcon tokenAddress={FEI} />
        <Heading>
          {commify(parseFloat(formatEther(totalClaimable)).toFixed(2))} FEI
        </Heading>
      </HStack>

      <StatisticTable
        w="100%"
        statistics={[
          [
            "From strategies",
            `${commify(
              parseFloat(formatEther(claimableFromStrategies)).toFixed(2)
            )} FEI`,
          ],
          [
            "From the safe",
            `${commify(
              parseFloat(formatEther(safeFeiBalance)).toFixed(2)
            )} FEI`,
          ],
        ]}
      />
    </VStack>
  ),
  buttons: ({ claiming, onClickClaimInterest }) => [
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
