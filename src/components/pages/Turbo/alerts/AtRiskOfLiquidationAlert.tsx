import { BigNumber } from 'ethers';
import { motion } from "framer-motion";
import React from 'react'
import {
    Alert,
    AlertIcon,
    Box,
} from "@chakra-ui/react"
import { Text } from 'rari-components';
import theme from 'rari-components/theme';

const AtRiskOfLiquidationAlert: React.FC<{ safeHealth: BigNumber | undefined }> = ({
    safeHealth,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
        >
            <Alert colorScheme={theme.colors.danger} borderRadius={5} mb={10}>
                <AlertIcon />
                <Text>
                    With a <b>{safeHealth?.toNumber()}%</b> utilization, you are at
                    liquidation risk. Please <b>deposit more collateral</b>, or <b>unboost</b>.
                </Text>
                <Box h="100%" ml="auto"></Box>
            </Alert>
        </motion.div>
    );
};


export default AtRiskOfLiquidationAlert

