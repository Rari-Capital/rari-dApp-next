// Hooks
import { useRari } from "context/RariContext";
// Turbo
import { Modal } from "rari-components";
import { useMemo, useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount";
import { SafeInteractionMode, useUpdatedSafeInfo } from "hooks/turbo/useUpdatedSafeInfo";
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { constants } from "ethers";
import useSafeMaxAmount from "hooks/turbo/useSafeMaxAmount";
import { safeWithdraw } from "lib/turbo/transactions/safe";

// Todo - reuse Modal Prop Types
type WithdrawSafeCollateralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: USDPricedTurboSafe | undefined;
};

export const WithdrawSafeCollateralModal: React.FC<
  WithdrawSafeCollateralModalProps
> = ({ isOpen, onClose, safe }) => {
  const { address, provider, chainId } = useRari();
  const toast = useToast();

  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("10");
  const [withdrawing, setWithdrawing] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  const updatedSafe = useUpdatedSafeInfo(
    {
      mode: SafeInteractionMode.WITHDRAW,
      safe,
      amount: parseUnits(!!withdrawalAmount ? withdrawalAmount : "0", 18)
    }
  )

  const maxAmount = useSafeMaxAmount(safe, SafeInteractionMode.WITHDRAW)

  const onClickWithdraw = async () => {
    if (!safe) return
    try {
      setWithdrawing(true);
      const tx = await safeWithdraw(safe.safeAddress, address, parseEther(withdrawalAmount), await provider.getSigner())
      await tx.wait(1)
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setWithdrawing(false);
    }
  };

  const onClickMax = async () => {
    try {
      const maxAmount = await fetchMaxSafeAmount(
        provider,
        SafeInteractionMode.WITHDRAW,
        address,
        safe,
        chainId ?? 1
      )
      setWithdrawalAmount(formatEther(maxAmount ?? 0))
    } catch (err) {
      handleGenericError(err, toast)
    }
  }

  // Form validation
  const inputError: string | undefined = useMemo(() => {
    const amount = withdrawalAmount ? withdrawalAmount : '0'
    if (parseUnits(amount, 18).gt(maxAmount)) {
      return "Cannot withdraw this much!"
    }
    if (updatedSafe && updatedSafe.collateralAmount.lt(0)) {
      return "Cannot withdraw this much!"
    }
  }, [maxAmount, updatedSafe, withdrawalAmount])


  return (
    <Modal
      ctx={{
        incrementStepIndex,
        withdrawalAmount,
        setWithdrawalAmount,
        onClickWithdraw,
        withdrawing,
        onClose,
        onClickMax,
        safe,
        updatedSafe,
        inputError,
        maxAmount
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default WithdrawSafeCollateralModal;
