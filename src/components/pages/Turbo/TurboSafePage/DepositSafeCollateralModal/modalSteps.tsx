import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import {
  ModalProps,
  Text,
  TokenAmountInput,
  TokenSymbol,
} from "rari-components";

type DepositSafeCollateralCtx = {
  incrementStepIndex(): void;
  safe?: SafeInfo;
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
  children: ({ setDepositAmount, safe, collateralBalance, depositAmount }) =>
    !!safe && (
      <>
        <TokenAmountInput
          value={depositAmount}
          onChange={setDepositAmount}
          tokenAddress={safe.collateralAsset}
        />
        <Text variant="secondary" mt="4">
          You have {formatEther(collateralBalance)}{" "}
          <TokenSymbol tokenAddress={safe.collateralAsset} />
        </Text>
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
