import { BigNumber, constants, utils } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import {
  Card,
  Heading,
  HoverableCard,
  ModalProps,
  StatisticsTable,
  Text,
  TokenAmountInput,
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import { CheckCircleIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
  Spacer,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { SimulatedSafe } from "./CreateSafeModal";

type CreateSafeCtx = {
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
  depositAmount: string;
  /** Set a new amount to deposit into the safe. */
  setDepositAmount(newDepositAmount: string): void;
  /**
   * Whether the currently selected `underlyingTokenAddress` has approved
   * the router.
   */
  hasApproval: boolean;
  /** Function to approve the underlying token of the safe. */
  onClickApprove: () => Promise<void>;
  /** Whether the approval is currently pending. */
  approving: boolean;
  /** Function which creates a safe. */
  onClickCreateSafe: () => Promise<void>;
  /** Whether the safe is currently being created. */
  creatingSafe: boolean;
  collateralBalance: string;
  safeSimulation: SimulatedSafe | undefined;
  onClickMax(): Promise<void>;
  /** Function which closes the modal. */
  onClose(): void;
  /** Whether the navigation to the created safe is pending. */
  navigating: boolean;
  /**
   * Function which navigates to the safe that was just created in this modal.
   */
  navigateToCreatedSafe(): void;
  createdSafe: string | undefined;
};

type ModalStep = Omit<ModalProps<CreateSafeCtx>, "ctx" | "isOpen" | "onClose">;

const MODAL_STEP_1: ModalStep = {
  title: "Create a Safe",
  subtitle: "Safes isolate manage and your collateral.",
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
              opacity={hovered ? 1 : 0.75}
              transition="0.2s opacity"
            >
              <VStack>
                <TokenIcon
                  tokenAddress={tokenAddress}
                  mr={4}
                  boxSize={"40px"}
                />
              </VStack>
              <VStack align={"flex-start"} py={1}>
                <HStack>
                  <Heading size="md">
                    <TokenSymbol
                      tokenAddress={tokenAddress}
                      fallback="Loading..."
                    />
                    {' '} Safe
                  </Heading>
                </HStack>
                <HStack>
                  <Text variant="secondary">
                    Boost FEI against{" "}
                    <TokenSymbol tokenAddress={tokenAddress} fallback="?" />
                  </Text>
                </HStack>
              </VStack>
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

const MODAL_STEP_2: ModalStep = {
  children: ({ underlyingTokenAddress }) => (
    <VStack>
      <Box mb={4} alignItems="center">
        <Text textAlign={"center"} mb={2}>
          {" "}
          You are creating a
        </Text>
        <HStack>
          <TokenIcon tokenAddress={underlyingTokenAddress} boxSize={"35px"} />
          <Heading size="xl">
            <TokenSymbol tokenAddress={underlyingTokenAddress} /> Safe
          </Heading>
        </HStack>
      </Box>
      <Card>
        <VStack spacing={6} align="flex-start">
          <Flex align="center">
            <Image
              src="/static/turbo/one-collateral-type.png"
              height={16}
              mr={4}
            />
            <Box>
              <Heading size="md">
                <TokenSymbol tokenAddress={underlyingTokenAddress} /> Collateral
              </Heading>
              <Text variant="secondary">
                Boost FEI against{" "}
                <TokenSymbol tokenAddress={underlyingTokenAddress} />{" "}
                Collateral.
              </Text>
            </Box>
          </Flex>
          <Flex align="center">
            <Image
              src="/static/turbo/isolated-actions.png"
              height={16}
              mr={4}
            />
            <Box>
              <Heading size="md">Isolated</Heading>
              <Text variant="secondary">
                Safes isolate collateral, FEI boosting, and liquidations.
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Card>
    </VStack>
  ),
  buttons: ({
    hasApproval,
    approving,
    depositAmount,
    creatingSafe,
    onClickCreateSafe,
    onClickApprove,
    incrementStepIndex,
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
      variant: "success",
      loading: approving || creatingSafe,
      async onClick() {
        try {
          if (!hasApproval) {
            await onClickApprove();
          }
          await onClickCreateSafe();
        } catch (err) {
          throw err;
        }
      },
    },
  ],
};

// const MODAL_STEP_3: ModalStep = {
//   title: "Deposit collateral",
//   subtitle:
//     "Collateralizing is required before boosting pools. This step is optional.",
//   children: ({
//     underlyingTokenAddress,
//     onClickMax,
//     depositAmount,
//     collateralBalance,
//     setDepositAmount,
//     safeSimulation,
//   }) => (
//     <Stack>
//       <Box>
//         <VStack w="100%" mb={3} align="flex-end">
//           <TokenAmountInput
//             tokenAddress={underlyingTokenAddress}
//             value={depositAmount}
//             onChange={setDepositAmount}
//             onClickMax={onClickMax}
//           />
//           <Text variant="secondary" mt="4" _hover={{ cursor: "default" }}>
//             Balance: {commify(collateralBalance)}{" "}
//             <TokenSymbol tokenAddress={underlyingTokenAddress} />
//           </Text>
//         </VStack>
//         <StatisticsTable
//           statistics={[
//             {
//               title: "Collateral",
//               primaryValue: `0`,
//               secondaryValue:
//                 !depositAmount || depositAmount === "0"
//                   ? undefined
//                   : `${commify(depositAmount ?? 0)}`,
//               titleTooltip: "How much collateral you have deposited.",
//             },
//             {
//               title: "Collateral value",
//               primaryValue: "0",
//               secondaryValue:
//                 !depositAmount || depositAmount === "0" || !safeSimulation
//                   ? undefined
//                   : "$" +
//                     commify(
//                       parseFloat(
//                         formatEther(
//                           safeSimulation?.collateralUSD ?? constants.Zero
//                         )
//                       ).toFixed(2)
//                     ),
//               titleTooltip:
//                 "The total collateral value denominated in dollars.",
//             },
//             {
//               title: "Max boost",
//               primaryValue: "0",
//               secondaryValue:
//                 !depositAmount || depositAmount === "0" || !safeSimulation
//                   ? undefined
//                   : "$" +
//                     commify(
//                       parseFloat(
//                         formatEther(safeSimulation?.maxBoost ?? constants.Zero)
//                       ).toFixed(2)
//                     ),
//               titleTooltip: "The total boostable amount.",
//             },
//           ]}
//           mt={4}
//         />
//       </Box>
//     </Stack>
//   ),
//   buttons: ({
//     incrementStepIndex,
//     setDepositAmount,
//     depositAmount,
//     collateralBalance,
//   }) => [
//     {
//       children: "Skip",
//       variant: "cardmatte",
//       onClick() {
//         setDepositAmount("0");
//         incrementStepIndex();
//       },
//     },
//     {
//       disabled:
//         parseInt(depositAmount) > parseInt(collateralBalance) ? true : false,
//       children:
//         parseInt(depositAmount) > parseInt(collateralBalance)
//           ? "Invalid amount"
//           : "Review",
//       variant: "neutral",
//       onClick() {
//         incrementStepIndex();
//       },
//     },
//   ],
// };

// const MODAL_STEP_4: ModalStep = {
//   children: ({ underlyingTokenAddress, depositAmount, safeSimulation }) => (
//     <Box>
//       <Box textAlign="center">
//         <Text fontSize="lg">You are creating</Text>
//         <Heading mt={4}>
//           <TokenIcon tokenAddress={underlyingTokenAddress} />{" "}
//           <TokenSymbol tokenAddress={underlyingTokenAddress} /> Safe
//         </Heading>
//       </Box>
//       {!depositAmount || depositAmount === "0" ? null : (
//         <RariStats
//           mt={8}
//           statistics={[
//             ["Collateral deposited", `${utils.commify(depositAmount ?? "0")}`],
//             [
//               "USD Value",
//               `$${utils.commify(
//                 parseFloat(
//                   formatEther(safeSimulation?.collateralUSD ?? 0)
//                 ).toFixed(2)
//               )}`,
//             ],
//             [
//               "Max Boost",
//               `$${utils.commify(
//                 parseFloat(
//                   formatEther(safeSimulation?.maxBoost ?? constants.Zero)
//                 ).toFixed(2)
//               )}`,
//             ],
//           ]}
//         />
//       )}
//     </Box>
//   ),
//   stepBubbles: ({ approving, creatingSafe, hasApproval }) => ({
//     steps: hasApproval ? 1 : 2,
//     loading: approving || creatingSafe,
//     activeIndex: creatingSafe ? 1 : 0,
//     background: "neutral",
//   }),
//   buttons: ({
//     hasApproval,
//     approving,
//     depositAmount,
//     creatingSafe,
//     onClickCreateSafe,
//     onClickApprove,
//     incrementStepIndex,
//   }) => [
//     {
//       children: approving
//         ? "Approving..."
//         : creatingSafe
//         ? "Creating Safe..."
//         : !hasApproval &&
//           BigNumber.from(!!depositAmount ? depositAmount : "0").gt(0)
//         ? "Approve Router"
//         : BigNumber.from(!!depositAmount ? depositAmount : "0").gt(0)
//         ? "Create Safe & Deposit"
//         : "Create Safe",
//       variant: "neutral",
//       loading: approving || creatingSafe,
//       async onClick() {
//         try {
//           if (!hasApproval) {
//             await onClickApprove();
//           }
//           await onClickCreateSafe();
//           incrementStepIndex();
//         } catch (err) {
//           throw err;
//         }
//       },
//     },
//   ],
// };

const MODAL_STEP_5: ModalStep = {
  children: ({ underlyingTokenAddress }) => (
    <Stack alignItems="center" spacing={8}>
      <CheckCircleIcon boxSize={24} color="neutral" />
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
  buttons: ({ onClose, navigateToCreatedSafe, createdSafe, navigating }) => [
    {
      children: navigating ? "Loading..." : "View Safe",
      loading: navigating,
      disabled: !createdSafe,
      variant: "neutral",
      async onClick() {
        await navigateToCreatedSafe();
        onClose();
      },
    },
  ],
};

const MODAL_STEPS: ModalStep[] = [
  MODAL_STEP_1,
  MODAL_STEP_2,
  // MODAL_STEP_3,
  // MODAL_STEP_4,
  MODAL_STEP_5,
];

export { MODAL_STEPS };
export type { CreateSafeCtx };
