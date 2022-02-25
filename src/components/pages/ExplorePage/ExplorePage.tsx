import {
  Heading,
  useBreakpointValue,
  Image,
  Collapse,
  PopoverCloseButton,
} from "@chakra-ui/react";
import DashboardBox from "components/shared/DashboardBox";

import {
  Box,
  Stack,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/layout";

import {
  ExploreGridBoxMetric,
  FuseAssetGridBox,
  VaultGridBox,
} from "./ExploreGridBox";

// Hooks
import { ReactNode, useEffect, useMemo, useState } from "react";

// Utils
import { Column, Row, RowOrColumn } from "lib/chakraUtils";

import { APIExploreData, SubgraphPool } from "pages/api/explore";
import useSWR from "swr";

import axios from "axios";
import { makeGqlRequest } from "utils/gql";
import { GET_TOP_FUSE_POOLS } from "gql/fusePools/getTopFusePools";
import { getUniqueTokensForFusePools } from "utils/gqlFormatters";
import { fetchTokensAPIDataAsMap } from "utils/services";
import { TokensDataMap } from "types/tokens";

import ExploreFuseCard from "./ExploreFuseBox";

import { useAccountBalances } from "context/BalancesContext";
import { GET_RECOMMENDED_POOLS } from "gql/fusePools/getRecommendedPools";
import { GET_UNDERLYING_ASSETS_WITH_POOLS } from "gql/fusePools/getUnderlyingAssetsWithPools";
import TokenExplorer from "./TokenExplorer";
import AppLink from "components/shared/AppLink";
import { ChainID } from "esm/utils/networks";
import { useRari } from "context/RariContext";
import { useRouter } from "next/router";

// Fetchers
const exploreFetcher = async (route: string): Promise<APIExploreData> => {
  // const data = await getExploreData();
  const { data }: { data: APIExploreData } = await axios.get(route);

  return data;
};

const topFusePoolsFetcher = async (
  chainId: ChainID
): Promise<SubgraphPool[]> => {
  // const data = await getExploreData();
  const { pools }: { pools: SubgraphPool[] } = await makeGqlRequest(
    GET_TOP_FUSE_POOLS,
    {},
    chainId
  );
  return pools;
};

interface RecommendedMarketsMap {
  [tokenAddress: string]: {
    bestSupplyRate: string;
    poolId: string;
    assetIndex: number;
  };
}

type RecommendedPoolDataMap = { [token: string]: SubgraphPool };

interface RecommendedPoolsReturn {
  recommended: RecommendedMarketsMap;
  poolsMap: RecommendedPoolDataMap;
}

const recommendedPoolsFetcher = async (
  chainId: number,
  ...tokenAddresses: string[]
): Promise<RecommendedPoolsReturn> => {
  // Get all pools where any of these tokens exist
  const { underlyingAssets } = await makeGqlRequest(
    GET_UNDERLYING_ASSETS_WITH_POOLS,
    {
      tokenAddresses,
    },
    chainId
  );

  const underlyingAssetsMap: {
    [token: string]: any;
  } = underlyingAssets.reduce(function (map: any, underlyingAsset: any) {
    map[underlyingAsset.address] = underlyingAsset;
    return map;
  }, {});

  const _uniquePools = new Set();
  for (let i = 0; i < underlyingAssets.length; i++) {
    const asset = underlyingAssets[i];
    asset.pools.forEach((pool: any) => _uniquePools.add(pool.id));
  }
  const uniquePools = [...Array.from(_uniquePools)] as string[];

  // Get Pools data
  const { pools }: { pools: SubgraphPool[] } = await makeGqlRequest(
    GET_RECOMMENDED_POOLS,
    {
      poolIds: uniquePools,
      tokenIds: tokenAddresses,
    },
    chainId
  );

  let poolsMap: {
    [token: string]: SubgraphPool;
  } = pools.reduce(function (map: any, pool: any) {
    map[pool.id] = pool;
    return map;
  }, {});

  const map: RecommendedMarketsMap = {};

  for (let token of tokenAddresses) {
    const tokenData: {
      address: string;
      symbol: string;
      pools: { index: number; id: string }[];
    } = underlyingAssetsMap[token];

    const { pools } = tokenData;
    pools.forEach(({ id }) => {
      const pool = poolsMap[id];
      if (!!pool) {
        const assetIndex = pool.assets.findIndex(
          (asset) => asset.underlying.id === token
        );
        if (assetIndex < 0) return;

        const cToken = pool.assets[assetIndex];

        if (!!cToken) {
          // Create default if doesn't exist in map
          if (!map[token]) {
            map[token] = {
              bestSupplyRate: cToken.supplyAPY,
              poolId: id,
              assetIndex,
            };
          } else {
            // Update best supply rate
            if (
              parseFloat(cToken.supplyAPY) >
              parseFloat(map[token].bestSupplyRate)
            ) {
              map[token] = {
                bestSupplyRate: cToken.supplyAPY,
                poolId: id,
                assetIndex,
              };
            }
          }
        }
      }
    });
  }

  // reduce poolsMap to only pools which were recommended
  const recommendedPoolDataMap = Object.values(
    map
  ).reduce<RecommendedPoolDataMap>((acc, { poolId }) => {
    acc[poolId] = poolsMap[poolId];
    return acc;
  }, {});
  poolsMap = {};

  return {
    recommended: map,
    poolsMap: recommendedPoolDataMap,
  };
};

const useRecommendedPools = (tokens: string[]): RecommendedPoolsReturn => {
  const { chainId } = useRari();
  const { data } = useSWR([chainId, ...tokens], recommendedPoolsFetcher);
  return (
    data ?? {
      recommended: {},
      poolsMap: {},
    }
  );
};

const ExplorePage = () => {
  // const { getNumberTVL } = useTVLFetchers();
  // const { t } = useTranslation();
  const { chainId, switchNetwork } = useRari();
  const router = useRouter();

  const paddingX = useBreakpointValue({ base: 5, sm: 5, md: 15, lg: 20 });
  const isMobile =
    useBreakpointValue({
      base: true,
      sm: true,
      md: true,
      lg: false,
    }) ?? false;

  // Data
  // Fetchers
  const { data, error } = useSWR(
    "/api/explore?chainId=" + chainId,
    exploreFetcher
  );
  const { data: topFusePools } = useSWR(
    [chainId, "topFusePools"],
    topFusePoolsFetcher
  );
  const { results } = data ?? {};

  const topPools = topFusePools ?? [];

  const [balances, significantTokens] = useAccountBalances();

  const { recommended, poolsMap } = useRecommendedPools(significantTokens);

  const [tokensData, setTokensData] = useState<any>({});

  const recommendedTokens = useMemo(
    () =>
      Object.keys(recommended).length
        ? Object.keys(recommended)
        : ["a", "b", "c"],
    [recommended]
  );

  const hasBalances = useMemo(
    () => !!significantTokens.length,
    [significantTokens]
  );
  const shouldShowRecommendedPools = chainId === 1 && hasBalances;

  const {
    topEarningFuseStable,
    topEarningFuseAsset,
    mostPopularFuseAsset,
    mostBorrowedFuseAsset,
    cheapestStableBorrow,
  } = results ?? {};

  useEffect(() => {
    const exploreDataUnderlyingAddresses = Object.values(results ?? {})
      .map((cToken) => {
        return cToken?.underlying.address;
      })
      .filter((address): address is string => !!address);
    const poolUnderlyingAddresses = Object.values(poolsMap).flatMap((pool) => {
      return pool.assets.map((asset) => asset.underlying.id);
    });
    const addresses = [
      ...exploreDataUnderlyingAddresses,
      ...poolUnderlyingAddresses,
    ];

    fetchTokensAPIDataAsMap(addresses, chainId).then((tokensData) => {
      if (Object.keys(tokensData).length > 0) {
        setTokensData(tokensData);
      }
    });
  }, [poolsMap, chainId, results]);

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      color="#FFFFFF"
      px={paddingX}
      mt={5}
      width="100%"
    >
      {/* Main Row */}
      <RowOrColumn
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        isRow={!isMobile}
        w="100%"
        mb={5}
        height={isMobile ? "100%" : "350px"}
        bg=""
      >
        <Box w="100%" h="100%" bg="" px={8} py={2}>
          <DashboardBox
            bg="#272727"
            w="100%"
            h="100%"
            p={0}
            _hover={{
              cursor: "pointer",
              opacity: 1,
              boxShadow: "0px .2px 4px grey;",
              transform: "translateY(-7px) scale(1.00)",
            }}
            transition="transform 0.2s ease 0s"
            opacity={0.9}
            overflow="hidden"
            flex={0}
          >
            <AppLink
              href={"#"}
              onClick={() => switchNetwork(ChainID.ARBITRUM, router)}
            >
              <Image h="100%" w="100%" src="static/arbitrum_banner.png" />
            </AppLink>
          </DashboardBox>
        </Box>

        <Spacer />

        <Box bg="" w="100%" h="100%" px={8} py={2}>
          <SimpleGrid columns={2} spacing={5} w="100%" h="100%">
            <HoverCard height="100%">
              <FuseAssetGridBox
                data={topEarningFuseStable}
                tokenData={
                  topEarningFuseStable
                    ? tokensData?.[topEarningFuseStable?.underlying.address]
                    : undefined
                }
                heading="Top Stable Lend"
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
      </RowOrColumn>

      {/* Recommended Row */}
      <Collapse
        in={shouldShowRecommendedPools}
        animateOpacity
        style={{ width: "100%" }}
      >
        <RowOrColumn
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          h="100%"
          bg=""
          px={8}
          py={4}
          isRow={!isMobile}
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

            <HStack
              justify="space-between"
              alignItems="flex-start"
              w="100%"
              h="100%"
              expand
              // flex={1}
              py={4}
              spacing={4}
            >
              {recommendedTokens.slice(0, 3).map((tokenAddress) => (
                <HoverCard w="100%" h="100%" ml={0} bg="" key={tokenAddress}>
                  <ExploreFuseCard
                    pool={
                      poolsMap[recommended[tokenAddress]?.poolId] ?? undefined
                    }
                    assetIndex={
                      recommended[tokenAddress]?.assetIndex ?? undefined
                    }
                    tokenData={tokensData?.[tokenAddress] ?? undefined}
                    balance={balances[tokenAddress] ?? undefined}
                  />
                </HoverCard>
              ))}
            </HStack>
          </Column>
        </RowOrColumn>
      </Collapse>

      {/* Top Fuse Pools */}
      <HStack
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        h="100%"
        px={8}
        py={4}
        my={3}
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
            <Heading>Top Fuse Pools</Heading>
            <Text ml={3} color="grey">
              based on total supply
            </Text>
          </Row>
          <Stack
            direction={isMobile ? "column" : "row"}
            justify="space-between"
            alignItems="flex-start"
            w="100%"
            h="100%"
            py={4}
          >
            <HoverCard
              w="100%"
              h="100%"
              flexBasis={"33%"}
              maxW={!isMobile ? "33%" : "100%"}
            >
              <ExploreFuseCard
                pool={topPools[0]}
                // tokensData={topFusePoolsTokensData}
              />
            </HoverCard>
            <HoverCard
              w="100%"
              h="100%"
              flexBasis={"33%"}
              maxW={!isMobile ? "33%" : "100%"}
            >
              <ExploreFuseCard
                pool={topPools[1]}
                // tokensData={topFusePoolsTokensData}
              />
            </HoverCard>
            <HoverCard
              w="100%"
              h="100%"
              flexBasis={"33%"}
              maxW={!isMobile ? "33%" : "100%"}
            >
              <ExploreFuseCard
                pool={topPools[2]}
                // tokensData={topFusePoolsTokensData}
              />
            </HoverCard>
          </Stack>
        </Column>
      </HStack>

      {/* Token Explorer */}
      <HStack
        justify="flex-start"
        align="flex-start"
        w="100%"
        h="100%"
        // bg="lime"
        px={8}
        py={4}
        my={3}
      >
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          w="100%"
          h="100%"
        >
          <TokenExplorer />
        </Column>
      </HStack>
    </Column>
  );
};

export const HoverCard = ({
  children,
  ...boxProps
}: {
  children?: ReactNode;
  [x: string]: any;
}) => {
  return (
    <DashboardBox
      border="1px solid #272727"
      _hover={{
        cursor: "pointer",
        bg: "#272727",
        opacity: 1,
        transform: "translateY(-7px) scale(1.00)",
        boxShadow: "0px .2px 4px grey;",
      }}
      transition="transform 0.2s ease 0s"
      opacity={0.9}
      overflow={"hidden"}
      {...boxProps}
    >
      {children}
    </DashboardBox>
  );
};

export default ExplorePage;
