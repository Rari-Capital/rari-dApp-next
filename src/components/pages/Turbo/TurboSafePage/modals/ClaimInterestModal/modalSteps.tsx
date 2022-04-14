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
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, HStack, Stack, VStack } from "@chakra-ui/react";

type ClaimInterestCtx = {
  incrementStepIndex(): void;
  resetStepIndex(): void;
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
      <Heading size="md">Claim Interest</Heading>
      <HStack py={8}>
        <TokenIcon tokenAddress={FEI} />
        <Heading size="xl">
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
      children: claiming ? "Claiming..." : "Claim rewards",
      variant: "neutral",
      loading: claiming,
      async onClick() {
        await onClickClaimInterest();
      },
    },
  ],
};

const MODAL_STEP_2: ModalStep = {
  children: ({ totalClaimable }) => (
    <Stack alignItems="center" spacing={8}>
      <CheckCircleIcon boxSize={24} color="neutral" />
      <Box textAlign="center">
        <Heading>
          {commify(parseFloat(formatEther(totalClaimable)).toFixed(2))} FEI
        </Heading>
        <Text fontSize="lg" my={4}>
          Successfully claimed
        </Text>
      </Box>
    </Stack>
  ),
  buttons: ({ resetStepIndex, onClose }) => [
    {
      children: "Back to Safe",
      variant: "neutral",
      async onClick() {
        resetStepIndex();
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1, MODAL_STEP_2];

export { MODAL_STEPS };
export type { ClaimInterestCtx };
