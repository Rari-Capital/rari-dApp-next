import {
  StatisticsTable,
  StatisticsTableProps,
  Tooltip,
} from "rari-components";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, HStack, Spinner, Text } from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { abbreviateAmount } from "utils/bigUtils";

/**
 * An `UpdatingStatistic` can either be a statistic with an initial value and
 * a new value, or a regular statistic (i.e. one that would be passed to a bare
 * `<StatisticsTable/>`).
 */
type UpdatingStatistic =
  | {
      title: string;
      tooltip: string;
      initialValue: number;
      newValue?: number | undefined;
    }
  | StatisticsTableProps["statistics"][number];

type UpdatingStatisticTableProps = Omit<StatisticsTableProps, "statistics"> & {
  statistics: UpdatingStatistic[];
};

/**
 * Composition of `<StatisticsTable />` specifically for displaying large
 * numeric statistics that update (use cases include displaying data related to
 * depositing, withdrawing, etc.).
 *
 * The component handles abbreviating long values and setting up tooltips which
 * display the full value on hover.
 *
 * Based on https://reactjs.org/docs/composition-vs-inheritance.html
 */
const UpdatingStatisticsTable: React.FC<UpdatingStatisticTableProps> = ({
  statistics,
  ...restProps
}) => {
  const UpdatingStatistics = statistics.map((it) => {
    // If this item is a regular statistic, skip processing.
    if (Array.isArray(it)) {
      return it;
    }

    const { title, tooltip, initialValue, newValue } = it;

    const value = (
      <Text fontWeight={600}>
        {!newValue ? (
          <Tooltip label={commify(initialValue)}>
            {abbreviateAmount(initialValue)}
          </Tooltip>
        ) : (
          <>
            <Tooltip label={commify(initialValue)}>
              {abbreviateAmount(initialValue)}
            </Tooltip>{" "}
            →{" "}
            <Tooltip label={commify(newValue)}>
              <Box as="span" color="neutral">
                {abbreviateAmount(newValue)}
              </Box>
            </Tooltip>
          </>
        )}
      </Text>
    );

    const statistic: StatisticsTableProps["statistics"][number] = [
      it.title,
      value,
      it.tooltip,
    ];
    return statistic;
  });

  return <StatisticsTable statistics={UpdatingStatistics} {...restProps} />;
};

const UpdatingStatistic: React.FC<{
  isLoading: boolean;
  statistic: UpdatingStatistic;
}> = ({ isLoading, statistic }) => {
  const { primaryValue, secondaryValue, primaryTooltip, secondaryTooltip } =
    statistic;

  if (isLoading) return <Spinner boxSize={"15px"} />;
  return (
    <HStack justify={"flex-end"}>
      <TextWithToolTip text={primaryValue} tooltip={primaryTooltip} />
      {!!secondaryValue && (
        <>
          <ArrowForwardIcon boxSize="15px" />
          <TextWithToolTip text={secondaryValue} tooltip={secondaryTooltip} />
        </>
      )}
    </HStack>
  );
};

const TextWithToolTip: React.FC<{ text: string; tooltip?: string }> = ({
  text,
  tooltip,
}) => {
  if (!!tooltip)
    return (
      <SimpleTooltip label={tooltip}>
        <Text>{text}</Text>
      </SimpleTooltip>
    );
  return <Text>{text}</Text>;
};

export default UpdatingStatisticsTable;
export type { UpdatingStatisticsTableProps };
