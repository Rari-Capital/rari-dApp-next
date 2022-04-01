import { InfoIcon } from "@chakra-ui/icons";
import { Spinner, Table, Tbody, Td, Tr, Text, HStack } from "@chakra-ui/react";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { Card } from "rari-components";

type Statistic = {
    title: string;
    primaryValue: string;
    secondaryValue?: string;
    titleTooltip?: string;
    primaryTooltip?: string;
    secondaryTooltip?: string;
}

type StatisticTableProps = React.ComponentProps<typeof Card> & {
    statistics: Statistic[];
    isLoading?: boolean;
};

/**
 * A component that displays a two-column table of statistics — statistic titles
 * on the left column, statistic values on the right column.
 */
const StatisticTable: React.FC<StatisticTableProps> = ({
    statistics,
    isLoading = false,
    ...restProps
}) => {
    return (
        <Card borderWidth={1} {...restProps}>
            <Table>
                <Tbody>
                    {statistics.map((statistic) => (
                        <Tr
                            key={statistic.title}
                            _first={{
                                td: {
                                    paddingTop: 0,
                                },
                            }}
                            _last={{
                                td: {
                                    paddingBottom: 0,
                                },
                            }}
                        >
                            <Td
                                paddingX={0}
                                paddingY={2}
                                borderBottom="none"
                                textAlign="left"
                                alignItems={"baseline"}
                            >
                                <HStack>
                                    {
                                        !!statistic.titleTooltip && (
                                            <SimpleTooltip label={statistic.titleTooltip}>
                                                <InfoIcon mr={1} />
                                            </SimpleTooltip>
                                        )
                                    }
                                    <Text>
                                        {statistic.title}
                                    </Text>
                                </HStack>
                            </Td>
                            <Td
                                paddingX={0}
                                paddingY={2}
                                borderBottom="none"
                                textAlign="right"
                                fontWeight={600}
                            >
                                <StatisticValue
                                    isLoading={isLoading}
                                    statistic={statistic}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Card>
    );
};


const StatisticValue: React.FC<{
    isLoading: boolean,
    statistic: Statistic,
}> = ({
    isLoading,
    statistic,

}) => {
        const {
            primaryValue,
            secondaryValue,
            primaryTooltip,
            secondaryTooltip
        } = statistic;

        if (isLoading) return <Spinner boxSize={"15px"} />
        return (
            <HStack justify={"flex-end"}>
                <TextWithToolTip text={primaryValue} tooltip={primaryTooltip} />
                {!!secondaryValue && (
                    <>
                        <Text>
                            {"->"}
                        </Text>
                        <TextWithToolTip text={secondaryValue} tooltip={secondaryTooltip} />
                    </>
                )}

            </HStack>
        )
    }

const TextWithToolTip: React.FC<
    { text: string, tooltip?: string }
> = ({ text, tooltip }) => {
    if (!!tooltip) return (
        <SimpleTooltip label={tooltip}>
            <Text>{text}</Text>
        </SimpleTooltip>
    )
    return <Text>{text}</Text>
}

export default StatisticTable;
export type { StatisticTableProps };
