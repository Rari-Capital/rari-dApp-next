// Hooks
import { useRari } from "context/RariContext";
// Utils
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";

// Turbo
import { Modal } from "rari-components";
import { useState, useMemo } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeBoost, safeLess } from "lib/turbo/transactions/safe";
import { SafeInteractionMode, useUpdatedSafeInfo } from "hooks/turbo/useUpdatedSafeInfo";
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount";
import useMaxBoost from "hooks/turbo/useMaxBoost";

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
    const { provider, chainId, address } = useRari();
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

    const maxBoostAmount = useMaxBoost(safe)

    // Form validation
    const inputError: string | undefined = useMemo(() => {
      const _amount = amount ? amount : '0'
      switch (mode) {
        case SafeInteractionMode.BOOST:
          if (parseEther(_amount).gt(parseEther(maxBoostAmount))) {
            return "You can't boost this much!"
          }
          break;
        case SafeInteractionMode.LESS:
          if (parseEther(_amount).gt(strategy.boostedAmount)) {
            return "You can't less this much!"
          }
          break;
        default:
          return undefined
      }
    }, [amount, maxBoostAmount, strategy, mode])

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

    const onClickMax = async () => {
      try {
        let maxAmount: string;
        if (mode === SafeInteractionMode.BOOST) {
          maxAmount = maxBoostAmount;
        } else {
          // LESS
          maxAmount = formatEther(
            await fetchMaxSafeAmount(
              provider,
              SafeInteractionMode.LESS,
              address,
              safe,
              strategyIndex
            )
          )
        }
        console.log({ maxAmount, mode })
        setAmount(maxAmount)
      } catch (err) {
        handleGenericError(err, toast)
      }
    }

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
          maxBoostAmount,
          strategy,
          erc4626Strategy,
          inputError
        }}
        isOpen={isOpen}
        onClose={onClose}
        {...MODAL_STEPS[stepIndex]}
      />
    );
  };

export default BoostStrategyModal;
