import { useRari } from "context/RariContext";
import { parseEther } from "ethers/lib/utils";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE } from "lib/turbo/utils/constants";
import { Modal } from "rari-components/standalone";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { CreateSafeCtx, MODAL_STEPS } from "./modalSteps";

type CreateSafeModalProps = Pick<
  React.ComponentProps<typeof Modal>,
  "isOpen" | "onClose"
>;

export const CreateSafeModal: React.FC<CreateSafeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { address, provider, chainId } = useRari();

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }
  function decrementStepIndex() {
    if (stepIndex !== 0) {
      setStepIndex(stepIndex - 1);
    }
  }

  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(TRIBE);
  const [depositAmount, setDepositAmount] = useState<string>();

  const [creating, setCreating] = useState(false);

  // Utils
  const toast = useToast();

  const onClickCreateSafe = async () => {
    if (!address || !provider || !chainId) return;

    const amountBN = parseEther(depositAmount ?? "0");

    if (!amountBN.isZero()) {
      try {
        setCreating(true);
        const receipt = await createSafeAndDeposit(
          provider.getSigner(),
          amountBN,
          chainId
        );
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreating(false);
      }
    } else {
      try {
        setCreating(true);
        const receipt = await createSafe(
          underlyingTokenAddress,
          provider,
          chainId
        );
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreating(false);
      }
    }
  };

  const createSafeCtx: CreateSafeCtx = {
    provider,
    chainId: chainId ?? 1,
    incrementStepIndex,
    decrementStepIndex,
    // TODO(sharad-s): Don't hardcode this
    underlyingTokenAddresses: [
      // TRIBE
      "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
      // DAI
      "0x6b175474e89094c44da98b954eedeac495271d0f",
    ],
    underlyingTokenAddress,
    setUnderlyingTokenAddress,
    depositAmount,
    setDepositAmount,
    createSafe,
    onClose: () => {
      setStepIndex(0);
      onClose();
    },
  };

  const { title, subtitle, buttons, onClickButton, children } =
    MODAL_STEPS[stepIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStepIndex(0);
        onClose();
      }}
      title={title}
      subtitle={subtitle}
      buttons={buttons(createSafeCtx)}
      onClickButton={(buttonIndex) => {
        if (onClickButton) {
          onClickButton(buttonIndex, createSafeCtx);
        }
      }}
      progressValue={((stepIndex + 1) / MODAL_STEPS.length) * 100}
    >
      {children(createSafeCtx)}
    </Modal>
  );
};

export default CreateSafeModal;
