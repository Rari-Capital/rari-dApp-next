import { motion } from "framer-motion";
import {
    Badge,
    Card,
    Heading,
    Text,
} from "rari-components";

import {
    Box,
    HStack,
} from "@chakra-ui/react";
import { useTurboSafe } from "context/TurboSafeContext";
import { CheckIcon } from "@chakra-ui/icons";


export const OnboardingCard: React.FC<{
    openDepositModal: () => void;
}> = ({ openDepositModal }) => {
    const { safe } = useTurboSafe()
    const { collateralAmount, boostedAmount } = safe ?? {}

    const hasCollateral = collateralAmount?.isZero() ? false : true
    const hasBoosted = boostedAmount?.isZero() ? false : true

    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
        >
            <Card>
                <Heading size="lg">Getting Started</Heading>
                <HStack mt={12} spacing={8}>
                    <HStack flex={1} spacing={6}
                        opacity={0.8}
                        _hover={!hasCollateral ? { cursor: "pointer", opacity: "1" } : {}}
                    >
                        <Badge
                            variant="neutral"
                            fontSize="lg"
                            boxSize={12}
                            onClick={openDepositModal}
                        >
                            {hasCollateral ? <CheckIcon /> : <Heading size="lg">1</Heading>}
                        </Badge>
                        <Box>
                            <Heading size="md">Deposit collateral</Heading>
                            <Text variant="secondary">
                                Collateralizing is required step before boosting pools.
                            </Text>
                        </Box>
                    </HStack>
                    <HStack flex={1} spacing={6}
                        opacity={0.8}
                        _hover={{ cursor: "pointer", opacity: "1" }}
                    >
                        <Badge variant="neutral" fontSize="lg" boxSize={12} opacity={0.8}>
                            {hasBoosted ? <CheckIcon /> : <Heading size="lg">2</Heading>}
                        </Badge>
                        <Box>
                            <Heading size="md">Boost a Vault</Heading>
                            <Text variant="secondary">
                                Click to boost a random Vault, or scroll below for options.
                            </Text>
                        </Box>
                    </HStack>
                </HStack>
            </Card>
        </motion.div>
    );
};

