// Hooks
import { useRari } from "context/RariContext";
// Utils
import { parseEther } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
// Turbo
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeDeposit } from "lib/turbo/transactions/safe";
import { checkAllowanceAndApprove } from "utils/erc20Utils";
import useHasApproval from "hooks/useHasApproval";

// Todo - reuse Modal Prop Types
type DepositSafeCollateralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: SafeInfo | undefined;
};

export const DepositSafeCollateralModal: React.FC<
  DepositSafeCollateralModalProps
> = ({ isOpen, onClose, safe }) => {
  const { address, provider, chainId } = useRari();
  const toast = useToast();

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  const [depositAmount, setDepositAmount] = useState<string>("10");
  const [depositing, setDepositing] = useState(false);

  const collateralBalance = useBalanceOf(address, safe?.collateralAsset);
  const [approving, setApproving] = useState(false);

  // TODO(sharad-s): Use real approval function
  const hasApproval = useHasApproval(safe?.collateralAsset, safe?.safeAddress)
  // const [hasApproval, setHasApproval] = useState(false);

  async function approve() {
    setApproving(true);
    const safeAddress = safe?.safeAddress
    if (!safeAddress) return
    try {
      setApproving(true)
      await checkAllowanceAndApprove(
        await provider.getSigner(),
        address,
        safeAddress,
        safe.collateralAsset
      );
      incrementStepIndex()
    } catch (err) {
      handleGenericError(err, toast)
    } finally {
      setApproving(false)
    }
  }

  // TODO(sharad-s) - move Approval step outside (check approval/permit and show as a step on UI if not)
  const onClickDeposit = async () => {
    if (!depositAmount || !safe) return;
    const depositAmountBN = parseEther(depositAmount);
    const { safeAddress, collateralAsset } = safe;

    try {
      setDepositing(true);
      // TODO(sharad-s): Use real implementation
      const tx = await safeDeposit(
        safeAddress,
        address,
        depositAmountBN,
        provider.getSigner()
      );
      console.log({ tx });
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setDepositing(false);
    }
  };



  return (
    <Modal
      ctx={{
        incrementStepIndex,
        safe,
        depositAmount,
        setDepositAmount,
        onClickDeposit,
        depositing,
        collateralBalance,
        hasApproval,
        approving,
        onClickApprove: approve,
        onClose,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default DepositSafeCollateralModal;
