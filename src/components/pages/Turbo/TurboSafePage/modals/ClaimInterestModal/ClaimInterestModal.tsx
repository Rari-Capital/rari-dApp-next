// Hooks
import { useRari } from "context/RariContext";
// Turbo
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";

// Todo - reuse Modal Prop Types
type ClaimInterestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: SafeInfo | undefined;
};

export const ClaimInterestModal: React.FC<ClaimInterestModalProps> = ({
  isOpen,
  onClose,
  safe,
}) => {
  const toast = useToast();

  const [claiming, setClaiming] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  // TODO(sharad-s) - create real claim function
  const onClickClaimInterest = async () => {
    try {
      setClaiming(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        claiming,
        onClickClaimInterest,
        onClose,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default ClaimInterestModal;
