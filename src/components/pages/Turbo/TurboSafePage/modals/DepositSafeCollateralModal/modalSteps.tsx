import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import {
  Heading,
  ModalProps,
  Text,
  TokenAmountInput,
  TokenSymbol,
} from "rari-components";
import { Box, Stack, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import UpdatingStatisticsTable from "../../UpdatingStatisticsTable";
import { getSafeColor } from "context/TurboSafeContext";

type DepositSafeCollateralCtx = {
  incrementStepIndex(): void;
  resetStepIndex(): void;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  hasApproval: boolean;
  approving: boolean;
  depositAmount: string;
  setDepositAmount(newDepositAmount: string): void;
  depositing: boolean;
  collateralBalance: BigNumber;
  onClickMax(): Promise<void>;
  onClose(): void;
  inputError: string | undefined;
  handleApproveAndDeposit(): Promise<void>;
};

type ModalStep = Omit<
  ModalProps<DepositSafeCollateralCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Deposit Collateral",
  subtitle: "Collateralizing is required before boosting pools.",
  children: ({
    onClickMax,
    setDepositAmount,
    safe,
    updatedSafe,
    collateralBalance,
    depositAmount,
  }) => {
    if (!safe) {
      return null;
    }

    const safeUtilizationValue = (colorScheme: string) =>
      depositAmount === "" || parseInt(depositAmount) == 0 ? (
        parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%"
      ) : (
        <Text fontWeight={600}>
          {parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%"}{" "}
          <Box as="span" color={colorScheme}>
            →{" "}
            <Box as="span">
              {parseFloat(
                updatedSafe?.safeUtilization.toString() ?? "0"
              ).toFixed(2) + "%"}
            </Box>
          </Box>
        </Text>
      );

    return (
      <>
        <VStack w="100%" mb={3} align="flex-end">
          <TokenAmountInput
            value={depositAmount}
            onChange={(amount: string) => setDepositAmount(amount ?? "0")}
            tokenAddress={safe.collateralAsset}
            onClickMax={onClickMax}
          />
          <Text variant="secondary" mt="4" _hover={{ cursor: "default" }}>
            Balance: {commify(formatEther(collateralBalance))}{" "}
            <TokenSymbol tokenAddress={safe.collateralAsset} />
          </Text>
        </VStack>
        <UpdatingStatisticsTable
          colorScheme={getSafeColor(updatedSafe?.safeUtilization)}
          statistics={[
            {
              title: "Collateral",
              tooltip: "How much collateral you have deposited.",
              initialValue: safe?.collateralValueUSD,
              newValue:
                depositAmount === "" || parseInt(depositAmount) == 0
                  ? undefined
                  : updatedSafe?.collateralValueUSD,
            },
            {
              title: "Max Boost",
              tooltip:
                "The maximum amount you can boost. This is collateralValueUSD * collateralFactor ",
              initialValue: safe?.maxBoostUSD,
              newValue:
                depositAmount === "" || parseInt(depositAmount) == 0
                  ? undefined
                  : updatedSafe?.maxBoostUSD,
            },
            [
              "Safe Utilization",
              safeUtilizationValue(getSafeColor(updatedSafe?.safeUtilization)),
              "The health of your safe.",
            ],
          ]}
        />
      </>
    );
  },
  buttons: ({
    approving,
    depositing,
    hasApproval,
    depositAmount,
    inputError,
    handleApproveAndDeposit,
  }) => [
    {
      children: !!inputError
        ? inputError
        : approving
        ? "Approving..."
        : depositing
        ? "Depositing..."
        : !hasApproval
        ? "Approve Safe"
        : "Deposit",
      variant: "neutral",
      loading: approving || depositing,
      disabled:
        approving ||
        depositing ||
        !depositAmount ||
        parseFloat(depositAmount) == 0 ||
        !!inputError,
      async onClick() {
        await handleApproveAndDeposit();
      },
    },
  ],
};

const MODAL_STEP_2: ModalStep = {
  children: ({ depositAmount, updatedSafe }) => (
    <Stack alignItems="center" spacing={8}>
      <CheckCircleIcon boxSize={24} color="neutral" />
      <Box textAlign="center">
        <Heading>
          {commify(depositAmount)}{" "}
          {updatedSafe ? (
            <TokenSymbol tokenAddress={updatedSafe.collateralAsset} />
          ) : null}
        </Heading>
        <Text fontSize="lg" my={4}>
          Successfully deposited
        </Text>
      </Box>
    </Stack>
  ),
  buttons: ({ onClose, resetStepIndex }) => [
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
export type { DepositSafeCollateralCtx };
