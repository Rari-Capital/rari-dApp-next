import { VStack } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import StatisticTable from "lib/components/StatisticsTable";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { ModalProps, Text, TokenAmountInput } from "rari-components";
import { abbreviateAmount } from "utils/bigUtils";

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
  children: ({ setWithdrawalAmount, withdrawalAmount, onClickMax, safe, updatedSafe, maxAmount }) =>
    !!safe && (
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
        <StatisticTable
          statistics={[
            {
              title: "Collateral deposited",
              primaryValue: abbreviateAmount(safe?.collateralValueUSD),
              secondaryValue: abbreviateAmount(updatedSafe?.collateralValueUSD),
              titleTooltip: "How much collateral you have deposited.",
              primaryTooltip: `$ ${safe.collateralValueUSD}`,
              secondaryTooltip: `$ ${updatedSafe?.collateralValueUSD}`
            },
            {
              title: "Max Boost",
              primaryValue: abbreviateAmount(safe?.collateralValueUSD),
              secondaryValue: abbreviateAmount(updatedSafe?.collateralValueUSD),
              titleTooltip: "The maximum amount you can boost. This is collateralValueUSD * collateralFactor ",
              primaryTooltip: `$ ${safe.collateralValueUSD}`,
              secondaryTooltip: `$ ${updatedSafe?.collateralValueUSD}`
            },
            {
              title: "Safe Utilization",
              primaryValue: parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) + "%" ?? "?",
              secondaryValue: parseFloat(updatedSafe?.safeUtilization.toString() ?? "0").toFixed(2) + "%" ?? "?",
              titleTooltip: "The health of your safe. ",
              primaryTooltip: ""

            },
          ]}
          isLoading={!updatedSafe}
        />
      </>
    ),
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
