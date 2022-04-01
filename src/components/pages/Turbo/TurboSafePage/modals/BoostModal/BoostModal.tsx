// Hooks
import { useRari } from "context/RariContext";
// Utils
import { parseEther, parseUnits } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
// Turbo
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { safeBoost } from "lib/turbo/transactions/safe";
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
};

export const BoostStrategyModal: React.FC<
  BoostStrategyModalProps
> = ({
  isOpen,
  onClose,
  safe,
  strategy,
  erc4626Strategy,
  strategyIndex
}) => {
    const { address, provider, chainId } = useRari();
    const toast = useToast();

    const [stepIndex, setStepIndex] = useState(0);
    function incrementStepIndex() {
      if (stepIndex + 1 !== MODAL_STEPS.length) {
        setStepIndex(stepIndex + 1);
      }
    }

    const [boostAmount, setBoostAmount] = useState<string>("0");
    const [boosting, setBoosting] = useState(false);

    const updatedSafe = useUpdatedSafeInfo(
      {
        mode: SafeInteractionMode.BOOST,
        safe,
        amount: parseUnits(!!boostAmount ? boostAmount : "0", 18),
        strategyIndex
      }
    )

    console.log({ updatedSafe })

    // Boostst a strategy with hardcoded amount
    const onClickBoost = async () => {
      if (!safe?.safeAddress || !provider || !boostAmount) return;
      const amountBN = parseEther(boostAmount);
      const strategyAddress = strategy!.strategy

      try {
        setBoosting(true);
        const tx = await safeBoost(
          safe.safeAddress,
          strategyAddress,
          amountBN,
          //@ts-ignore
          await provider.getSigner()
        );
        await tx.wait(1)
        onClose()
      } catch (err) {
        handleGenericError(err, toast);
      } finally {
        setBoosting(false);
      }
    };



    return (
      <Modal
        ctx={{
          incrementStepIndex,
          safe,
          updatedSafe,
          boostAmount,
          setBoostAmount,
          onClickBoost,
          boosting,
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
