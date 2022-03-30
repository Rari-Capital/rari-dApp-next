import { BigNumber } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { ModalProps, TokenAmountInput } from "rari-components";

type WithdrawSafeCollateralCtx = {
  incrementStepIndex(): void;
  safe?: SafeInfo;
  withdrawalAmount: string;
  setWithdrawalAmount(newWithdrawalAmount: string): void;
  withdrawing: boolean;
  onClickWithdraw(): void;
  onClose(): void;
};

type ModalStep = Omit<
  ModalProps<WithdrawSafeCollateralCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Withdraw Collateral",
  subtitle: "Lorem Ipsum is simply dummy text",
  children: ({ setWithdrawalAmount, safe, withdrawalAmount }) =>
    !!safe && (
      <>
        <TokenAmountInput
          value={withdrawalAmount}
          onChange={setWithdrawalAmount}
          tokenAddress={safe.collateralAsset}
        />
      </>
    ),
  buttons: ({ withdrawing, onClickWithdraw, incrementStepIndex, onClose }) => [
    {
      children: withdrawing ? "Withdrawing..." : "Withdraw",
      variant: "neutral",
      loading: withdrawing,
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
