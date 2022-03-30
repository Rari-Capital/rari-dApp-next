import { isString } from "lodash";
import { Box, BoxProps, useStyleConfig, Heading, Text, HStack } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

type StatisticProps = BoxProps & {
    title: string;
    value: React.ReactNode;
    valueFontSize?: string;
    secondaryValueFontSize?: string;
    secondaryValue?: string;
    tooltip?: string;
    loading?: boolean;
    variant?: string;
};

/**
 * A component which displays a statistic's title (smaller text) and value
 * (larger text).
 */
const Statistic: React.FC<StatisticProps> = ({
    title,
    tooltip,
    loading = false,
    value,
    secondaryValue,
    variant,
    valueFontSize = "lg",
    secondaryValueFontSize = "sm",
    ...restProps
}) => {
    // See https://github.com/chakra-ui/chakra-ui/issues/2456 for more info
    const { color } = useStyleConfig("Statistic", { variant }) as {
        color: string;
    };

    return (
        <Box mr={4} textAlign="left" {...restProps}>
            <HStack align={"baseline"}>
                <Text fontSize="sm" mb={2} color={color} opacity={0.5}>
                    {title}
                </Text>
                {tooltip && (
                    <SimpleTooltip label={tooltip}>
                        <InfoOutlineIcon boxSize={"12px"} />
                    </SimpleTooltip>
                )}
            </HStack>
            {isString(value) ? (
                <Heading size={valueFontSize} color={color}>
                    {value}
                </Heading>
            ) : (
                value
            )}
            {!!secondaryValue && <Text variant="secondary">{secondaryValue}</Text>}
        </Box>
    );
};

export default Statistic;
export type { StatisticProps };
