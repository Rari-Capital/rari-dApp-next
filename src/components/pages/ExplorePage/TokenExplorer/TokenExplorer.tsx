import React from "react";
import { AllAssetsList } from "components/shared/Lists/AssetsList";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { SubgraphUnderlyingAsset } from "pages/api/explore";
import { TokensDataMap } from "types/tokens";
import { queryAllUnderlyingAssets } from "services/gql";
import { fetchTokensAPIDataAsMap } from "utils/services";
import useSWR from "swr";

interface AllSubgraphUnderlyingAssets {
  assets: SubgraphUnderlyingAsset[];
  tokensData: TokensDataMap;
}
// Fetchers
const allTokensFetcher = async (): Promise<AllSubgraphUnderlyingAssets> => {
  const underlyingAssets = await queryAllUnderlyingAssets();

  const addrs = underlyingAssets.map((asset) => asset.address);
  const tokensData = await fetchTokensAPIDataAsMap(addrs);

  return {
    assets: underlyingAssets,
    tokensData,
  };
};

const useAllUnderlyingTokens = (): AllSubgraphUnderlyingAssets => {
  const { data, error } = useSWR("allAssets", allTokensFetcher);

  const { assets, tokensData } = data ?? {
    assets: [],
    tokensData: {},
  };

  return {
    assets,
    tokensData,
  };
};

const TokenExplorer = () => {
  const { assets, tokensData } = useAllUnderlyingTokens();
  return (
    <Box w="100%" h="100%">
      <HStack mb={4}>
        <Heading>All</Heading>
        <Heading bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
          {assets.length}
        </Heading>
        <Heading>tokens</Heading>
      </HStack>
      <AllAssetsList assets={assets} tokensData={tokensData} />
    </Box>
  );
};

export default TokenExplorer;
