import {
  Heading,
  Skeleton,
  SkeletonCircle,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import AppLink from "components/shared/AppLink";
import { Column, Row } from "lib/chakraUtils";
import { SubgraphCToken } from "pages/api/explore";
import { convertMantissaToAPY, convertMantissaToAPR } from "utils/apyUtils";
import { useMemo } from "react";
import { shortUsdFormatter } from "utils/bigUtils";
import { RariApiTokenData } from "types/tokens";
import { usePoolInfo } from "hooks/usePoolInfo";
import { Pool } from "utils/poolUtils";
import { usePoolAPY } from "hooks/usePoolAPY";

export enum ExploreGridBoxMetric {
  TOTAL_BORROWS,
  TOTAL_SUPPLY,
  SUPPLY_RATE,
  BORROW_RATE,
}

// top earning stablecoin, newest yield agg, most popular asset, top earning asset, and most borrowed asset?
export const FuseAssetGridBox = ({
  bg,
  heading = "",
  data,
  tokenData,
  metric = ExploreGridBoxMetric.SUPPLY_RATE,
}: {
  bg?: string;
  heading?: string;
  data?: SubgraphCToken;
  tokenData?: RariApiTokenData;
  metric?: ExploreGridBoxMetric;
}) => {
  const loading = !data;

  const supplyRate = convertMantissaToAPY(data?.supplyRatePerBlock, 365);
  const monthlySupplyRate = supplyRate / 12;
  const weeklySupplyRate = monthlySupplyRate / 4;

  const borrowRate = convertMantissaToAPR(data?.borrowRatePerBlock);

  const subtitle: string = useMemo(() => {
    switch (metric) {
      case ExploreGridBoxMetric.SUPPLY_RATE:
        return `${supplyRate.toFixed(1)}%`;
        return `${weeklySupplyRate.toFixed(1)}% weekly, 
        ${monthlySupplyRate.toFixed(1)}% monthly`;
      case ExploreGridBoxMetric.BORROW_RATE:
        return `${borrowRate.toFixed(1)}%`;
      case ExploreGridBoxMetric.TOTAL_BORROWS:
        return `${shortUsdFormatter(parseFloat(data?.totalBorrowUSD ?? "0"))}`;
      case ExploreGridBoxMetric.TOTAL_SUPPLY:
        return `${shortUsdFormatter(parseFloat(data?.totalSupplyUSD ?? "0"))}`;
      default:
        return "";
    }
  }, [metric, monthlySupplyRate, weeklySupplyRate, data]);

  const subtitleDecoration: string = useMemo(() => {
    switch (metric) {
      case ExploreGridBoxMetric.SUPPLY_RATE:
        return `APY`;
      case ExploreGridBoxMetric.BORROW_RATE:
        return `APR`;
      // case ExploreGridBoxMetric.TOTAL_BORROWS:
      //   return `Borrowed`;
      // case ExploreGridBoxMetric.TOTAL_SUPPLY:
      //   return `Supplied`;
      default:
        return "";
    }
  }, [metric]);

  return (
    <AppLink
      href={
        data?.pool?.index
          ? `/fuse/pool/${data.pool.index}`
          : data?.underlying?.id
            ? `/token/${data?.underlying?.id}`
            : `#`
      }
      className="no-underline"
      w="100%"
      h="100%"
    >
      <Column
        w="100%"
        h="100%"
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        // border="1px solid #272727"
        p={5}
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          // bg="lime"
          flexGrow={0}
        >
          <Heading fontSize={["sm", "md", "lg", "xl"]}>{heading}</Heading>
        </Row>
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          mt="auto"
          w="100%"
          h="100%"
          // bg="aqua"
          flexGrow={1}
        >
          <Box mr={2}>
            <SkeletonCircle isLoaded={!loading} boxSize={["40px", "50px"]}>
              {tokenData?.logoURL && (
                <Avatar src={tokenData?.logoURL} h="100%" w="100%" />
              )}
            </SkeletonCircle>
          </Box>

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            mx={2}
          >
            <Box>
              <Skeleton
                isLoaded={!loading}
                height={loading ? "20px" : "100%"}
                my={1}
              >
                <HStack alignItems="flex-end">
                  <Heading
                    fontSize={["sm", "md", "2xl"]}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    {subtitle}
                  </Heading>
                  <Text fontSize={["sm"]} color="grey" ml={2}>
                    {subtitleDecoration}
                  </Text>
                </HStack>
              </Skeleton>
            </Box>
            <Box>
              <Text fontSize={["sm"]} color="grey">
                Pool {data?.pool?.index}
              </Text>
            </Box>
          </Column>
        </Row>
      </Column>
    </AppLink>
  );
};

export const VaultGridBox = ({
  bg,
  heading = "Newest Vault",
}: {
  bg?: string;
  heading?: string;
}) => {
  const poolAPY = usePoolAPY(Pool.USDC);
  const poolInfo = usePoolInfo(Pool.USDC);
  const loading = !poolAPY;

  console.log({ poolAPY });

  return (
    <AppLink href={"/pools/usdc"} className="no-underline" w="100%" h="100%">
      <Column
        w="100%"
        h="100%"
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        // border="1px solid #272727"
        p={5}
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          // bg="lime"
          flexGrow={0}
        >
          <Heading fontSize={["sm", "md", "lg", "xl"]}>{heading}</Heading>
        </Row>
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          mt="auto"
          w="100%"
          h="100%"
          // bg="aqua"
          flexGrow={1}
        >
          <Box mr={2}>
            <SkeletonCircle isLoaded={!loading} boxSize={["40px", "50px"]}>
              <Avatar src={poolInfo.poolLogo} h="100%" w="100%" />
            </SkeletonCircle>
          </Box>

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            mx={2}
          >
            <Box>
              <Skeleton
                isLoaded={!loading}
                height={loading ? "20px" : "100%"}
                my={1}
              >
                <HStack alignItems="flex-end">
                  <Heading
                    fontSize={["sm", "md", "2xl"]}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    {" "}
                    {poolInfo.poolName}
                  </Heading>
                  {/* <Text fontSize={["sm"]}>{subtitleDecoration}</Text> */}
                </HStack>
              </Skeleton>
            </Box>
            <Box color="grey">
              <Text fontSize={["sm"]}>{poolAPY}% APY</Text>
            </Box>
          </Column>
        </Row>
      </Column>
    </AppLink>
  );
};
