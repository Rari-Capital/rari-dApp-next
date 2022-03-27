import { useRari } from "context/RariContext";
import { parseEther } from "ethers/lib/utils";
import useHasApproval from "hooks/useHasApproval";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { TRIBE, TurboAddresses } from "lib/turbo/utils/constants";
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

  // TODO(sharad-s): Don't hardcode this
  const underlyingTokenAddresses = [
    // TRIBE
    "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
    // DAI
    "0x6b175474e89094c44da98b954eedeac495271d0f",
  ];

  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(TRIBE);
  const [depositAmount, setDepositAmount] = useState<string>();
  // const hasApproval = useHasApproval(
  //   underlyingTokenAddress,
  //   TurboAddresses[chainId ?? 31337].ROUTER
  // );
  // TODO(nathanhleung): replace with real implementation later
  const [hasApproval, setHasApproval] = useState(false);
  const [approving, setApproving] = useState(false);
  const [creatingSafe, setCreatingSafe] = useState(false);

  // Utils
  const toast = useToast();

  const onClickCreateSafe = async () => {
    if (!address || !provider || !chainId) return;

    setCreatingSafe(true);

    // Pause for 3 seconds to simulate creation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCreatingSafe(false);

    return null;

    // TODO(nathanhleung): enable actual safe creation
    // const amountBN = parseEther(depositAmount ?? "0");

    // let receipt;
    // if (!amountBN.isZero()) {
    //   try {
    //     receipt = await createSafeAndDeposit(
    //       provider.getSigner(),
    //       amountBN,
    //       chainId
    //     );
    //     console.log({ receipt });
    //   } catch (err) {
    //     handleGenericError(err, toast);
    //     console.log({ err });
    //   } finally {
    //     // setCreatingSafe(false);
    //   }
    // } else {
    //   try {
    //     receipt = await createSafe(underlyingTokenAddress, provider, chainId);
    //     console.log({ receipt });
    //   } catch (err) {
    //     handleGenericError(err, toast);
    //     console.log({ err });
    //   } finally {
    //     setCreatingSafe(false);
    //   }
    // }

    // return receipt;
  };

  const createSafeCtx: CreateSafeCtx = {
    provider,
    chainId: chainId ?? 1,
    incrementStepIndex,
    decrementStepIndex,
    underlyingTokenAddresses,
    underlyingTokenAddress,
    setUnderlyingTokenAddress,
    depositAmount,
    setDepositAmount,
    hasApproval,
    approving,
    approve: async () => {
      setApproving(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setHasApproval(true);
      setApproving(false);
    },
    createSafe: onClickCreateSafe,
    creatingSafe,
    onClose: () => {
      // Only allow close if a transaction isn't in progress.
      if (!approving && !creatingSafe) {
        setStepIndex(0);
        onClose();
      }
    },
  };

  const { title, subtitle, buttons, onClickButton, stepBubbles, children } =
    MODAL_STEPS[stepIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!approving && !creatingSafe) {
          setStepIndex(0);
          onClose();
        }
      }}
      title={title}
      subtitle={subtitle}
      buttons={buttons(createSafeCtx)}
      onClickButton={(buttonIndex) => {
        if (!!onClickButton) {
          onClickButton(buttonIndex, createSafeCtx);
        }
      }}
      progressValue={((stepIndex + 1) / MODAL_STEPS.length) * 100}
      stepBubbles={!!stepBubbles ? stepBubbles(createSafeCtx) : undefined}
    >
      {children(createSafeCtx)}
    </Modal>
  );
};

export default CreateSafeModal;
