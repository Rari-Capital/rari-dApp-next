import { BigNumber } from "ethers";
import { commify, formatEther, parseEther } from "ethers/lib/utils";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import {
  Heading,
  ModalProps,
  Text,
  TokenAmountInput,
  TokenSymbol,
} from "rari-components";
import { abbreviateAmount } from "utils/bigUtils";
import StatisticTable from "lib/components/StatisticsTable";
import { Box, Stack, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

type DepositSafeCollateralCtx = {
  incrementStepIndex(): void;
  resetStepIndex(): void;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  hasApproval: boolean;
  approving: boolean;
  onClickApprove(): Promise<void>;
  depositAmount: string;
  setDepositAmount(newDepositAmount: string): void;
  depositing: boolean;
  collateralBalance: BigNumber;
  onClickDeposit(): Promise<void>;
  onClickMax(): Promise<void>;
  onClose(): void;
};

type ModalStep = Omit<
  ModalProps<DepositSafeCollateralCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Deposit Collateral",
  subtitle: "Lorem Ipsum is simply dummy text",
  children: ({ onClickMax, setDepositAmount, safe, updatedSafe, collateralBalance, depositAmount }) =>
    !!safe && (
      <>
        <VStack w="100%" mb={3} align="flex-end">
          <TokenAmountInput
            value={depositAmount}
            onChange={(amount: string) => setDepositAmount(amount ?? '0')}
            tokenAddress={safe.collateralAsset}
            onClickMax={onClickMax}
          />
          <Text variant="secondary" mt="4" _hover={{ cursor: "default" }}>
            Balance: {commify(formatEther(collateralBalance))}{" "}
            <TokenSymbol tokenAddress={safe.collateralAsset} />
          </Text>
        </VStack>
        <StatisticTable
          statistics={[
            {
              title: "Collateral",
              primaryValue: abbreviateAmount(safe?.collateralUSD),
              secondaryValue: depositAmount === "" ? undefined : abbreviateAmount(updatedSafe?.collateralUSD),
              titleTooltip: "How much collateral you have deposited.",
              primaryTooltip: `$ ${commify(safe.collateralUSD ?? 0)}`,
              secondaryTooltip: `$ ${commify(updatedSafe?.collateralUSD ?? 0)}`
            },
            {
              title: "Max Boost",
              primaryValue: abbreviateAmount(safe?.maxBoost),
              secondaryValue: depositAmount === "" ? undefined : abbreviateAmount(updatedSafe?.maxBoost),
              titleTooltip: "The maximum amount you can boost. This is collateralUSD * collateralFactor ",
              primaryTooltip: `$ ${commify(safe.collateralUSD ?? 0)}`,
              secondaryTooltip: `$ ${commify(updatedSafe?.maxBoost ?? 0)}`
            },
            {
              title: "Safe Utilization",
              primaryValue: parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%" ?? "?",
              secondaryValue: depositAmount === "" ? undefined : parseFloat(updatedSafe?.safeUtilization.toString() ?? "0").toFixed(2) + "%" ?? "?",
              titleTooltip: "The health of your safe. ",
              primaryTooltip: ""

            },
          ]}
          isLoading={!updatedSafe}
        />
      </>
    ),
  buttons: ({
    approving,
    depositing,
    hasApproval,
    onClickApprove,
    onClickDeposit,
    incrementStepIndex,
    depositAmount,
  }) => [
      {
        children: approving
          ? "Approving..."
          : depositing
            ? "Depositing..."
            : !hasApproval
              ? "Approve Router"
              : "Deposit",
        variant: "neutral",
        loading: approving || depositing,
        disabled: !depositAmount || depositAmount === "0",
        async onClick() {
          try {
            if (!hasApproval) {
              await onClickApprove();
            }

            await onClickDeposit();
            incrementStepIndex()
          }
          catch (err) {
            throw err
          }
        },
      },
    ],
};

const MODAL_STEP_2: ModalStep = {
  children: ({ depositAmount, updatedSafe }) =>
    (
      <Stack alignItems="center" spacing={8}>
        <CheckCircleIcon boxSize={40} color="neutral" />
        <Box textAlign="center">
          <Heading>
            {commify(depositAmount)}{" "}
            <TokenSymbol tokenAddress={updatedSafe?.collateralAsset ?? ""} />
          </Heading>
          <Text fontSize="lg" my={4}>
            Successfully deposited
          </Text>
        </Box>
      </Stack>
    ),
  buttons: ({
    onClose,
    resetStepIndex
  }) => [
      {
        children: "Back to Safe",
        variant: "neutral",
        async onClick() {
          resetStepIndex()
          onClose()
        },
      },
    ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1, MODAL_STEP_2];

export { MODAL_STEPS };
export type { DepositSafeCollateralCtx };
