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
    const { usdPricedSafe, collateralTokenData: tokenData, colorScheme } = useTurboSafe();
    const { boostedUSD, collateralUSD, safeUtilization } = usdPricedSafe ?? {}

    return (
        <Box mt={12}>
            <Flex justifyContent="space-between" alignItems="baseline">
                <Flex alignItems="baseline">
                    <Image
                        boxSize={"30px"}
                        src="/static/turbo/turbo-engine-green.svg"
                        align={"center"}
                        mr={2}
                    />
                    <Heading variant="success" size="lg" mr={2}>
                        {shortUsdFormatter(boostedUSD ?? 0)} boosted
                    </Heading>
                    <Text variant="neutral">
                        / {shortUsdFormatter(collateralUSD ?? 0)} ({toInt(safeUtilization)}
                        %)
                    </Text>
                </Flex>
                <Text variant="secondary">
                    Liquidated when{" "}
                    <TokenIcon
                        tokenAddress={tokenData?.address ?? ""}
                        boxSize={6}
                        mx={1}
                    />
                    $0.25
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