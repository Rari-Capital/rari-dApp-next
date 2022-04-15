import { commify } from "ethers/lib/utils";
import {
  StatisticsTable,
  StatisticsTableProps,
  Tooltip,
} from "rari-components";
import { abbreviateAmount } from "utils/bigUtils";
import { Box, Text } from "@chakra-ui/react";

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
  | StatisticsTableProps["statistics"][number]
  | null;

type UpdatingStatisticsTableProps = Omit<StatisticsTableProps, "statistics"> & {
  statistics: UpdatingStatistic[];
  colorScheme: string;
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
const UpdatingStatisticsTable: React.FC<UpdatingStatisticsTableProps> = ({
  statistics,
  colorScheme,
  ...restProps
}) => {
  const updatingStatistics = statistics.map((it) => {
    // If this item is a regular statistic, skip processing.
    if (Array.isArray(it) || it === null) {
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
            <Box color={colorScheme} as="span">
              →{" "}
              <Tooltip label={commify(newValue)}>
                <Box as="span">
                  {abbreviateAmount(newValue)}
                </Box>
              </Tooltip>
            </Box>
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

  return <StatisticsTable statistics={updatingStatistics} {...restProps} />;
};

export default UpdatingStatisticsTable;
export type { UpdatingStatisticsTableProps };
