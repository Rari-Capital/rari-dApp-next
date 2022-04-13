import { BigNumber, constants } from "ethers";
import { commify, formatEther, parseEther } from "ethers/lib/utils";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import StatisticTable, {
  StatisticTableProps,
} from "lib/components/StatisticsTable";
import {
  USDPricedStrategy,
  USDPricedTurboSafe,
} from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { FEI } from "lib/turbo/utils/constants";
import { Heading, ModalProps, Text, TokenAmountInput } from "rari-components";
import {
  abbreviateAmount,
  shortUsdFormatter,
  smallUsdFormatter,
} from "utils/bigUtils";
import { HStack, Image, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import TurboEngineIcon from "components/shared/Icons/TurboEngineIcon";

type BoostModalCtx = {
  incrementStepIndex(): void;
  resetStepIndex(): void;
  safe?: USDPricedTurboSafe;
  updatedSafe?: USDPricedTurboSafe;
  amount: string;
  setAmount(newAmount: string): void;
  transacting: boolean;
  onClickBoost(): Promise<void>;
  onClickLess(): Promise<void>;
  onClose(): void;
  onClickMax(snip?: boolean): void;
  maxAmount: BigNumber;
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS;
  strategy: USDPricedStrategy | undefined;
  erc4626Strategy: FuseERC4626Strategy | undefined;
  inputError: string | undefined;
  // Boost caps
  boostCap: BigNumber | undefined;
  totalBoosted: BigNumber | undefined;
  percentTotalBoosted: number | undefined;
  // Risk
  isRiskyBoost: boolean;
};

type ModalStep = Omit<ModalProps<BoostModalCtx>, "ctx" | "isOpen" | "onClose">;

const MODAL_STEP_1: ModalStep = {
  title: ({ mode, erc4626Strategy }) => `${mode} strategy`,
  subtitle: ({ mode, erc4626Strategy }) =>
    `${mode}ing strategy ${erc4626Strategy?.name}`,
  children: ({
    onClickMax,
    setAmount,
    amount,
    safe,
    updatedSafe,
    mode,
    maxAmount,
    strategy,
    boostCap,
    totalBoosted,
  }) => {
    if (!safe) return;
    return (
      <>
        <VStack w="100%" mb={3} align="flex-end">
          <TokenAmountInput
            value={amount}
            onChange={(amount: string) => setAmount(amount ?? "0")}
            tokenAddress={FEI}
            onClickMax={() => onClickMax(true)}
          />
          <Text
            variant="secondary"
            mt="4"
            onClick={() => onClickMax()}
            _hover={{ cursor: "pointer", opacity: 0.9 }}
            transition="opacity 0.2s ease"
          >
            {mode === SafeInteractionMode.BOOST
              ? `You can boost ${parseFloat(formatEther(maxAmount)).toFixed(
                  2
                )} FEI`
              : `You can less ${parseFloat(
                  formatEther(strategy!.boostedAmount)
                ).toFixed(2)} FEI`}
          </Text>
        </VStack>
        <StatisticTable
          mb={3}
          statistics={[
            {
              title: "Total Boost Balance",
              primaryValue: abbreviateAmount(safe?.boostedUSD),
              secondaryValue: abbreviateAmount(updatedSafe?.boostedUSD),
              titleTooltip: "The maximum amount you can boost.",
              primaryTooltip: "",
            },
            {
              title: "Safe Utilization",
              primaryValue:
                parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2) +
                  "%" ?? "?",
              secondaryValue:
                parseFloat(
                  updatedSafe?.safeUtilization.toString() ?? "0"
                ).toFixed(2) + "%" ?? "?",
              titleTooltip: "The health of your safe. ",
              primaryTooltip: "",
            },
            {
              title: `Liquidation Price`,
              primaryValue: abbreviateAmount(safe?.liquidationPriceUSD),
              secondaryValue: abbreviateAmount(
                updatedSafe?.liquidationPriceUSD
              ),
              titleTooltip: "The health of your safe. ",
              primaryTooltip: "",
            },
          ]}
          isLoading={!updatedSafe}
        />
        {/* Boost cap for Strategy - show if amount is 50% over boost */}
        {mode === SafeInteractionMode.BOOST &&
          !!boostCap
            ?.div(2)
            ?.lt(totalBoosted?.add(parseEther(amount)) ?? constants.Zero) && (
            <HStack px={3}>
              <TurboEngineIcon fill="#000000" height={4} mr={4} />
              <Text>
                Total Boost{" "}
                {abbreviateAmount(
                  formatEther(
                    totalBoosted?.add(parseEther(amount)) ?? constants.Zero
                  )
                )}  
              </Text>
              <Text>Approaching {abbreviateAmount(formatEther(boostCap))}</Text>
            </HStack>
          )}
        {/* Claim Fees on Less All */}
        {mode === SafeInteractionMode.LESS &&
          strategy?.boostedAmount?.eq(parseEther(amount ? amount : "0")) && (
            <HStack px={3}>
              <Image
                src="/static/turbo/action-icons/claim-interest.png"
                height={4}
                mr={4}
              />
              <Text>
                Lessing the entire strategy will also accrue{" "}
                <b>
                  {parseFloat(formatEther(strategy.feiClaimable)) < 0.01
                    ? "<.01"
                    : parseFloat(formatEther(strategy.feiClaimable)).toFixed(
                        2
                      )}{" "}
                  FEI
                </b>{" "}
                to the Safe.
              </Text>
            </HStack>
          )}
      </>
    );
  },
  buttons: ({
    mode,
    amount,
    strategy,
    transacting,
    onClickBoost,
    onClickLess,
    incrementStepIndex,
    inputError,
    isRiskyBoost,
  }) => [
    {
      children: !!inputError
        ? inputError
        : mode === SafeInteractionMode.LESS
        ? strategy?.boostedAmount?.eq(parseEther(amount || "0"))
          ? "Less and Accrue Rewards"
          : "Less"
        : isRiskyBoost
        ? "Risky Boost!"
        : "Boost",
      variant: "neutral",
      background: isRiskyBoost ? "red" : "#6C69E9",
      loading: transacting,
      disabled: !amount || !!inputError,
      async onClick() {
        try {
          if (mode === "Boost") {
            await onClickBoost();
          } else {
            await onClickLess();
          }
        } catch (err) {
          throw err;
        }
      },
    },
  ],
};

const MODAL_STEP_2: ModalStep = {
  children: ({ amount, mode }) => (
    <>
      <VStack>
        <Heading>{commify(parseFloat(amount).toFixed(2))} FEI</Heading>
        <Text>Succesfully {mode}ed</Text>
      </VStack>
    </>
  ),
  buttons: ({ onClose, resetStepIndex }) => [
    {
      children: "Back to Safe",
      variant: "neutral",
      async onClick() {
        resetStepIndex();
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [MODAL_STEP_1, MODAL_STEP_2];

export { MODAL_STEPS };
export type { BoostModalCtx };
