// Hooks
import { useRari } from "context/RariContext";
// Utils
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
import useSafeMaxAmount from "hooks/turbo/useSafeMaxAmount";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import {
  SafeInteractionMode,
  useUpdatedSafeInfo,
} from "hooks/turbo/useUpdatedSafeInfo";
import {
  USDPricedStrategy,
  USDPricedTurboSafe,
} from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { safeBoost, safeLess } from "lib/turbo/transactions/safe";
// Turbo
import { Modal } from "rari-components";
import { useMemo, useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { useQueryClient } from "react-query";

type BoostStrategyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: USDPricedTurboSafe | undefined;
  strategy: USDPricedStrategy | undefined;
  erc4626Strategy: FuseERC4626Strategy | undefined;
  strategyIndex: number;
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS;
};

export const BoostStrategyModal: React.FC<BoostStrategyModalProps> = ({
  isOpen,
  onClose,
  safe,
  strategy,
  erc4626Strategy,
  strategyIndex,
  mode,
}) => {
  const { provider, chainId, address } = useRari();
  const toast = useToast();
  const queryClient = useQueryClient()

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }
  function resetStepIndex() {
    setStepIndex(0);
  }

  const [amount, setAmount] = useState<string>("0");
  const [transacting, setTransacting] = useState(false);

  const updatedSafe = useUpdatedSafeInfo({
    mode,
    safe,
    amount: parseUnits(!!amount ? amount : "0", 18),
    strategyIndex,
  });

  const maxAmount = useSafeMaxAmount(safe, mode, strategyIndex);

  // Form validation
  const inputError: string | undefined = useMemo(() => {
    const _amount = amount ? amount : "0";

    switch (mode) {
      case SafeInteractionMode.BOOST:
        if (parseEther(_amount).gt(maxAmount)) {
          return "You can't boost this much!";
        }
        break;
      case SafeInteractionMode.LESS:
        if (parseEther(_amount).gt(maxAmount)) {
          return "You can't less this much!";
        }
        break;
      default:
        return undefined;
    }
  }, [amount, maxAmount, strategy, mode, updatedSafe]);

  // Boost a strategy
  const onClickBoost = async () => {
    if (!safe?.safeAddress || !provider || !amount) return;
    const amountBN = parseEther(amount);
    const strategyAddress = strategy!.strategy;

    try {
      setTransacting(true);
      const tx = await safeBoost(
        safe.safeAddress,
        strategyAddress,
        amountBN,
        //@ts-ignore
        await provider.getSigner()
      );
      await tx.wait(1);
      incrementStepIndex();
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setTransacting(false);
      await queryClient.refetchQueries();
    }
  };

  // Less a strategy
  const onClickLess = async () => {
    if (!safe?.safeAddress || !provider || !amount || !strategy) return;

    let amountBN = parseEther(amount);
    amountBN = amountBN.gte(strategy.boostedAmount)
      ? strategy.boostedAmount
      : amountBN;

    const lessingMax = strategy.boostedAmount.eq(amountBN);

    try {
      setTransacting(true);
      const tx = await safeLess(
        safe.safeAddress,
        strategy.strategy,
        amountBN,
        lessingMax,
        await provider.getSigner(),
        chainId ?? 1
      );
      await tx.wait(1);
      incrementStepIndex();
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setTransacting(false);
      await queryClient.refetchQueries();
    }
  };

  const onClickMax = () => setAmount(formatEther(maxAmount));

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        onClickBoost,
        onClickLess,
        onClickMax,
        onClose,
        setAmount,
        resetStepIndex,
        amount,
        safe,
        updatedSafe,
        transacting,
        mode,
        maxAmount,
        strategy,
        erc4626Strategy,
        inputError,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default BoostStrategyModal;
