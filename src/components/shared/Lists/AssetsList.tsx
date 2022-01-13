import { Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Avatar, Center, Stack } from "@chakra-ui/react";
import AppLink from "components/shared/AppLink";
import { ModalDivider } from "components/shared/Modal";
import { Box, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";

// Hooks
import useSWR from "swr";
import { useTranslation } from "next-i18next";

// Utils
import { Column, Row, useIsMobile } from "lib/chakraUtils";

// Types
import { RariApiTokenData, TokensDataMap } from "types/tokens";
import { SubgraphUnderlyingAsset } from "pages/api/explore";
import { useSortableList } from "hooks/useSortableList";
import { SortableTableHeader } from "./Common";
import { smallUsdFormatter } from "utils/bigUtils";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { queryUnderlyingAssetsPaginated } from "services/gql/underlyingAssets";
import { fetchTokensAPIDataAsMap } from "utils/services";
import usePagination from "hooks/usePagination";
import { useUnderlyingAssetsCount } from "components/pages/ExplorePage/TokenExplorer/TokenExplorer";
import { useEffect, useState } from "react";

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
  const { data, error } = useSWR(
    `Underlying Assets ${orderDir} by ${orderBy} offset ${offset} limit ${limit}`,
    async (): Promise<AllSubgraphUnderlyingAssets> => {
      const underlyingAssets = await queryUnderlyingAssetsPaginated(
        offset,
        limit,
        orderBy,
        orderDir
      );
      const addrs = underlyingAssets.map((asset) => asset.address);
      const tokensData = await fetchTokensAPIDataAsMap(addrs);

      return {
        assets: underlyingAssets,
        tokensData,
      };
    }
  );
  return (
    data ?? {
      assets: [],
      tokensData: {},
    }
  );
};

export const AllAssetsList = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const [underlyingAssets, setUnderlyingAssets] = useState<
    SubgraphUnderlyingAsset[]
  >([]);

  // Total amount
  const { data: count } = useUnderlyingAssetsCount();

  // GQL Pagination logic
  const { page, limit, offset, hasMore, setPage, setLimit, setOffset } =
    usePagination(count);

  // Query GQL
  const { assets, tokensData } = useUnderlyingAssetsPaginated(offset, limit);

  useEffect(() => {
    setUnderlyingAssets([...underlyingAssets, ...assets]);
  }, [assets]);
  //
  const { handleSortClick, sortBy, sortDir } = useSortableList(assets);

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: true,
    hasNextPage: hasMore,
    onLoadMore: () => setPage(page + 1),
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    // disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: "0px 0px 400px 0px",
  });

  console.log({ page, limit, offset, assets, underlyingAssets, hasMore });

  return (
    <Box h="400px" w="100%" overflowY="scroll">
      {!underlyingAssets.length ? (
        <Box w="100%" h="50px">
          <Center>
            <Spinner my={8} />
          </Center>
        </Box>
      ) : (
        <Table variant="unstyled">
          <Thead position="sticky" top={0} left={0} bg="#121212" zIndex={10}>
            <Tr>
              <SortableTableHeader
                text="Asset"
                sortDir={sortDir}
                handleSortClick={() => handleSortClick("symbol")}
                isActive={sortBy === "symbol"}
              />

              {isMobile ? null : (
                <>
                  <SortableTableHeader
                    text="Total Supplied"
                    sortDir={sortDir}
                    handleSortClick={() => handleSortClick("totalSupplyUSD")}
                    isActive={sortBy === "totalSupplyUSD"}
                  />

                  <SortableTableHeader
                    text="Total Borrowed"
                    sortDir={sortDir}
                    handleSortClick={() => handleSortClick("totalBorrowUSD")}
                    isActive={sortBy === "totalBorrowUSD"}
                  />

                  <SortableTableHeader
                    text="Total Liquidity"
                    sortDir={sortDir}
                    handleSortClick={() => handleSortClick("totalLiquidityUSD")}
                    isActive={sortBy === "totalLiquidityUSD"}
                  />
                  {/* 
                <SortableTableHeader
                  text="Price"
                  sortDir={sortDir}
                  handleSortClick={() => handleSortClick("price")}
                  isActive={sortBy === "price"}
                /> */}
                </>
              )}
            </Tr>
          </Thead>
          <Tbody ref={rootRef}>
            {underlyingAssets.map((underlyingAsset) => {
              return (
                <>
                  <AssetRow
                    asset={underlyingAsset}
                    tokenData={tokensData[underlyingAsset.id]}
                    key={underlyingAsset.symbol}
                  />
                  <ModalDivider />
                </>
              );
            })}
            <Box w="100%" h="30px" bg="pink" ref={sentryRef}>
              <Spinner />
            </Box>
          </Tbody>
        </Table>
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

  return (
    <AppLink
      href={`/token/${asset.id}`}
      as={Tr}
      className="hover-row no-underline"
      width="100%"
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
            {asset.symbol}
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
                {(asset.totalLiquidity / 10 ** asset.decimals).toFixed(2)}{" "}
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
