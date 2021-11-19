import {
  Heading,
  Skeleton,
  SkeletonCircle,
  Box,
  HStack,
  Text,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import AppLink from "components/shared/AppLink";
import { Column, Row } from "lib/chakraUtils";
import { SubgraphCToken, SubgraphPool } from "pages/api/explore";
import { convertMantissaToAPY, convertMantissaToAPR } from "utils/apyUtils";
import { useMemo } from "react";
import { shortUsdFormatter } from "utils/bigUtils";
import { RariApiTokenData } from "types/tokens";

export enum ExploreGridBoxMetric {
  TOTAL_BORROWS,
  TOTAL_SUPPLY,
  SUPPLY_RATE,
  BORROW_RATE,
}

// top earning stablecoin, newest yield agg, most popular asset, top earning asset, and most borrowed asset?
export const FuseAssetBoxNew = ({
  bg,
  heading = "",
  tokenData,
  metric = ExploreGridBoxMetric.SUPPLY_RATE,
  balance,
  pool,
  assetIndex,
}: {
  bg?: string;
  heading?: string;
  tokenData?: RariApiTokenData;
  metric?: ExploreGridBoxMetric;
  balance?: number;
  pool: SubgraphPool | undefined;
  assetIndex: number;
}) => {
  const data = pool?.assets[assetIndex];

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

  return (
    <AppLink
      href={
        pool?.index
          ? `/fuse/pool/${pool.index}`
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
        // maxW="200px"
        //  bg="lime"
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          w="100%"
          flexGrow={1}
          p={3}
        >
          <Heading fontSize={["sm", "md", "lg", "xl"]}>{heading}</Heading>
          <Box mr={2}>
            <SkeletonCircle isLoaded={!loading} boxSize={["30px", "40px"]}>
              {tokenData?.logoURL && (
                <Avatar src={tokenData?.logoURL} h="100%" w="100%" />
              )}
            </SkeletonCircle>
          </Box>
          <Box maxWidth="275px">
            <Skeleton
              isLoaded={!loading}
              height={loading ? "20px" : "100%"}
              maxWidth="100%"
              my={1}
            >
              <HStack alignItems="flex-end">
                <Heading fontSize={["sm", "md", "2xl"]} isTruncated={true}>
                  {pool?.name}
                </Heading>
              </HStack>
            </Skeleton>
          </Box>
          <Box>
                 
          </Box>
        </Row>
        <Divider background="#121212" />
        <Row
          mainAxisAlignment="space-around"
          crossAxisAlignment="flex-start"
          mt="auto"
          w="100%"
          h="100%"
          // bg="aqua"
          flexGrow={1}
          p={3}
        >
          <VStack alignItems="flex-start">
            <HStack>
              <Avatar src={tokenData?.logoURL} h="15px" w="15px" mr={0} />
              <Text fontSize={["sm"]} color="grey">
                Supply APY
              </Text>
            </HStack>
            <Skeleton
              isLoaded={!loading}
              height={loading ? "20px" : "100%"}
              my={1}
            >
              <Heading
                fontSize={["sm", "md", "2xl"]}
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
              >
                {subtitle}
              </Heading>
            </Skeleton>
          </VStack>
          <VStack alignItems="flex-start">
            <Text fontSize={["sm"]} color="grey">
              You have
            </Text>
            <Skeleton
              isLoaded={!loading}
              height={loading ? "20px" : "100%"}
              my={1}
            >
              <Heading fontSize={["sm", "md", "2xl"]}>
                {balance?.toFixed(2)} {tokenData?.symbol}
              </Heading>
            </Skeleton>
          </VStack>
        </Row>
      </Column>
    </AppLink>
  );
};

export default FuseAssetBoxNew;
