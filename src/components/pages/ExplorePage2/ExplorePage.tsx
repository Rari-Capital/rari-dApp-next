import Image from "next/image";
import { Heading, Menu, MenuList, useBreakpointValue } from "@chakra-ui/react";
import DashboardBox from "components/shared/DashboardBox";
import { APYWithRefreshMovingStat } from "components/shared/MovingStat";
import { Box, Center, SimpleGrid, Spacer, Text } from "@chakra-ui/layout";

// Hooks
import { useTVLFetchers } from "hooks/useTVL";
import { useTranslation } from "next-i18next";
import { useState, useMemo, ReactNode } from "react";

// Utils
import { smallUsdFormatter } from "utils/bigUtils";
import { Column, Row } from "lib/chakraUtils";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { APIExploreData } from "pages/api/explore";
import useSWR from "swr";

import axios from "axios";

// Fetchers
const exploreFetcher = async (route: string): Promise<APIExploreData> => {
  // const data = await getExploreData();
  // console.log({ data });
  const { data }: { data: APIExploreData } = await axios.get(route);
  return data;
};

const ExplorePage = () => {
  const router = useRouter();
  const { getNumberTVL } = useTVLFetchers();
  const { t } = useTranslation();

  const statsSize = useBreakpointValue(
    { base: "2xl", sm: "2xl", md: "3xl", lg: "3xl" },
    "2xl"
  );
  const captionSize = useBreakpointValue(
    { base: "md", sm: "md", md: "lg", lg: "lg" },
    "lg"
  );
  const paddingX = useBreakpointValue({ base: 5, sm: 5, md: 10, lg: 10 });

  // Data
  // Fetchers
  const { data, error } = useSWR("/api/explore", exploreFetcher);
  const { results, tokensData } = data ?? {};

  const {
    topEarningFuseStable,
    topEarningFuseAsset,
    mostPopularFuseAsset,
    mostBorrowedFuseAsset,
    cheapestStableBorrow,
  } = results ?? {};

  console.log({ data });

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
        h="300px"
        bg="red"
      >
        <Box w="100%" h="100%" bg="pink" px={8} py={2}>
          <DashboardBox bg="aqua" w="100%" h="100%" p={2} />
        </Box>

        <Spacer />
        <Box bg="" w="100%" h="100%" px={8} py={2}>
          <SimpleGrid columns={2} spacing={5} w="100%" h="100%">
            <HoverCard bg="pink" height="100%" />
            <HoverCard bg="pink" height="100%" />
            <HoverCard bg="pink" height="100%" />
            <HoverCard bg="pink" height="100%" />
          </SimpleGrid>
        </Box>
      </Row>

      {/* Recommended Row */}
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        w="100%"
        h="250px"
        bg="purple"
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
            <Heading>Recommended</Heading>
            <Text ml={3}>Based on your positions</Text>
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
            <HoverCard w="100%" h="100%" mx={5} ml={0} />
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
            <HoverCard w="100%" h="100%" mx={5} ml={0} />
            <HoverCard w="100%" h="100%" mx={5} />
            <HoverCard w="100%" h="100%" mx={5} mr={0} />
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
      _hover={{ transform: "scale(1.02)", cursor: "pointer" }}
      {...boxProps}
    >
      {children}
    </DashboardBox>
  );
};

export default ExplorePage;
