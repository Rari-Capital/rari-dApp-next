import { InfoIcon } from "@chakra-ui/icons";
import {  Spinner, Table, Tbody, Td, Tr, Text, HStack } from "@chakra-ui/react";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { Card } from "rari-components";
import { ReactNode } from "react";

type Statistic = {
    title: string;
    primaryValue: string;
    secondaryValue?: string;
    titleTooltip?: string;
    primaryTooltip?: ReactNode;
    secondaryTooltip?: ReactNode;
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
                                {
                                    !!statistic.titleTooltip && (
                                        <SimpleTooltip label={statistic.titleTooltip}>
                                            <InfoIcon />
                                        </SimpleTooltip>
                                    )
                                }
                                {statistic.title}
                            </Td>
                            <Td
                                paddingX={0}
                                paddingY={2}
                                borderBottom="none"
                                textAlign="right"
                                fontWeight={600}
                            >
                                <StatisticValue isLoading={isLoading} statistic={statistic} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Card>
    );
};


// TODO (@nathanhleung) - stack horizontally
const StatisticValue: React.FC<{
    isLoading: boolean,
    statistic: Statistic,
}> = ({ isLoading, statistic }) => {
    const { primaryValue, secondaryValue } = statistic;
    if (isLoading) return <Spinner boxSize={"15px"} />
    return (
        <>

            <Text>{primaryValue}</Text>
            {!!secondaryValue && (
                <Text>
                    {"->"} {secondaryValue}
                </Text>
            )}

        </>
    )
}

export default StatisticTable;
export type { StatisticTableProps };
