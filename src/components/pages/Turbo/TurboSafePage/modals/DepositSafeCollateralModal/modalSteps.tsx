import { Spinner } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import {
  ModalProps,
  Text,
  TokenAmountInput,
  TokenSymbol,
} from "rari-components";
import { shortUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import StatisticTable from "lib/components/StatisticsTable";

type DepositSafeCollateralCtx = {
  incrementStepIndex(): void;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  hasApproval: boolean;
  approving: boolean;
  onClickApprove(): void;
  depositAmount: string;
  setDepositAmount(newDepositAmount: string): void;
  depositing: boolean;
  collateralBalance: BigNumber;
  onClickDeposit(): void;
  onClose(): void;
};

type ModalStep = Omit<
  ModalProps<DepositSafeCollateralCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Deposit Collateral",
  subtitle: "Lorem Ipsum is simply dummy text",
  children: ({ setDepositAmount, safe, updatedSafe, collateralBalance, depositAmount }) =>
    !!safe && (
      <>
        <TokenAmountInput
          value={depositAmount}
          onChange={(amount: string) => setDepositAmount(amount ?? '0')}
          tokenAddress={safe.collateralAsset}
        />
        <Text variant="secondary" mt="4">
          You have {formatEther(collateralBalance)}{" "}
          <TokenSymbol tokenAddress={safe.collateralAsset} />
        </Text>
        <StatisticTable
          statistics={[
            {
              title: "Collateral deposited",
              primaryValue: shortUsdFormatter(safe?.collateralUSD),
              secondaryValue: shortUsdFormatter(updatedSafe?.collateralUSD),
              titleTooltip: "How much collateral you have deposited.",
              primaryTooltip: ""
            },
            {
              title: "Boost Balance",
              primaryValue: shortUsdFormatter(safe?.boostedUSD),
              secondaryValue: shortUsdFormatter(updatedSafe?.boostedUSD),
              titleTooltip: "The maximum amount you can boost.",
              primaryTooltip: ""
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
  buttons: ({
    approving,
    depositing,
    hasApproval,
    onClickApprove,
    onClickDeposit,
    incrementStepIndex,
    onClose,
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
        async onClick() {
          if (!hasApproval) {
            await onClickApprove();
          } else {
            await onClickDeposit();
            onClose();
          }
        },
      },
    ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1];

export { MODAL_STEPS };
export type { DepositSafeCollateralCtx };
