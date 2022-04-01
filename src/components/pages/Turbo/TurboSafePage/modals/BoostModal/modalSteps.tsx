import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import {
  ModalProps,
  TokenAmountInput,
} from "rari-components";
import { abbreviateAmount } from "utils/bigUtils";
import StatisticTable from "lib/components/StatisticsTable";
import { FEI } from "lib/turbo/utils/constants";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";

type BoostModalCtx = {
  incrementStepIndex(): void;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  amount: string;
  setAmount(newAmount: string): void;
  transacting: boolean;
  onClickBoost(): void;
  onClickLess(): void;
  onClose(): void;
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS;
  strategy: USDPricedStrategy | undefined,
  erc4626Strategy: FuseERC4626Strategy | undefined
};

type ModalStep = Omit<
  ModalProps<BoostModalCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: ({ mode }) => `${mode} strategy`,
  subtitle: ({ strategy }) => `${strategy?.strategy}`,
  children: ({ amount, setAmount, safe, updatedSafe }) =>
    !!safe && (
      <>
        <TokenAmountInput
          value={amount}
          onChange={(amount: string) => setAmount(amount ?? '0')}
          tokenAddress={FEI}
        />
        {/* <Text variant="secondary" mt="4">
          You have {formatEther(collateralBalance)}{" "}
          <TokenSymbol tokenAddress={safe.collateralAsset} />
        </Text> */}
        <StatisticTable
          statistics={[
            {
              title: "Boost Balance",
              primaryValue: abbreviateAmount(safe?.boostedUSD),
              secondaryValue: abbreviateAmount(updatedSafe?.boostedUSD),
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
    onClickBoost,
    onClickLess,
    transacting,
    incrementStepIndex,
    onClose,
    mode
  }) => [
      {
        children: mode,
        // children: approving
        //   ? "Approving..."
        //   : depositing
        //     ? "Boosting..."
        //     : !hasApproval
        //       ? "Approve Router"
        //       : "Deposit",
        variant: "neutral",
        loading: transacting,
        async onClick() { mode === "Boost" ? onClickBoost() : onClickLess() }
      },
    ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1];

export { MODAL_STEPS };
export type { BoostModalCtx };
