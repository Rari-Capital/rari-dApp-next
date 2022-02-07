import { ChainID } from "esm/utils/networks";
import { GET_ALL_UNDERLYING_ASSETS } from "gql/getAllUnderlyingAssets";
import {
  SEARCH_FOR_TOKEN,
  SEARCH_FOR_TOKENS_BY_ADDRESSES,
} from "gql/searchTokens";
import { GET_UNDERLYING_ASSETS_PAGINATED } from "gql/underlyingAssets/getUnderlyingAssetsPaginated";
import { SubgraphUnderlyingAsset } from "pages/api/explore";
import { GQLSearchReturn } from "types/search";
import { makeGqlRequest } from "utils/gql";

// Gets all UnderlyingAssets
export const queryAllUnderlyingAssets = async (chainId: number): Promise<
  SubgraphUnderlyingAsset[]
> => {
  const { underlyingAssets } = await makeGqlRequest(GET_ALL_UNDERLYING_ASSETS, {},chainId);
  return underlyingAssets;
};

export const queryUnderlyingAssetsPaginated = async (
  chainId: ChainID,
  offset?: number,
  limit?: number,
  orderBy?: string,
  orderDir?: "asc" | "desc"
): Promise<SubgraphUnderlyingAsset[]> => {
  const { underlyingAssets } = await makeGqlRequest(
    GET_UNDERLYING_ASSETS_PAGINATED,
    { offset, limit, orderBy, orderDir },
    chainId
  );
  return underlyingAssets;
};

// Searches for an UnderlyingAsset by its underlying symbol
export const querySearchForToken = async (
  text: string,
  chainId: ChainID
): Promise<GQLSearchReturn> =>
  await makeGqlRequest(
    SEARCH_FOR_TOKEN,
    {
      search: text.toUpperCase(),
    },
    chainId
  );

// Searches for UnderlyingAssets by their addresses
export const querySearchForTokenByAddresses = async (
  addresses: string[],
  chainId: ChainID
): Promise<GQLSearchReturn> =>
  await makeGqlRequest(
    SEARCH_FOR_TOKENS_BY_ADDRESSES,
    {
      addresses,
    },
    chainId
  );
