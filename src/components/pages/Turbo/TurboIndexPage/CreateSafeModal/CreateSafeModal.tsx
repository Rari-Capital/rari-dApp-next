import { useRari } from "context/RariContext";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
import useHasApproval from "hooks/useHasApproval";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE, TurboAddresses } from "lib/turbo/utils/constants";
import { useRouter } from "next/router";
import { Modal } from "rari-components";
import { useState } from "react";
import { approve } from "utils/erc20Utils";
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
  // Rari and NextJs
  const router = useRouter();
  const { address, provider, chainId } = useRari();
  const toast = useToast();

  // Modal State
  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }
  // Modal Buttons
  const [approving, setApproving] = useState(false);
  const [creatingSafe, setCreatingSafe] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Safe's chosen underlying asset
  const underlyingTokenAddresses = [TRIBE];
  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(TRIBE);
  const collateralBalance = useBalanceOf(address, underlyingTokenAddress);

  // Used only if user will deposit after creating.
  const [depositAmount, setDepositAmount] = useState<string>("");

  // Router State
  const hasApproval = useHasApproval(
    underlyingTokenAddress,
    TurboAddresses[chainId ?? 1].ROUTER,
    depositAmount,
    address
  );

  // Modal Logic
  const onClickCreateSafe = async () => {
    if (!address || !provider || !chainId) return;

    setCreatingSafe(true);

    const amountBN = parseEther(depositAmount === "" ? "0" : depositAmount);

    let receipt;
    if (!amountBN.isZero()) {
      try {
        receipt = await createSafeAndDeposit(
          provider.getSigner(),
          amountBN,
          chainId,
          underlyingTokenAddress
        );
        incrementStepIndex();
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreatingSafe(false);
      }
    } else {
      try {
        receipt = await createSafe(underlyingTokenAddress, provider, chainId);
        incrementStepIndex();
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreatingSafe(false);
      }
    }

    return receipt;
  };

  async function onClickApprove() {
    if (!depositAmount || !chainId) return;

    setApproving(true);
    const amountBN = parseEther(depositAmount ?? "0");

    try {
      await approve(
        provider.getSigner(),
        TurboAddresses[chainId].ROUTER,
        underlyingTokenAddress,
        amountBN
      );
      incrementStepIndex();
    } finally {
      setApproving(false);
    }
  }

  const balance = formatEther(collateralBalance);

  const onClickMax = async () => {
    if (!chainId) return;
    try {
      setDepositAmount(balance.slice(0, balance.indexOf(".")));
    } catch (err) {
      handleGenericError(err, toast);
    }
  };

  // Modal Context
  const createSafeCtx: CreateSafeCtx = {
    provider,
    chainId: chainId ?? 1,
    incrementStepIndex,
    underlyingTokenAddresses,
    underlyingTokenAddress,
    setUnderlyingTokenAddress,
    depositAmount,
    setDepositAmount,
    hasApproval,
    approving,
    onClickApprove,
    onClickCreateSafe,
    creatingSafe,
    navigating,
    collateralBalance: balance,
    onClickMax,
    onClose() {
      // Only allow close if a transaction isn't in progress.
      if (!approving && !creatingSafe) {
        setStepIndex(0);
        onClose();
      }
    },
    async navigateToCreatedSafe() {
      setNavigating(true);
      try {
        await router.push("/turbo/safe/0");
      } finally {
        setNavigating(false);
      }
    },
  };

  return (
    <Modal
      ctx={createSafeCtx}
      isOpen={isOpen}
      onClose={() => {
        if (!approving && !creatingSafe) {
          setStepIndex(0);
          onClose();
        }
      }}
      progressValue={((stepIndex + 1) / MODAL_STEPS.length) * 100}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default CreateSafeModal;
