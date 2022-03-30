import { BigNumber } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { ModalProps, Text } from "rari-components";

type ClaimInterestCtx = {
  incrementStepIndex(): void;
  claiming: boolean;
  onClickClaimInterest(): void;
  onClose(): void;
};

type ModalStep = Omit<
  ModalProps<ClaimInterestCtx>,
  "ctx" | "isOpen" | "onClose"
>;

const MODAL_STEP_1: ModalStep = {
  title: "Claim Interest",
  subtitle: "Step 1",
  children: <Text>You've earned $100 in interest.</Text>,
  buttons: ({
    claiming,
    onClickClaimInterest,
    incrementStepIndex,
    onClose,
  }) => [
    {
      children: claiming ? "Claiming..." : "Claim Interest",
      variant: "neutral",
      loading: claiming,
      async onClick() {
        await onClickClaimInterest();
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1];

export { MODAL_STEPS };
export type { ClaimInterestCtx };
