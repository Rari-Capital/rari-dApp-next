import React from "react";
import { AllAssetsList } from "components/shared/Lists/AssetsList";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import useSWR, { SWRResponse } from "swr";
import { makeGqlRequest } from "utils/gql";
import { GET_UNDERLYING_ASSETS_COUNT } from "gql/underlyingAssets/getUnderlyingAssetsCount";
import { ChainID } from "esm/utils/networks";
import { useRari } from "context/RariContext";

export const useUnderlyingAssetsCount = (): SWRResponse<number, any> => {
  const { chainId } = useRari();
  return useSWR("allAssetsCount " + chainId, async () => {
    const data = await makeGqlRequest(GET_UNDERLYING_ASSETS_COUNT, {}, chainId);
    const count = data.utility.underlyingCount;
    return count;
  });
};

const TokenExplorer = () => {
  const { data: count } = useUnderlyingAssetsCount();
  return (
    <Box w="100%" h="100%">
      <HStack mb={4}>
        <Heading>All</Heading>
        <Heading bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
          {count}
        </Heading>
        <Heading>tokens</Heading>
      </HStack>
      <AllAssetsList />
    </Box>
  );
};

export default TokenExplorer;
