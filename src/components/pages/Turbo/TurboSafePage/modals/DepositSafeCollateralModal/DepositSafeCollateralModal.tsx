// Hooks
import { useRari } from "context/RariContext";
// Utils
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
// Turbo
import { Modal } from "rari-components";
import { useMemo, useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeDeposit } from "lib/turbo/transactions/safe";
import { checkAllowanceAndApprove } from "utils/erc20Utils";

// import useHasApproval from "hooks/useHasApproval";
import {
  SafeInteractionMode,
  useUpdatedSafeInfo,
} from "hooks/turbo/useUpdatedSafeInfo";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount";
import { MAX_APPROVAL_AMOUNT } from "utils/tokenUtils";
import useHasApproval from "hooks/useHasApproval";
import { useQueryClient } from "react-query";
import useSafeMaxAmount from "hooks/turbo/useSafeMaxAmount";
import { constants } from "ethers";
import { useTurboSafe } from "context/TurboSafeContext";

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
  const { collateralTokenData } = useTurboSafe();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }
  function resetStepIndex() {
    setStepIndex(0);
  }

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositing, setDepositing] = useState(false);

  const collateralBalance = useBalanceOf(address, safe?.collateralAsset);
  const [approving, setApproving] = useState(false);

  const hasApproval = useHasApproval(
    safe?.collateralAsset,
    safe?.safeAddress,
    depositAmount
  );

  const updatedSafe = useUpdatedSafeInfo({
    mode: SafeInteractionMode.DEPOSIT,
    safe,
    amount: parseUnits(!!depositAmount ? depositAmount : "0", 18),
  });

  const handleApproveAndDeposit = async () => {
    if (!hasApproval) {
      await approve();
    }
    await onClickDeposit();
  };

  const approve = async () => {
    setApproving(true);
    const safeAddress = safe?.safeAddress;
    if (!safeAddress) return;
    try {
      setApproving(true);
      const tx = await checkAllowanceAndApprove(
        provider.getSigner(),
        address,
        safeAddress,
        safe.collateralAsset,
        MAX_APPROVAL_AMOUNT
      );
      await tx.wait(1);
    } catch (err) {
      throw err;
    } finally {
      setApproving(false);
    }
  };

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
      await tx.wait(1);
      incrementStepIndex();
    } catch (err) {
      throw err;
    } finally {
      setDepositing(false);
      await queryClient.refetchQueries();
    }
  };

  const maxAmount = useSafeMaxAmount(safe, SafeInteractionMode.DEPOSIT);

  const onClickMax = async () => {
    try {
      setDepositAmount(formatEther(maxAmount));
    } catch (err) {
      handleGenericError(err, toast);
    }
  };

  // Form validation
  const inputError: string | undefined = useMemo(() => {
    const _amount = !!depositAmount ? depositAmount : "0";
    const _amountBN = parseUnits(_amount, collateralTokenData?.decimals ?? 18);
    //
    if (_amountBN.gt(maxAmount)) {
      return "Can't deposit this much!";
    }
  }, [depositAmount, maxAmount]);

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        resetStepIndex,
        safe,
        updatedSafe,
        depositAmount,
        setDepositAmount,
        depositing,
        collateralBalance,
        hasApproval,
        approving,
        onClickMax,
        onClose,
        inputError,
        handleApproveAndDeposit,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default DepositSafeCollateralModal;
