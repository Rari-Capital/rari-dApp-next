import { commify, formatEther, formatUnits } from "ethers/lib/utils";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import {
    Badge,
    Heading,
    HoverableCard,
    Link,
    Progress,
    Text,
    TokenIcon,
    TokenSymbol,
} from "rari-components";
import Tooltip from "rari-components/components/Tooltip";
import { abbreviateAmount } from "utils/bigUtils";
import {
    Box,
    Flex,
    HStack,
    Spacer,
    Stack,
} from "@chakra-ui/react";
import { StrategyInfosMap } from "hooks/turbo/useStrategyInfo";
import useSafeAvgAPY from "hooks/turbo/useSafeAvgAPY";
import { filterUsedStrategies } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { useTokenData } from "hooks/useTokenData";
import useShouldBoostSafe from "hooks/turbo/useShouldBoostSafe";

type SafeCardProps = {
    safe: SafeInfo;
    getERC4626StrategyData: StrategyInfosMap
};

const SafeCard: React.FC<SafeCardProps> = ({ safe, getERC4626StrategyData }) => {

    const usdPricedSafeInfo = useSafeInfo(safe.safeAddress)

    const avgAPY = useSafeAvgAPY(
        filterUsedStrategies(safe.strategies),
        getERC4626StrategyData,
        parseFloat(formatEther(safe?.tribeDAOFee ?? 0))
    )

    const tokenData = useTokenData(safe.collateralAsset)

    const boostMe = useShouldBoostSafe(safe)

    return (
        <Link href={`/turbo/safe/${safe.safeAddress}`}>
            <HoverableCard w="100%" variant="ghost" cursor="pointer" p={6}>
                {(hovered) => (
                    <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
                        <HStack justify={"start"}>
                            <TokenIcon
                                tokenAddress={safe.collateralAsset}
                                boxSize={10}
                                mr={2}
                            />
                            <Heading>
                                <TokenSymbol tokenAddress={safe.collateralAsset} />
                            </Heading>
                            <Spacer />
                            {boostMe && <Badge variant="success">Boost Me 🔥</Badge>}
                        </HStack>
                        <Stack spacing={2} mt={8} alignItems="flex-start" justify="stretch">
                            <Flex alignItems="baseline" flex={1}>
                                <Tooltip
                                    label={`${commify(formatUnits(safe.collateralAmount, tokenData?.decimals))} ${tokenData?.symbol}`}
                                >
                                    <>
                                        <Heading size="md">
                                            {abbreviateAmount(usdPricedSafeInfo?.collateralValueUSD)}
                                        </Heading>
                                        <Text variant="secondary" ml={2}>
                                            deposited
                                        </Text>
                                    </>
                                </Tooltip>
                            </Flex>
                            <Flex alignItems="baseline" flex={1}>
                                <Heading size="md">{avgAPY.toFixed(2)}%</Heading>
                                <Text variant="secondary" ml={2}>
                                    APY
                                </Text>
                            </Flex>
                        </Stack>
                        <Box mt={8}>
                            <HStack mb={2} align="start">
                                <Text variant="secondary" mb={2}>
                                    Active boost
                                </Text>
                            </HStack>
                            <Progress
                                height={3}
                                hideLabel
                                value={safe.safeUtilization.toNumber()}
                            />
                        </Box>
                    </Box>
                )}
            </HoverableCard>
        </Link>
    );
};

export default SafeCard