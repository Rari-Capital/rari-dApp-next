// Next
import dynamic from "next/dynamic";
import {
  Heading,
  Text,
  SimpleGrid,
  useBreakpointValue,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { Column, Row } from "lib/chakraUtils";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import Marquee from "react-fast-marquee";
import HomeFuseCard from "./HomeFuseCard";

import { motion } from "framer-motion";

import { smallStringUsdFormatter } from "utils/bigUtils";

const APYWithRefreshMovingStat = dynamic<APYWithRefreshMovingProps>(
  () =>
    import("components/shared/MovingStat").then(
      (mod) => mod.APYWithRefreshMovingStat
    ),
  { ssr: false }
);

import { useTVLFetchers } from "hooks/useTVL";
import HomeVaultCard from "./HomeVaultCard";
import OpportunityCard from "./OpportunityCard";
import HomeCarousel from "./HomeCarousel";

// constants
import {
  HOMEPAGE_FUSE_POOLS,
  HomepageItems,
} from "constants/homepage";
// import { SearchIcon } from "@chakra-ui/icons";
import DashboardBox from "components/shared/DashboardBox";
import AppLink from "components/shared/AppLink";
import { APYWithRefreshMovingProps } from "components/shared/MovingStat";
import Searchbar from "components/shared/Searchbar";
import useSWR from "swr";
import { queryFusePools } from "services/gql";
import { fetchTokensAPIDataAsMap } from "utils/services";
import { TokensDataMap } from "types/tokens";
import { SubgraphPool } from "pages/api/explore";
import { getUniqueTokensForFusePools } from "utils/gqlFormatters";
import { useRari } from "context/RariContext";
import { useMemo } from "react";
import { ChainID, getChainMetadata } from "esm/utils/networks";

// Fetcher
const homepagePoolsFetcher = async (
  chainId: ChainID,
  ...ids: number[]
): Promise<{
  pools: SubgraphPool[];
  tokensData: TokensDataMap;
}> => {
  const pools = await queryFusePools(ids, chainId);
  const addresses = getUniqueTokensForFusePools(pools);
  const tokensData = await fetchTokensAPIDataAsMap([...Array.from(addresses)], chainId);
  return { pools, tokensData };
};

const Home = () => {
  const { chainId } = useRari();

  const chainMetadata = useMemo(
    () => getChainMetadata(chainId ?? 1),
    [chainId]
  );

  const isMobile = useIsSmallScreen();
  const { getNumberTVL } = useTVLFetchers();

  const { data } = useSWR(
    [chainId, ...HOMEPAGE_FUSE_POOLS[chainId ?? 1].map((pool) => pool.id)],
    homepagePoolsFetcher
  );

  const { pools, tokensData } = data ?? {
    pools: [],
    tokensData: {},
  };

  const sliceNum = useBreakpointValue({ sm: 4, md: 4, lg: 6, xl: 8 });

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      color="#FFFFFF"
      mx="auto"
      width="100%"
    >
      {/* Hero */}
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        height={{ sm: "300px", md: "350px" }}
        px={{ sm: "0", md: "15%" }}
      // bg="pink"
      >
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          my="auto"
          mt="auto"
          width="100%"
          height="100%"
          padding="10%"
        // bg="aqua"
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <Heading size="2xl" textAlign="center" mb={10}>
              Easily{" "}
              <Text as="span" color="#00C628">
                earn
              </Text>
              , lend <br /> and borrow
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
          >
            <Searchbar
              width={{ base: "xs", sm: "sm", md: "md", lg: "2xl" }}
            />
          </motion.div>
        </Column>
      </Row>

      {/* Fuse Pools */}
      <Row
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        width="100%"
        height="100%"
        mb={5}
      // px="20%"
      >
        <Marquee gradient={false} style={{ padding: "10px" }}>
          {HOMEPAGE_FUSE_POOLS[chainId ?? 1].map((constantPool, i) => (
            // <HoverCard w="100%" h="100%" mx={4}>
            //   <FuseAssetBoxNew
            //     pool={pools?.find(
            //       (p) => parseInt(p.index) == constantPool.id
            //     )}
            //     // tokensData={tokensData}
            //     key={i}
            //   />
            // </HoverCard>
            <HomeFuseCard
              pool={pools?.find((p) => parseInt(p.index) == constantPool.id)}
              tokensData={tokensData}
              key={i}
            />
          ))}
        </Marquee>
      </Row>

      {/* Opportunities */}
      <Row
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        mx="auto"
        my={10}
        px={["5%", "15%", "15%", "15%"]}
        width="100%"
      // background="purple"
      >
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
        // bg="pink"
        >
          <Row
            width="100%"
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
          >
            <Heading size="md">Explore Opportunities</Heading>
            <AppLink href="/explore">
              <Text fontSize="md" color="grey">
                View All
              </Text>
            </AppLink>
          </Row>

          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
            spacing="32px"
            w="100%"
            mt={5}
          >
            {HomepageItems(chainId ?? 1)
              .slice(0, sliceNum)
              .map((opportunity: any, i: number) => (
                <OpportunityCard opportunity={opportunity} key={i} />
              ))}
          </SimpleGrid>
        </Column>
      </Row>

      {/* Factoid Carousel */}
      <Row
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        mx="auto"
        my={10}
        px={{ base: "5%", sm: "5%", md: "15%" }}
        width="100%"
      // background="purple"
      >
        <DashboardBox width="100%" height="230px">
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            height="100%"
            width="100%"
          >
            <Column
              mainAxisAlignment="space-around"
              crossAxisAlignment="flex-start"
              height="100%"
              flex="0 1"
              flexBasis={{
                base: "25%",
                sm: "25%",
                md: "40%",
                lg: "40%",
              }}
              p={5}
            >
              <VStack align={"flex-start"}>
                <APYWithRefreshMovingStat
                  formatStat={smallStringUsdFormatter}
                  fetchInterval={40000}
                  loadingPlaceholder="$?"
                  apyInterval={100}
                  fetch={getNumberTVL}
                  queryKey={"totalValueLocked-" + chainId}
                  apy={0.15}
                  statSize="3xl"
                  captionSize="md"
                  caption={""}
                  crossAxisAlignment="flex-start"
                // captionFirst={false}
                />
                <Text
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color="#858585"
                  marginTop={0}
                >
                  in TVL across{" "}
                  <chakra.span color={chainMetadata.color}>
                    {chainMetadata.name}
                  </chakra.span>
                </Text>
              </VStack>
              <Text fontSize={isMobile ? "sm" : "lg"} fontWeight="bold">
                Discover infinite possibilities across the Rari Capital
                Ecosystem
              </Text>
            </Column>
            <Column
              mainAxisAlignment="center"
              crossAxisAlignment="center"
              height="100%"
              flex="1 1"
              flexBasis={{
                base: "75%",
                sm: "75%",
                md: "60%",
                lg: "60%",
              }}
              width="1px" // weird hack to make the carousel fit. idk why it works
              p={{ base: 0, sm: 0, md: 0, lg: 5 }}
            >
              <HomeCarousel />
            </Column>
          </Row>
        </DashboardBox>
      </Row>

      {/* Easily Earn (Vaults) */}
      {/* <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          height="100%"
          my={10}
        >
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            width="100%"
            // background="tomato"
          >
            <Row
              width="100%"
              mainAxisAlignment="space-between"
              crossAxisAlignment="center"
              px={{ base: "5%", sm: "5%", md: "15%" }}
              mb={5}
            >
              <Heading size="md">Easily Earn </Heading>
              <AppLink href="/explore?filter=earn">
                <Text size="md" color="grey">
                  View All
                </Text>
              </AppLink>
            </Row>
            <Marquee
              direction="right"
              gradient={false}
              style={{ padding: "10px" }}
            >
              {HOMEPAGE_EARN_VAULTS.map((opportunity, i) => (
                <HomeVaultCard opportunity={opportunity} key={i} />
              ))}
            </Marquee>
          </Column>
        </Row> */}

      {/* Explore Today */}
    </Column>
  );
};

export default Home;
