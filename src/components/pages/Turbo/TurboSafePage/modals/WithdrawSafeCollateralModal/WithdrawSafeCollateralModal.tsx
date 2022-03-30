// Hooks
import { useRari } from "context/RariContext";
// Turbo
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";

// Todo - reuse Modal Prop Types
type WithdrawSafeCollateralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: SafeInfo | undefined;
};

export const WithdrawSafeCollateralModal: React.FC<
  WithdrawSafeCollateralModalProps
> = ({ isOpen, onClose, safe }) => {
  const { address } = useRari();
  const toast = useToast();

  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("10");
  const [withdrawing, setWithdrawing] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  // TODO(sharad-s) - create real withdraw function
  const onClickWithdraw = async () => {
    try {
      setWithdrawing(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        safe,
        withdrawalAmount,
        setWithdrawalAmount,
        onClickWithdraw,
        withdrawing,
        onClose,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default WithdrawSafeCollateralModal;
