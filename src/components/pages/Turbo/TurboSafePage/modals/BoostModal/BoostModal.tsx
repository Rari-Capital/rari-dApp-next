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
import { useBoostCapForStrategy } from "hooks/turbo/useBoostCapsForStrategies";
import { useTurboSafe } from "context/TurboSafeContext";

// Utils
import { keyBy } from "lodash";

type BoostStrategyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeStrategyAddress: string;
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS;
};

export const BoostStrategyModal: React.FC<BoostStrategyModalProps> = ({
  isOpen,
  onClose,
  activeStrategyAddress,
  mode,
}) => {
  const { provider, chainId } = useRari();
  const toast = useToast();
  const queryClient = useQueryClient();

  /** Strategy ? **/
  const { usdPricedSafe, getERC4626StrategyData } = useTurboSafe();
  const safeStrategies: USDPricedStrategy[] =
    usdPricedSafe?.usdPricedStrategies ?? [];

  // Construct a new object where safe strategies are indexed by address
  // for O(1) access by address (order in the table is not necessarily
  // stable).
  const safeStrategiesByAddress = useMemo(
    () => keyBy(safeStrategies, (strategy) => strategy.strategy),
    [safeStrategies]
  );

  const strategy = !!activeStrategyAddress
    ? safeStrategiesByAddress[activeStrategyAddress]
    : undefined;

  // For now, a bunch of other components rely on the assumption that the
  // order of the strategies *stored in the source `safe.usdPricedStrategies`
  // array* is stable. Since the order of items in the table is not
  // necessarily stable, we need to translate from a table index to a source
  // array index using `Array.prototype.findIndex`.
  const activeStrategyIndex = useMemo(
    () =>
      safeStrategies.findIndex(
        (strategy) => strategy.strategy === activeStrategyAddress
      ),
    [safeStrategies, activeStrategyAddress]
  );

  const erc4626Strategy = getERC4626StrategyData[activeStrategyAddress];

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
    safe: usdPricedSafe,
    amount: parseUnits(!!amount ? amount : "0", 18),
    strategyIndex: activeStrategyIndex,
  });

  const maxAmount = useSafeMaxAmount(usdPricedSafe, mode, activeStrategyIndex);

  const isRiskyBoost =
    mode === SafeInteractionMode.BOOST &&
    !!updatedSafe?.safeUtilization?.gt(75);

  // Boost cap for a vault
  const [boostCap, totalBoosted] =
    useBoostCapForStrategy(strategy?.strategy) ?? [];
  const percentTotalBoosted =
    boostCap && totalBoosted
      ? (parseFloat(formatEther(totalBoosted)) /
          parseFloat(formatEther(boostCap))) *
        100
      : undefined;

  // Form validation
  const inputError: string | undefined = useMemo(() => {
    const _amount = amount ? amount : "0";

    switch (mode) {
      case SafeInteractionMode.BOOST:
        if (parseEther(_amount).gt(maxAmount)) {
          return "You can't boost this much!";
        }
        if (!!boostCap && !!totalBoosted) {
          if (
            parseFloat(formatEther(totalBoosted)) + parseFloat(_amount) >
            parseFloat(formatEther(boostCap))
          ) {
            return "Boost amount exceeds Cap for Vault";
          }
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
    if (!usdPricedSafe?.safeAddress || !provider || !amount) return;
    const amountBN = parseEther(amount);
    const strategyAddress = strategy!.strategy;

    try {
      setTransacting(true);
      const tx = await safeBoost(
        usdPricedSafe.safeAddress,
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
    if (!usdPricedSafe?.safeAddress || !provider || !amount || !strategy)
      return;

    let amountBN = parseEther(amount);
    amountBN = amountBN.gte(strategy.boostedAmount)
      ? strategy.boostedAmount
      : amountBN;

    const lessingMax = strategy.boostedAmount.eq(amountBN);

    try {
      setTransacting(true);
      const tx = await safeLess(
        usdPricedSafe.safeAddress,
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
        safe: usdPricedSafe,
        updatedSafe,
        transacting,
        mode,
        maxAmount,
        strategy,
        erc4626Strategy,
        inputError,
        // Boost caps
        boostCap,
        totalBoosted,
        percentTotalBoosted,
        // Risk
        isRiskyBoost,
      }}
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_STEPS[stepIndex]}
    />
  );
};

export default BoostStrategyModal;
