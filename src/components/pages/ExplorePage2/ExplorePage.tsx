import Image from "next/image";
import { Heading, Menu, MenuList, useBreakpointValue } from "@chakra-ui/react";
import DashboardBox from "components/shared/DashboardBox";
import { APYWithRefreshMovingStat } from "components/shared/MovingStat";
import { Box, Center, SimpleGrid, Spacer, Text } from "@chakra-ui/layout";
import {
  ExploreGridBoxMetric,
  FuseAssetGridBox,
  VaultGridBox,
} from "./ExploreGridBox";

// Hooks
import { useTVLFetchers } from "hooks/useTVL";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { Column, Row } from "lib/chakraUtils";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { APIExploreData, SubgraphPool } from "pages/api/explore";
import useSWR from "swr";

import axios from "axios";
import { makeGqlRequest } from "utils/gql";
import { GET_TOP_FUSE_POOLS } from "gql/fusePools/getTopFusePools";
import { getUniqueTokensForFusePools } from "utils/gqlFormatters";
import { fetchTokensAPIDataAsMap } from "utils/services";
import { TokensDataMap } from "types/tokens";
import HomeFuseCard from "../Home/HomeFuseCard";

// Fetchers
const exploreFetcher = async (route: string): Promise<APIExploreData> => {
  // const data = await getExploreData();
  // console.log({ data });
  const { data }: { data: APIExploreData } = await axios.get(route);

  return data;
};

const topFusePoolsFetcher = async (
  route: string
): Promise<{ pools: SubgraphPool[]; tokensData: TokensDataMap }> => {
  // const data = await getExploreData();
  // console.log({ data });
  const { pools }: { pools: SubgraphPool[] } = await makeGqlRequest(
    GET_TOP_FUSE_POOLS
  );
  const tokenAddresses = getUniqueTokensForFusePools(pools);
  const tokensData = await fetchTokensAPIDataAsMap([
    ...Array.from(tokenAddresses),
  ]);

  return { pools, tokensData };
};

const ExplorePage = () => {
  const { getNumberTVL } = useTVLFetchers();
  const { t } = useTranslation();

  const paddingX = useBreakpointValue({ base: 5, sm: 5, md: 10, lg: 10 });

  // Data
  // Fetchers
  const { data, error } = useSWR("/api/explore", exploreFetcher);
  const { data: topFusePools } = useSWR("/poop", topFusePoolsFetcher);
  const { results, tokensData } = data ?? {};
  const { pools: topPools, tokensData: topFusePoolsTokensData } =
    topFusePools ?? { pools: [], tokensData: {} };

  console.log({ topPools, topFusePools });

  const {
    topEarningFuseStable,
    topEarningFuseAsset,
    mostPopularFuseAsset,
    mostBorrowedFuseAsset,
    cheapestStableBorrow,
  } = results ?? {};

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      color="#FFFFFF"
      px={paddingX}
      mt={5}
      width="100%"
    >
      {/* Top Row */}
      {/* <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        mb={5}
      >
        <APYWithRefreshMovingStat
          formatStat={smallUsdFormatter}
          fetchInterval={40000}
          loadingPlaceholder="$?"
          apyInterval={100}
          fetch={getNumberTVL}
          queryKey={"totalValueLocked"}
          apy={0.15}
          statSize={statsSize!}
          captionSize={captionSize!}
          caption={t("The Rari Protocol currently secures") + ":"}
          crossAxisAlignment="flex-start"
          captionFirst={true}
        />
      </Row> */}

      {/* Main Row */}
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        mb={5}
        h="350px"
        // bg="red"
      >
        <Box w="100%" h="100%" bg="pink" px={8} py={2}>
          <DashboardBox bg="aqua" w="100%" h="100%" p={2}></DashboardBox>
        </Box>

        <Spacer />
        <Box bg="" w="100%" h="100%" px={8} py={2}>
          <SimpleGrid columns={2} spacing={5} w="100%" h="100%">
            <HoverCard height="100%">
              <FuseAssetGridBox
                data={topEarningFuseAsset}
                tokenData={
                  topEarningFuseAsset
                    ? tokensData?.[topEarningFuseAsset?.underlying.address]
                    : undefined
                }
                heading="Top Lend APY"
              />
            </HoverCard>
            <HoverCard height="100%">
              <FuseAssetGridBox
                data={cheapestStableBorrow}
                tokenData={
                  cheapestStableBorrow
                    ? tokensData?.[cheapestStableBorrow?.underlying.address]
                    : undefined
                }
                heading="Top Stable Borrow"
                metric={ExploreGridBoxMetric.BORROW_RATE}
              />
            </HoverCard>
            <HoverCard height="100%">
              <FuseAssetGridBox
                data={mostPopularFuseAsset}
                tokenData={
                  mostPopularFuseAsset
                    ? tokensData?.[mostPopularFuseAsset?.underlying.address]
                    : undefined
                }
                heading="Most Supplied"
                metric={ExploreGridBoxMetric.TOTAL_SUPPLY}
              />
            </HoverCard>
            <HoverCard height="100%">
              <VaultGridBox />
            </HoverCard>
          </SimpleGrid>
        </Box>
      </Row>

      {/* Recommended Row */}
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        h="250px"
        // bg="purple"
        px={8}
        py={4}
      >
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          h="100%"
          // bg="coral"
        >
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            w="100%"
            // h="20px"
          >
            <Heading>Recommended</Heading>
            <Text ml={3} color="grey">
              based on your positions
            </Text>
          </Row>
          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="flex-start"
            w="100%"
            h="100%"
            expand={true}
            flex={1}
            py={4}
          >
            <HoverCard w="100%" h="100%" mx={5} ml={0}>
              <FuseAssetGridBox
                data={topEarningFuseAsset}
                tokenData={
                  topEarningFuseAsset
                    ? tokensData?.[topEarningFuseAsset?.underlying.address]
                    : undefined
                }
              />
            </HoverCard>
            <HoverCard w="100%" h="100%" mx={5} />
            <HoverCard w="100%" h="100%" mx={5} mr={0} />
          </Row>
        </Column>
      </Row>

      {/* Top Fuse Pools */}
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        h="250px"
        bg="lime"
        px={8}
        py={4}
      >
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          h="100%"
          bg="coral"
        >
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            w="100%"
            // h="20px"
          >
            <Heading>Top Fuse Pools</Heading>
          </Row>
          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="flex-start"
            w="100%"
            h="100%"
            expand={true}
            flex={1}
            py={3}
          >
            {topPools.map((pool) => {
              return (
                <HoverCard w="100%" h="100%" mx={5}>
                  <HomeFuseCard
                    pool={pool}
                    tokensData={topFusePoolsTokensData}
                  />
                </HoverCard>
              );
            })}
          </Row>
        </Column>
      </Row>
    </Column>
  );
};

const HoverCard = ({
  children,
  ...boxProps
}: {
  children?: ReactNode;
  [x: string]: any;
}) => {
  return (
    <DashboardBox
      border="none"
      _hover={{ transform: "scale(1.02)", cursor: "pointer", bg: "#272727" }}
      {...boxProps}
    >
      {children}
    </DashboardBox>
  );
};

export default ExplorePage;
