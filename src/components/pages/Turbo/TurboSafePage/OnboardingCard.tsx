import { motion } from "framer-motion";
import { Badge, Card, Heading, Text } from "rari-components";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { useTurboSafe } from "context/TurboSafeContext";
import { ArrowLeftIcon, CheckIcon } from "@chakra-ui/icons";

type OnboardingCardProps = {
  openDepositModal: () => void;
  onClickBoost: (strategyAddress: string) => void;
};

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  openDepositModal,
  onClickBoost,
}) => {
  const { safe } = useTurboSafe();
  const { collateralAmount, boostedAmount } = safe ?? {};

  const hasCollateral = collateralAmount?.isZero() ? false : true;
  const hasBoosted = boostedAmount?.isZero() ? false : true;

  const _handleClickBoost = () => {
    const pool8Fei = safe?.strategies[0].strategy ?? "";
    if (!pool8Fei) {
      return;
    }
    onClickBoost(pool8Fei);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
    >
      <Card>
        <Heading size="lg">Getting Started</Heading>
        <Stack mt={12} spacing={8} direction={["column", "column", "row"]}>
          <HStack
            flex={1}
            spacing={6}
            _hover={!hasCollateral ? { cursor: "pointer", opacity: "0.5" } : {}}
            transition="opacity 0.2s ease"
            onClick={() => (hasCollateral ? null : openDepositModal())}
            opacity={hasCollateral ? 0.25 : 1}
          >
            <Badge
              background={hasCollateral ? "gray" : "neutral"}
              variant="light"
              fontSize="lg"
              boxSize={12}
            >
              {hasCollateral ? <CheckIcon /> : <Heading size="lg">1</Heading>}
            </Badge>
            <Box>
              <Heading size="md">
                Deposit collateral{hasCollateral ? "" : "  →"}
              </Heading>
              <Text variant="secondary">
                Collateralizing is required step before boosting pools.
              </Text>
            </Box>
          </HStack>
          <HStack
            flex={1}
            spacing={6}
            _hover={
              !hasCollateral || hasBoosted
                ? undefined
                : { cursor: "pointer", opacity: "0.5" }
            }
            transition="opacity 0.2s ease"
            onClick={_handleClickBoost}
            opacity={!hasCollateral || hasBoosted ? 0.25 : 1}
          >
            <Badge
              background={!hasCollateral || hasBoosted ? "gray" : "neutral"}
              variant="light"
              fontSize="lg"
              boxSize={12}
            >
              {hasBoosted ? <CheckIcon /> : <Heading size="lg">2</Heading>}
            </Badge>
            <Box>
              <Heading size="md">Boost a pool</Heading>
              <Text variant="secondary">
                Click to boost your first pool, or scroll below for options
              </Text>
            </Box>
          </HStack>
        </Stack>
      </Card>
    </motion.div>
  );
};
