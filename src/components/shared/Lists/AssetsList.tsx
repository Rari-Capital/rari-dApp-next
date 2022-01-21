import { Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Avatar, Center, Stack } from "@chakra-ui/react";
import AppLink from "components/shared/AppLink";
import { Box, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";

// Hooks
import { useTranslation } from "next-i18next";

// Utils
import { Row, useIsMobile } from "lib/chakraUtils";

// Types
import { RariApiTokenData, TokensDataMap } from "types/tokens";
import { SubgraphUnderlyingAsset } from "pages/api/explore";
import { SortableTableHeader } from "./Common";
import { smallUsdFormatter } from "utils/bigUtils";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { queryUnderlyingAssetsPaginated } from "services/gql/underlyingAssets";
import { fetchTokensAPIDataAsMap } from "utils/services";
import usePagination from "hooks/usePagination";
import { useUnderlyingAssetsCount } from "components/pages/ExplorePage/TokenExplorer/TokenExplorer";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRari } from "context/RariContext";

interface AllSubgraphUnderlyingAssets {
  assets: SubgraphUnderlyingAsset[];
  tokensData: TokensDataMap;
}
// Fetchers

const useUnderlyingAssetsPaginated = (
  offset: number,
  limit: number,
  orderBy: string = "address",
  orderDir: "asc" | "desc" = "asc"
) => {
  const { chainId } = useRari();
  return useQuery(
    `Underlying Assets ${orderDir} by ${orderBy} offset ${offset} limit ${limit} chainId ${chainId}`,
    async (): Promise<SubgraphUnderlyingAsset[]> => {
      if (!chainId) return [];
      const underlyingAssets = await queryUnderlyingAssetsPaginated(
        chainId,
        offset,
        limit,
        orderBy,
        orderDir
      );
      return underlyingAssets;
    }
  );
};

export const AllAssetsList = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { chainId } = useRari();

  const [underlyingAssets, setUnderlyingAssets] = useState<
    SubgraphUnderlyingAsset[]
  >([]);
  const [tokensData, setTokensData] = useState<TokensDataMap>({});

  // Total amount
  const { data: count } = useUnderlyingAssetsCount();

  // GQL Pagination logic
  const { limit, offset, hasMore, handleLoadMore } = usePagination(count);

  // // Query GQL
  const { data: newAssets, isLoading } = useUnderlyingAssetsPaginated(
    offset,
    limit
  );

  const newAssetsUnderlyings = useMemo(
    () => newAssets?.map(({ id }) => id) ?? [],
    [newAssets]
  );

  // We use this to compare changes on `newAssetsUnderlyings` for the below useEffect
  const flag = useMemo(() => newAssetsUnderlyings[0], [newAssetsUnderlyings]);
  useEffect(() => {
    fetchTokensAPIDataAsMap(newAssetsUnderlyings, chainId).then(
      (newTokensData) => {
        setTokensData(Object.assign(tokensData, newTokensData));
      }
    );
  }, [flag, chainId]);

  useEffect(() => {
    // Append to array in state and set it
    setUnderlyingAssets([...underlyingAssets, ...(newAssets ?? [])]);
  }, [newAssets]);

  const loadMore = () => {
    handleLoadMore();
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: false,
    rootMargin: "0px 0px 200px 0px",
  });

  useEffect(() => {
    setUnderlyingAssets([]);
  }, [chainId]);

  return (
    <Box h="400px" w="100%" overflowY="scroll">
      {!underlyingAssets.length ? (
        <Box w="100%" h="50px">
          <Center>
            <Spinner my={8} />
          </Center>
        </Box>
      ) : (
        <>
          <Table variant="unstyled">
            <Thead
              position="sticky"
              top={0}
              left={0}
              zIndex={10}
              background="black"
              // Simulates a border-bottom while respecting z-index
              _after={{
                content: `""`,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Tr>
                <SortableTableHeader
                  text="Asset"
                  sortDir={undefined}
                  handleSortClick={() => null}
                  isActive={false}
                />

                {isMobile ? null : (
                  <>
                    <SortableTableHeader
                      text="Total Supplied"
                      sortDir={undefined}
                      handleSortClick={() => undefined}
                      isActive={false}
                    />

                    <SortableTableHeader
                      text="Total Borrowed"
                      sortDir={undefined}
                      handleSortClick={() => undefined}
                      isActive={false}
                    />

                    <SortableTableHeader
                      text="Total Liquidity"
                      sortDir={undefined}
                      handleSortClick={() => undefined}
                      isActive={false}
                    />
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody ref={rootRef}>
              {underlyingAssets.map((underlyingAsset) => {
                return (
                  <AssetRow
                    asset={underlyingAsset}
                    tokenData={tokensData[underlyingAsset.id]}
                    key={underlyingAsset.symbol}
                  />
                );
              })}
              {hasMore && (
                <Tr w="100%" h="20px" bg="pink" ref={sentryRef}>
                  <Spinner />
                </Tr>
              )}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

export const AssetRow = ({
  asset,
  tokenData,
  ...rowProps
}: {
  asset: SubgraphUnderlyingAsset;
  tokenData?: RariApiTokenData;
  [x: string]: any;
}) => {
  const isMobile = useIsMobile();

  const symbol = useMemo(() => {
  return  asset.symbol.toLowerCase() === "sohm" ? "gOHM" : asset.symbol
  }, [asset.symbol]) 

  return (
    <AppLink
      href={`/token/${asset.id}`}
      as={Tr}
      className="hover-row no-underline"
      width="100%"
      borderBottom="1px solid rgba(255,255,255,0.1)"
      {...rowProps}
    >
      {/* Pool */}
      <Td>
        <Row
          py={2}
          width={isMobile ? "100%" : "40%"}
          height="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
        >
          <Avatar src={tokenData?.logoURL} boxSize={10} />
          <Text ml={2} fontWeight="bold">
            {symbol}
          </Text>
        </Row>
      </Td>

      {isMobile ? null : (
        <>
          {/* Total Supply*/}
          <Td isNumeric={true}>
            <Stack direction="column">
              <Text fontWeight="bold">
                {asset.totalSupplyUSD &&
                  smallUsdFormatter(asset.totalSupplyUSD)}
              </Text>
              <Text fontWeight="" fontSize="sm">
                {asset.totalSupply &&
                  `${(asset.totalSupply / 10 ** asset.decimals).toFixed(2)} ${
                    asset.symbol
                  }`}
              </Text>
            </Stack>
          </Td>
          {/* Total Borrow */}
          <Td isNumeric={true}>
            <Stack direction="column">
              <Text fontWeight="bold">
                {asset.totalBorrowUSD &&
                  smallUsdFormatter(asset.totalBorrowUSD)}
              </Text>
              <Text fontWeight="" fontSize="sm">
                {asset.totalBorrow &&
                  `${(asset.totalBorrow / 10 ** asset.decimals).toFixed(2)} ${
                    asset.symbol
                  }`}
              </Text>
            </Stack>
          </Td>
          {/* Total Liquidity */}
          <Td isNumeric={true}>
            <Stack direction="column">
              <Text fontWeight="bold">
                {asset.totalLiquidityUSD &&
                  smallUsdFormatter(asset.totalLiquidityUSD).substring(0, 15)}
              </Text>
              <Text fontWeight="" fontSize="sm">
                {asset.totalLiquidity &&
                  (asset.totalLiquidity / 10 ** asset.decimals).toFixed(2)}{" "}
                {asset.symbol}
              </Text>
            </Stack>
          </Td>
          {/* Price
          <Td isNumeric={true} fontWeight="bold">
            {smallUsdFormatter(asset.price / 10 ** asset.decimals)}
          </Td> */}
        </>
      )}
    </AppLink>
  );
};
