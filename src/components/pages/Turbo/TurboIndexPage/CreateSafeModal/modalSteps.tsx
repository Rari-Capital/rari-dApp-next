import { BigNumber, utils } from "ethers";
import { commify, formatEther, parseEther } from "ethers/lib/utils";
import { createSafe } from "lib/turbo/transactions/safe";
import {
  Heading,
  HoverableCard,
  ModalProps,
  Text,
  StatisticTable as RariStats,
  TokenAmountInput,
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import StatisticTable from "lib/components/StatisticsTable";
import { CheckCircleIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Spacer, Stack, VStack } from "@chakra-ui/react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Dispatch, SetStateAction } from "react";

type CreateSafeCtx = {
  /** A provider to connect to the blockchain with. */
  provider: JsonRpcProvider;
  /** The current chain ID. */
  chainId: number;
  /**
   * Function to increment the current step by 1 (i.e. go to the next step in
   * the safe creation process).
   */
  incrementStepIndex(): void;
  /** List of addresses of possible underlying tokens. */
  underlyingTokenAddresses: string[];
  /** The address of the currently selected underlying token for the safe. */
  underlyingTokenAddress: string;
  /** Function to set the address of the underlying token of the safe. */
  setUnderlyingTokenAddress(underlyingTokenAddress: string): void;
  /**
   * Amount to deposit into the safe. Stored as a string that we'll convert to
   * a `BigNumber` later.
   */
  depositAmount?: string;
  /** Set a new amount to deposit into the safe. */
  setDepositAmount(newDepositAmount: string): void;
  /**
   * Whether the currently selected `underlyingTokenAddress` has approved
   * the router.
   */
  hasApproval: boolean;
  /** Function to approve the underlying token of the safe. */
  approve: () => Promise<void>;
  /** Whether the approval is currently pending. */
  approving: boolean;
  /** Function which creates a safe. */
  createSafe: typeof createSafe;
  /** Whether the safe is currently being created. */
  creatingSafe: boolean;
  collateralBalance: string;
  onClickMax(): Promise<void>;
  /** Function which closes the modal. */
  onClose(): void;
  /** Whether the navigation to the created safe is pending. */
  navigating: boolean;
  /**
   * Function which navigates to the safe that was just created in this modal.
   */
  navigateToCreatedSafe(safeId: string): void;
};

type ModalStep = Omit<ModalProps<CreateSafeCtx>, "ctx" | "isOpen" | "onClose">;

const MODAL_STEP_1: ModalStep = {
  title: "Creating a safe",
  subtitle:
    "The first step towards using Turbo is creating a safe, which allows you to boost pools by depositing a collateral type that has been approved by the Tribe DAO governance.",
  children: (
    <Stack spacing={4}>
      <Flex align="center">
        <Image src="/static/turbo/one-collateral-type.png" height={16} mr={4} />
        <Box>
          <Heading size="md">One collateral type</Heading>
          <Text>Each Turbo safe uses one singular collateral type.</Text>
        </Box>
      </Flex>
      <Flex align="center">
        <Image src="/static/turbo/isolated-actions.png" height={16} mr={4} />
        <Box>
          <Heading size="md">Isolated actions</Heading>
          <Text>
            Collateralizing, boosting, depositing, withdrawing, slurping, and
            sweeping are all isolated features per safe.
          </Text>
        </Box>
      </Flex>
    </Stack>
  ),
  buttons: ({ incrementStepIndex }) => [
    {
      children: "I understand",
      variant: "neutral",
      onClick() {
        incrementStepIndex();
      },
    },
  ],
};

const MODAL_STEP_2: ModalStep = {
  title: "Select collateral type",
  subtitle: "Pick a collateral type supported by top lending markets.",
  children: ({
    underlyingTokenAddresses,
    setUnderlyingTokenAddress,
    incrementStepIndex,
  }) => (
    <Stack spacing={4}>
      {underlyingTokenAddresses.map((tokenAddress) => (
        <HoverableCard
          variant="ghost"
          onClick={() => {
            setUnderlyingTokenAddress(tokenAddress);
            incrementStepIndex();
          }}
          key={tokenAddress}
          p={4}
        >
          {(hovered) => (
            <Flex
              alignItems="center"
              opacity={hovered ? 0.5 : 1}
              transition="0.2s opacity"
            >
              <TokenIcon tokenAddress={tokenAddress} mr={4} />
              <Heading size="lg">
                <TokenSymbol
                  tokenAddress={tokenAddress}
                  fallback="Loading..."
                />
              </Heading>
              <Spacer />
              <ChevronRightIcon
                ml={"auto"}
                boxSize={4}
                transition="transform 0.2s ease 0s"
                transform={hovered ? "translateX(5px) scale(1.00)" : ""}
              />
            </Flex>
          )}
        </HoverableCard>
      ))}
    </Stack>
  ),
};

const MODAL_STEP_3: ModalStep = {
  title: "Deposit collateral",
  subtitle: "Collateralizing is required before boosting pools. This step is optional.",
  children: ({ underlyingTokenAddress, onClickMax, depositAmount, collateralBalance, setDepositAmount }) => (
    <Stack>
      <Box>
      <VStack w="100%" mb={3} align="flex-end">
        <TokenAmountInput
          tokenAddress={underlyingTokenAddress}
          value={depositAmount}
          onChange={setDepositAmount}
          onClickMax={onClickMax}
        />
        <Text variant="secondary" mt="4" _hover={{ cursor: "default" }}>
            Balance: {commify(collateralBalance)}{" "}
            <TokenSymbol tokenAddress={underlyingTokenAddress} />
          </Text>
        </VStack>
        <StatisticTable
          statistics={[
            {
              title: "Collateral",
              primaryValue: `0`,
              secondaryValue: depositAmount !== "" ? `${commify(depositAmount ?? 0)}` : undefined,
              titleTooltip: "How much collateral you have deposited.",
            }
          ]}
          mt={4}
        />
      </Box>
    </Stack>
  ),
  buttons: ({ incrementStepIndex }) => [
    {
      children: "Skip",
      variant: "cardmatte",
      onClick() {
        incrementStepIndex();
      },
    },
    {
      children: "Review",
      variant: "neutral",
      onClick() {
        incrementStepIndex();
      },
    },
  ],
};

const MODAL_STEP_4: ModalStep = {
  children: ({ underlyingTokenAddress, depositAmount }) => (
    <Box>
      <Box textAlign="center">
        <Text fontSize="lg">You are creating</Text>
        <Heading mt={4}>
          <TokenIcon tokenAddress={underlyingTokenAddress} />{" "}
          <TokenSymbol tokenAddress={underlyingTokenAddress} /> Safe
        </Heading>
      </Box>
      <RariStats
        mt={8}
        statistics={[
          ["Collateral deposited", `${utils.commify(depositAmount ?? "0")}`],
          ["Estimated gas cost", ""],
          ["# of transactions", "3"],
        ]}
      />
    </Box>
  ),
  stepBubbles: ({ approving, creatingSafe }) => ({
    steps: 2,
    loading: approving || creatingSafe,
    activeIndex: creatingSafe ? 1 : 0,
    background: "neutral",
  }),
  buttons: ({
    hasApproval,
    approving,
    depositAmount,
    creatingSafe,
    incrementStepIndex,
    createSafe,
    provider,
    chainId,
    underlyingTokenAddress,
    approve,
  }) => [
    {
      children: approving
        ? "Approving..."
        : creatingSafe
        ? "Creating Safe..."
        : !hasApproval &&
          BigNumber.from(!!depositAmount ? depositAmount : "0").gt(0)
        ? "Approve Router"
        : BigNumber.from(!!depositAmount ? depositAmount : "0").gt(0)
        ? "Create Safe & Deposit"
        : "Create Safe",
      variant: "neutral",
      loading: approving || creatingSafe,
      async onClick() {
        if (!hasApproval) {
          await approve();
        }
        await createSafe(underlyingTokenAddress, provider, chainId);
        incrementStepIndex();
      },
    },
  ],
};

const MODAL_STEP_5: ModalStep = {
  children: ({ underlyingTokenAddress }) => (
    <Stack alignItems="center" spacing={8}>
      <CheckCircleIcon boxSize={40} color="neutral" />
      <Box textAlign="center">
        <Heading>
          <TokenIcon tokenAddress={underlyingTokenAddress} />{" "}
          <TokenSymbol tokenAddress={underlyingTokenAddress} /> Safe
        </Heading>
        <Text fontSize="lg" my={4}>
          Successfully created
        </Text>
      </Box>
    </Stack>
  ),
  buttons: ({ onClose, navigateToCreatedSafe, navigating }) => [
    {
      children: navigating ? "Loading..." : "View Safe",
      loading: navigating,
      variant: "neutral",
      async onClick() {
        // TODO(sharad-s): replace hardcoded value
        await navigateToCreatedSafe("0");
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [
  MODAL_STEP_1,
  MODAL_STEP_2,
  MODAL_STEP_3,
  MODAL_STEP_4,
  MODAL_STEP_5,
];

export { MODAL_STEPS };
export type { CreateSafeCtx };
