import { Box, Flex, Image, useToast, Stack } from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { parseEther } from "ethers/lib/utils";
import { useTokenData } from "hooks/useTokenData";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE } from "lib/turbo/utils/constants";
import {
  Heading,
  Modal,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components/standalone";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";

type ModalProps = React.ComponentProps<typeof Modal>;

type CreateSafeCtx = {
  incrementStepIndex(): void;
};

type ModalStep = Pick<ModalProps, "title" | "subtitle" | "buttons"> & {
  /**
   * Extension of the `Modal` `children` prop which receives a parameter `ctx`
   * containing functions and variables specific to the safe creation flow
   * (essentially, making `children` a render prop) before returning `ReactNode`
   * children.
   */
  children(ctx: CreateSafeCtx): ModalProps["children"];
  /**
   * Extension of the `Modal` `onClickButton` prop which also receives
   * a parameter `ctx` containing functions and variables specific to the
   * safe creation flow.
   */
  onClickButton(buttonIndex: number, ctx: CreateSafeCtx): void;
};

const MODAL_STEPS: ModalStep[] = [
  {
    title: "Creating a safe",
    subtitle:
      "The first step towards using Turbo is creating a safe, which allows you to boost pools by depositing collateral.",
    children: () => (
      <Stack spacing={4}>
        <Flex align="center">
          <Image
            src="/static/turbo/one-collateral-type.png"
            height={16}
            mr={4}
          />
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
    buttons: [
      {
        children: "I understand",
        variant: "neutral",
      },
    ],
    onClickButton(_, { incrementStepIndex }) {
      incrementStepIndex();
    },
  },
  {
    title: "Select collateral type",
    subtitle: "Pick a collateral type supported by top lending markets.",
    children: () => (
      <Stack>
        <Flex>
          <TokenIcon
            tokenAddress="0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
            mr={4}
          />
          <Heading>TRIBE</Heading>
        </Flex>
      </Stack>
    ),
    buttons: [
      {
        children: "Select collateral type",
        variant: "neutral",
      },
    ],
    onClickButton(_, { incrementStepIndex }) {
      incrementStepIndex();
    },
  },
  {
    title: "Deposit collateral",
    subtitle: "Deposit",
    children: () => (
      <Stack>
        <TokenAmountInput
          onClickMax={() => {}}
          tokenSymbol="TRIBE"
          tokenAddress="0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
        />
        <TokenIcon
          tokenAddress="0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
          mr={4}
        />
        <Heading>TRIBE</Heading>
      </Stack>
    ),
    buttons: [
      {
        children: "Deposit",
        variant: "neutral",
      },
    ],
    onClickButton(_, { incrementStepIndex }) {
      incrementStepIndex();
    },
  },
];

type CreateSafeModalProps = Pick<
  React.ComponentProps<typeof Modal>,
  "isOpen" | "onClose"
>;

export const CreateSafeModal: React.FC<CreateSafeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { address, provider, chainId } = useRari();

  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  const [amount, setAmount] = useState<string>("0");
  const [underlyingToken, setUnderlyingToken] = useState(TRIBE);

  const [creating, setCreating] = useState(false);

  const tokenData = useTokenData(underlyingToken);

  // Utils
  const toast = useToast();

  const onClickCreateSafe = async () => {
    if (!address || !provider || !chainId) return;

    const amountBN = parseEther(amount);

    if (!amountBN.isZero()) {
      try {
        setCreating(true);
        const receipt = await createSafeAndDeposit(
          provider.getSigner(),
          amountBN,
          chainId
        );
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreating(false);
      }
    } else {
      try {
        setCreating(true);
        const receipt = await createSafe(underlyingToken, provider, chainId);
        console.log({ receipt });
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
      } finally {
        setCreating(false);
      }
    }
  };

  const createSafeCtx = {
    incrementStepIndex,
    onClickCreateSafe,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStepIndex(0);
        onClose();
      }}
      title={MODAL_STEPS[stepIndex].title}
      subtitle={MODAL_STEPS[stepIndex].subtitle}
      buttons={MODAL_STEPS[stepIndex].buttons}
      onClickButton={(buttonIndex) => {
        MODAL_STEPS[stepIndex].onClickButton(buttonIndex, createSafeCtx);
      }}
      progressValue={((stepIndex + 1) / MODAL_STEPS.length) * 100}
    >
      {MODAL_STEPS[stepIndex].children}
    </Modal>
  );
};

export default CreateSafeModal;
