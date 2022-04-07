// Components
import {
    Heading,
    Progress,
    Text,
    TokenIcon,
} from "rari-components";
import {
    Box,
    Flex,
    Image,
} from "@chakra-ui/react";
import { useTurboSafe } from "context/TurboSafeContext";
import { shortUsdFormatter } from "utils/bigUtils";
import { toInt } from "utils/ethersUtils";


export const BoostBar: React.FC = () => {
    const {
        usdPricedSafe,
        collateralTokenData: tokenData,
        colorScheme,
        isAtLiquidationRisk
    } = useTurboSafe();
    const { boostedUSD, safeUtilization, maxBoostUSD, liquidationPriceUSD } = usdPricedSafe ?? {}

    return (
        <Box my={12}>
            <Flex justifyContent="space-between" alignItems="baseline" >
                <Flex alignItems="baseline" justifyContent="baseline">
                    <Image
                        src={isAtLiquidationRisk
                            ? "/static/turbo/turbo-engine-red.svg"
                            : "/static/turbo/turbo-engine-green.svg"
                        }
                        boxSize={10}
                        alignSelf="flex-end"
                        pb={2}
                    />
                    <Heading
                        variant="success"
                        size="xl"
                        mx={2}
                        color={colorScheme}
                        fontWeight="light"                    >
                        {shortUsdFormatter(boostedUSD ?? 0)} boost
                    </Heading>
                    <Text variant="neutral">
                        / {shortUsdFormatter(maxBoostUSD ?? 0)} ({toInt(safeUtilization)}
                        %)
                    </Text>
                </Flex>
                <Text variant="secondary">
                    Liquidated when{" "}
                    <TokenIcon
                        tokenAddress={tokenData?.address ?? ""}
                        boxSize={6}
                        mx={1}
                    />=
                    ${liquidationPriceUSD?.toFixed(2)}
                </Text>
            </Flex>
            <Progress
                size="xs"
                width="100%"
                height={4}
                mt={4}
                hideLabel
                barVariant={colorScheme}
                value={toInt(safeUtilization)}
            />
        </Box>
    );
};