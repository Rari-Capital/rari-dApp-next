import TurboEngineIcon from "components/shared/Icons/TurboEngineIcon";
import { BigNumber, constants } from "ethers";
import { commify, formatEther, parseEther } from "ethers/lib/utils";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import {
  USDPricedStrategy,
  USDPricedTurboSafe,
} from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { FEI } from "lib/turbo/utils/constants";
import {
  Heading,
  ModalProps,
  StatisticsTable,
  StatisticsTableProps,
  Text,
  TokenAmountInput,
} from "rari-components";
import { abbreviateAmount } from "utils/bigUtils";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, HStack, Image, Spinner, Stack, VStack } from "@chakra-ui/react";
import { getSafeColor } from "context/TurboSafeContext";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

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
    erc4626Strategy,
  }) => {
    if (!safe) {
      return null;
    }

    const statisticsLoading = !updatedSafe;

    const totalBoostBalanceStatistic = statisticsLoading ? (
      <Spinner boxSize={4} />
    ) : (
      <Text fontWeight={600}>
        {abbreviateAmount(safe?.boostedUSD)}{" "}
        <Box as="span" color={getSafeColor(updatedSafe?.safeUtilization)}>
          → {abbreviateAmount(updatedSafe?.boostedUSD)}
        </Box>
      </Text>
    );

    const safeUtilizationStatistic = statisticsLoading ? (
      <Spinner boxSize={4} />
    ) : (
      <Text fontWeight={600}>
        {parseFloat(safe?.safeUtilization.toString() ?? "0").toFixed(2)}%{" "}
        <Box as="span" color={getSafeColor(updatedSafe?.safeUtilization)}>
          →{" "}
          {parseFloat(updatedSafe?.safeUtilization.toString() ?? "0").toFixed(
            2
          )}
          %
        </Box>
      </Text>
    );

    const liquidationPriceStatistic = statisticsLoading ? (
      <Spinner boxSize={4} />
    ) : (
      <Text fontWeight={600}>
        {abbreviateAmount(safe?.liquidationPriceUSD)}{" "}
        <Box as="span" color={getSafeColor(updatedSafe?.safeUtilization)}>
          → {abbreviateAmount(updatedSafe?.liquidationPriceUSD)}
        </Box>
      </Text>
    );

    const newTotalBoost =
      totalBoosted?.add(parseEther(!!amount ? amount : "0")) ?? constants.Zero;

    const boostCapStatistic = statisticsLoading ? (
      <Spinner boxSize={4} />
    ) : (
      <Text fontWeight={600}>
        <SimpleTooltip label={formatEther(newTotalBoost) + " FEI"}>
          <Box
            as="span"
            color={
              newTotalBoost.gt(boostCap ?? constants.Zero) ? "red" : "white"
            }
          >
            {abbreviateAmount(formatEther(newTotalBoost), false)}
          </Box>
        </SimpleTooltip>
        /
        <SimpleTooltip label={formatEther(boostCap ?? constants.Zero) + " FEI"}>
          {abbreviateAmount(formatEther(boostCap ?? constants.Zero), false)}
        </SimpleTooltip>
      </Text>
    );

    const statistics: StatisticsTableProps["statistics"] = [
      [
        "Total Boost Balance",
        totalBoostBalanceStatistic,
        "The maximum amount you can boost.",
      ],
      [
        "Safe Utilization",
        safeUtilizationStatistic,
        "The maximum amount you can boost.",
      ],
      [
        "Liquidation Price",
        liquidationPriceStatistic,
        "The liquidation price of your collateral",
      ],
      "DIVIDER",
      [
        "Strategy",
        <Text>{erc4626Strategy?.name}</Text>,
        "The strategy you are boosting",
      ],
    ];

    if (mode === SafeInteractionMode.BOOST) {
      statistics.push([
        "Boost Cap",
        boostCapStatistic,
        "Every strategy has its boost cap to as a safety measure. This the amount of FEI in total that the strategy can be boosted with.",
      ]);
    }

    return (
      <>
        <VStack w="100%" mb={4} align="flex-end">
          <TokenAmountInput
            value={amount}
            onChange={(amount: string) => setAmount(amount ?? "0")}
            tokenAddress={FEI}
            onClickMax={() => onClickMax(true)}
          />
          <Text
            variant="secondary"
            mt={4}
            // onClick={() => onClickMax()}
            // _hover={{ cursor: "pointer", opacity: 0.9 }}
            // transition="opacity 0.2s ease"
          >
            {mode === SafeInteractionMode.BOOST
              ? `You can boost ${commify(
                  parseFloat(formatEther(maxAmount)).toFixed(2)
                )} FEI`
              : `You can less ${commify(
                  parseFloat(formatEther(strategy!.boostedAmount)).toFixed(2)
                )} FEI`}
          </Text>
        </VStack>
        <StatisticsTable mb={4} statistics={statistics} />
        {/* Boost cap for Strategy - show if amount is 50% over boost */}
        {mode === SafeInteractionMode.BOOST &&
          !!boostCap
            ?.div(2)
            ?.lt(
              totalBoosted?.add(parseEther(amount || "0")) ?? constants.Zero
            ) && (
            <HStack justifyContent="center" spacing={4} mt={4}>
              {/* <TurboEngineIcon fill="#000000" height={4} mr={4} /> */}
              {/* <Text>
                Total Boost{" "}
                {abbreviateAmount(
                  formatEther(
                    totalBoosted?.add(parseEther(amount || "0")) ??
                      constants.Zero
                  )
                )}
              </Text>
              <Text>&middot;</Text>
              <Text>Approaching {abbreviateAmount(formatEther(boostCap))}</Text> */}
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
      variant: isRiskyBoost ? "danger" : "neutral",
      loading: transacting,
      disabled: !amount || !!inputError || transacting,
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
    <Stack alignItems="center" spacing={8}>
      <CheckCircleIcon boxSize={24} color="neutral" />
      <Box textAlign="center">
        <Heading>{commify(parseFloat(amount).toFixed(2))} FEI</Heading>
        <Text fontSize="lg" my={4}>
          Successfully {mode}ed
        </Text>
      </Box>
    </Stack>
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
