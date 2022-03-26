import { createSafe } from "lib/turbo/transactions/safe";
import {
  Heading,
  HoverableCard,
  Modal,
  StatisticTable,
  Text,
  TokenAmountInput,
  TokenIcon,
  TokenSymbol,
} from "rari-components/standalone";
import { CheckCircleIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Spacer, Stack } from "@chakra-ui/react";
import { JsonRpcProvider } from "@ethersproject/providers";

type ModalProps = React.ComponentProps<typeof Modal>;

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
  /**
   * Function to decrement the current step by 1 (i.e. go to the previous step
   * in the safe creation process).
   */
  decrementStepIndex(): void;
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
  /**
   * Whether the safe is currently being created. */
  creatingSafe: boolean;
  /** Function which closes the modal. */
  onClose(): void;
};

type ModalStep = Pick<ModalProps, "title" | "subtitle"> & {
  /**
   * Extension of the base `Modal` `children` prop which receives a parameter
   * `ctx` containing functions and variables specific to the safe creation flow
   * (essentially, making `children` a render prop) before returning `ReactNode`
   * children.
   */
  children(ctx: CreateSafeCtx): ModalProps["children"];
  /**
   * Extension of the `Modal` `onClickButton` prop which also receives
   * a parameter `ctx` containing functions and variables specific to the
   * safe creation flow.
   */
  onClickButton?(buttonIndex: number, ctx: CreateSafeCtx): void;
  /**
   * Extension of the `Modal` `buttons` prop which allows modal buttons to
   * dynamically change in response to updates in `ctx`.
   */
  buttons(ctx: CreateSafeCtx): ModalProps["buttons"];
};

const MODAL_STEP_1: ModalStep = {
  title: "Creating a safe",
  subtitle:
    "The first step towards using Turbo is creating a safe, which allows you " +
    "to boost pools by depositing collateral.",
  children: () => (
    <Stack spacing={4}>
      <Flex align="center">
        <Image src="/static/turbo/one-collateral-type.png" height={16} mr={4} />
        <Box>
          <Heading size="md">One collateral type</Heading>
          <Text>Each safe has a single collateral type of choice.</Text>
        </Box>
      </Flex>
      <Flex align="center">
        <Image src="/static/turbo/isolated-actions.png" height={16} mr={4} />
        <Box>
          <Heading size="md">Isolated actions</Heading>
          <Text>Boosting, depositing, etc. are isolated per safe.</Text>
        </Box>
      </Flex>
    </Stack>
  ),
  buttons: () => [
    {
      children: "I understand",
      variant: "neutral",
    },
  ],
  onClickButton(_, { incrementStepIndex }) {
    incrementStepIndex();
  },
};

const MODAL_STEP_2: ModalStep = {
  title: "Select collateral type",
  subtitle: "Pick a collateral type supported by top lending markets.",
  children: ({
    underlyingTokenAddresses,
    setUnderlyingTokenAddress,
    incrementStepIndex,
  }) => (
    <Stack>
      {underlyingTokenAddresses.map((tokenAddress) => (
        <HoverableCard
          variant="ghost"
          onClick={() => {
            setUnderlyingTokenAddress(tokenAddress);
            incrementStepIndex();
          }}
        >
          {(hovered) => (
            <Flex alignItems="center">
              <TokenIcon tokenAddress={tokenAddress} mr={4} />
              <Heading>
                <TokenSymbol
                  tokenAddress={tokenAddress}
                  fallback="Loading..."
                />
              </Heading>
              <Spacer />
              <ChevronRightIcon
                ml={"auto"}
                boxSize={8}
                transition="transform 0.2s ease 0s"
                transform={hovered ? "translateX(5px) scale(1.00)" : ""}
              />
            </Flex>
          )}
        </HoverableCard>
      ))}
    </Stack>
  ),
  buttons: () => [
    {
      children: "Back",
      variant: "cardmatte",
    },
  ],
  onClickButton(_, { decrementStepIndex }) {
    decrementStepIndex();
  },
};

const MODAL_STEP_3: ModalStep = {
  title: "Deposit collateral",
  subtitle: "Collateralizing is required before boosting pools.",
  children: ({ underlyingTokenAddress, depositAmount, setDepositAmount }) => (
    <Stack>
      <Box>
        <TokenAmountInput
          tokenAddress={underlyingTokenAddress}
          value={depositAmount}
          onChange={setDepositAmount}
        />
        <StatisticTable
          statistics={[
            ["Collateral deposited", `${depositAmount ?? 0}`],
            ["Boost balance", `${depositAmount ?? 0}`],
          ]}
          mt={4}
        />
      </Box>
    </Stack>
  ),
  buttons: () => [
    {
      children: "Back",
      variant: "cardmatte",
    },
    {
      children: "Skip",
      variant: "cardmatte",
    },
    {
      children: "Review",
      variant: "neutral",
    },
  ],
  onClickButton(i, { decrementStepIndex, incrementStepIndex }) {
    if (i === 0) {
      decrementStepIndex();
    } else {
      incrementStepIndex();
    }
  },
};

const MODAL_STEP_4: ModalStep = {
  children: ({ underlyingTokenAddress, depositAmount, setDepositAmount }) => (
    <Box>
      <Box textAlign="center">
        <Text fontSize="lg">You are creating</Text>
        <Heading mt={4}>
          <TokenIcon tokenAddress={underlyingTokenAddress} />{" "}
          <TokenSymbol tokenAddress={underlyingTokenAddress} /> Safe
        </Heading>
      </Box>
      <StatisticTable
        mt={8}
        statistics={[
          ["Collateral deposited", `${depositAmount ?? 0}`],
          ["Boost balance", `${depositAmount ?? 0}`],
          ["Estimated gas cost", ""],
          ["# of transactions", "3"],
        ]}
      />
    </Box>
  ),
  buttons: ({ hasApproval, approving, depositAmount, creatingSafe }) => [
    {
      children: "Back",
      variant: "cardmatte",
    },
    {
      children: approving
        ? "Approving..."
        : creatingSafe
        ? "Creating Safe..."
        : !hasApproval
        ? "Approve Router"
        : (depositAmount ?? 0) > 0
        ? "Create Safe & Deposit"
        : "Create Safe",
      variant: "neutral",
      loading: creatingSafe,
    },
  ],
  async onClickButton(
    i,
    {
      hasApproval,
      approve,
      underlyingTokenAddress,
      decrementStepIndex,
      incrementStepIndex,
      createSafe,
      provider,
      chainId,
    }
  ) {
    if (i === 0) {
      decrementStepIndex();
    } else {
      if (!hasApproval) {
        await approve();
      } else {
        await createSafe(underlyingTokenAddress, provider, chainId);
        incrementStepIndex();
      }
    }
  },
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
  buttons: () => [
    {
      children: "View Safe",
      variant: "neutral",
    },
  ],
  async onClickButton(_, { onClose }) {
    onClose();
  },
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
