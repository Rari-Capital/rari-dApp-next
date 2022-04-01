// Hooks
import { useRari } from "context/RariContext";
// Utils
import { parseEther, parseUnits } from "ethers/lib/utils";

// Turbo
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeBoost, safeLess } from "lib/turbo/transactions/safe";
import { SafeInteractionMode, useUpdatedSafeInfo } from "hooks/turbo/useUpdatedSafeInfo";
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";

type BoostStrategyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: USDPricedTurboSafe | undefined;
  strategy: USDPricedStrategy | undefined;
  erc4626Strategy: FuseERC4626Strategy | undefined;
  strategyIndex: number;
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS
};

export const BoostStrategyModal: React.FC<
  BoostStrategyModalProps
> = ({
  isOpen,
  onClose,
  safe,
  strategy,
  erc4626Strategy,
  strategyIndex,
  mode
}) => {
    const { provider, chainId } = useRari();
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

    const [amount, setAmount] = useState<string>("0");
    const [transacting, setTransacting] = useState(false);

    const updatedSafe = useUpdatedSafeInfo(
      {
        mode,
        safe,
        amount: parseUnits(!!amount ? amount : "0", 18),
        strategyIndex
      }
    )

    // Boost a strategy with hardcoded amount
    const onClickBoost = async () => {
      if (!safe?.safeAddress || !provider || !amount) return;
      const amountBN = parseEther(amount);
      const strategyAddress = strategy!.strategy

      try {
        setTransacting(true);
        const tx = await safeBoost(
          safe.safeAddress,
          strategyAddress,
          amountBN,
          //@ts-ignore
          await provider.getSigner()
        );
        await tx.wait(1)
      } catch (err) {
        handleGenericError(err, toast);
      } finally {
        setTransacting(false);
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
      if (lessingMax) {
        alert("You slurpin too baby");
      }

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
        await tx.wait(1)
      } catch (err) {
        handleGenericError(err, toast);
      } finally {
        setTransacting(false);
      }
    };



    return (
      <Modal
        ctx={{
          incrementStepIndex,
          resetStepIndex,
          safe,
          updatedSafe,
          amount,
          setAmount,
          onClickBoost,
          onClickLess,
          transacting,
          mode,
          onClose,
          strategy,
          erc4626Strategy
        }}
        isOpen={isOpen}
        onClose={onClose}
        {...MODAL_STEPS[stepIndex]}
      />
    );
  };

export default BoostStrategyModal;
