import { Box, VStack } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { ModalProps, Text, TokenAmountInput } from "rari-components";
import UpdatingStatisticsTable from "../../UpdatingStatisticsTable";

type WithdrawSafeCollateralCtx = {
  incrementStepIndex(): void;
  withdrawalAmount: string;
  setWithdrawalAmount(newWithdrawalAmount: string): void;
  withdrawing: boolean;
  onClickWithdraw(): Promise<void>;
  onClose(): void;
  onClickMax(): Promise<void>
  maxAmount: BigNumber;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  inputError?: string | undefined
};

type ModalStep = Omit<
  ModalProps<WithdrawSafeCollateralCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Withdraw Collateral",
  subtitle: "Withdraw collateral from this safe.",
  children: ({ setWithdrawalAmount, withdrawalAmount, onClickMax, safe, updatedSafe, maxAmount }) => {
    if (!safe) {
      return null;
    }

    const safeUtilizationValue =
      withdrawalAmount === "" ? (
        parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%"
      ) : (
        <Text fontWeight={600}>
          {parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%"}{" "}
          →{" "}
          <Box as="span" color="neutral">
            {parseFloat(updatedSafe?.safeUtilization.toString() ?? "0").toFixed(
              2
            ) + "%"}
          </Box>
        </Text>
      );
    
    return (
      <>
        <VStack w="100%" mb={3} align="flex-end">
          <TokenAmountInput
            value={withdrawalAmount}
            onChange={(amount: string) => setWithdrawalAmount(amount || '0')}
            tokenAddress={safe.collateralAsset}
            onClickMax={onClickMax}
          />
          <Text variant="secondary" mt="4">
            You can withdraw {formatEther(maxAmount)}
          </Text>
        </VStack>
        <UpdatingStatisticsTable
          statistics={[
            {
              title: "Collateral",
              tooltip: "How much collateral you have deposited.",
              initialValue: safe?.collateralValueUSD,
              newValue:
                withdrawalAmount === ""
                  ? undefined
                  : updatedSafe?.collateralValueUSD,
            },
            {
              title: "Max Boost",
              tooltip:
                "The maximum amount you can boost. This is collateralValueUSD * collateralFactor ",
              initialValue: safe?.maxBoostUSD,
              newValue:
                withdrawalAmount === "" ? undefined : updatedSafe?.maxBoostUSD,
            },
            [
              "Safe Utilization",
              safeUtilizationValue,
              "The health of your safe.",
            ],
          ]}
        />
      </>
    );
  },
  buttons: ({ withdrawing, onClickWithdraw, incrementStepIndex, onClose, inputError }) => [
    {
      children: inputError ? inputError : withdrawing ? "Withdrawing..." : "Withdraw",
      variant: "neutral",
      loading: withdrawing,
      disabled: !!inputError || withdrawing,
      async onClick() {
        await onClickWithdraw();
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1];

export { MODAL_STEPS };
export type { WithdrawSafeCollateralCtx };
