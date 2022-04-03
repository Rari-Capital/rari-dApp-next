// Hooks
import { useRari } from "context/RariContext";
// Utils
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
// Turbo
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeDeposit } from "lib/turbo/transactions/safe";
import { checkAllowanceAndApprove } from "utils/erc20Utils";

// import useHasApproval from "hooks/useHasApproval";
import { SafeInteractionMode, useUpdatedSafeInfo } from "hooks/turbo/useUpdatedSafeInfo";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount";

// Todo - reuse Modal Prop Types
type DepositSafeCollateralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: USDPricedTurboSafe | undefined;
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
  function resetStepIndex() {
    setStepIndex(0)
  }


  const [depositAmount, setDepositAmount] = useState<string>("0");
  const [depositing, setDepositing] = useState(false);

  const collateralBalance = useBalanceOf(address, safe?.collateralAsset);
  const [approving, setApproving] = useState(false);

  // TODO(sharad-s): Debug approval function
  // const hasApproval = useHasApproval(safe?.collateralAsset, safe?.safeAddress)
  const [hasApproval, setHasApproval] = useState(true);

  const updatedSafe = useUpdatedSafeInfo(
    {
      mode: SafeInteractionMode.DEPOSIT,
      safe,
      amount: parseUnits(!!depositAmount ? depositAmount : "0", 18)
    }
  )

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

  const onClickDeposit = async () => {
    if (!depositAmount || !safe) return;
    const depositAmountBN = parseEther(depositAmount);
    const { safeAddress, collateralAsset } = safe;

    try {
      setDepositing(true);
      const tx = await safeDeposit(
        safeAddress,
        address,
        depositAmountBN,
        provider.getSigner()
      );
      console.log({ tx });
      await tx.wait(1)
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setDepositing(false);
    }
  };

  const onClickMax = async () => {
    try {
      const maxAmount = await fetchMaxSafeAmount(
        provider,
        SafeInteractionMode.DEPOSIT,
        address,
        safe
      )
      setDepositAmount(formatEther(maxAmount))
    } catch (err) {
      handleGenericError(err, toast)
    }
  }

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        resetStepIndex,
        safe,
        updatedSafe,
        depositAmount,
        setDepositAmount,
        onClickDeposit,
        depositing,
        collateralBalance,
        hasApproval,
        approving,
        onClickApprove: approve,
        onClickMax,
        onClose,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default DepositSafeCollateralModal;
