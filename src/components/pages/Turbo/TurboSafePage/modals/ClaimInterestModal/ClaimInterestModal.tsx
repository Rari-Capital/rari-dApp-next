// Hooks
import { useRari } from "context/RariContext";
// Turbo
import { Modal } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/react";
import { MODAL_STEPS } from "./modalSteps";
import { useUserFeiOwed } from "hooks/turbo/useUserFeiOwed";
import { safeClaimAll } from "lib/turbo/transactions/claim";
import { safeSweep } from "lib/turbo/transactions/safe";
import { FEI } from "lib/turbo/utils/constants";
import { USDPricedTurboSafe, USDPricedStrategy } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { filterUsedStrategies } from "lib/turbo/fetchers/strategies/formatStrategyInfo";

// Todo - reuse Modal Prop Types
type ClaimInterestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: USDPricedTurboSafe | undefined;
};

export const ClaimInterestModal: React.FC<ClaimInterestModalProps> = ({
  isOpen,
  onClose,
  safe,
}) => {
  const { address, chainId, provider } = useRari();

  const toast = useToast();

  const [claiming, setClaiming] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  const activeStrategies: USDPricedStrategy[] = filterUsedStrategies(safe?.usdPricedStrategies ?? []) as USDPricedStrategy[]

  const [totalClaimable, claimableFromStrategies, safeFeiBalance] = useUserFeiOwed(safe)

  const onClickClaimInterest = async () => {
    if (!safe || !chainId || !activeStrategies) return
    try {
      setClaiming(true);

      // If There is nothing claimable from strats, just sweep the safe. Else slurp all + sweep
      if (claimableFromStrategies.isZero()) {
        const tx = await safeSweep(
          safe.safeAddress,
          address,
          FEI,
          safeFeiBalance,
          chainId,
          await provider.getSigner()
        )
        await tx.wait(1)
      } else {
        const tx = await safeClaimAll({
          safeAddress: safe.safeAddress,
          strategies: activeStrategies.map(s => s.strategy),
          recipient: address,
          signer: await provider.getSigner(),
          chainID: chainId,
        })
        await tx.wait(1)
      }
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Modal
      ctx={{
        incrementStepIndex,
        claiming,
        onClickClaimInterest,
        onClose,
        totalClaimable,
        claimableFromStrategies,
        safeFeiBalance,
        activeStrategies
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default ClaimInterestModal;
