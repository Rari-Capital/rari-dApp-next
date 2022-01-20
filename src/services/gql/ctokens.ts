import { ChainID } from "esm/utils/networks";
import { GET_TOP_PERFORMING_FUSE_ASSET } from "gql/getTopPerformingFuseAsset";
import { GET_TOP_PERFORMING_FUSE_ASSET_OF_UNDERLYING } from "gql/getTopPerformingFuseStable";
import { SubgraphCToken } from "pages/api/explore";
import { makeGqlRequest } from "utils/gql";

// Returns a single Fuse Asset that matches the highest score of the search criteria
export const queryTopFuseAsset = async (
  orderBy: keyof SubgraphCToken,
  orderDirection: "asc" | "desc",
  addresses?: string[],
  chainId?: ChainID
): Promise<SubgraphCToken | undefined> => {
  if (!chainId) return undefined;

  const query = addresses?.length
    ? GET_TOP_PERFORMING_FUSE_ASSET_OF_UNDERLYING
    : GET_TOP_PERFORMING_FUSE_ASSET;

  const vars = {
    orderBy,
    orderDirection,
    addresses,
  };

  const { ctokens } = await makeGqlRequest(query, vars, chainId);

  const ctoken: SubgraphCToken = ctokens?.[0];

  return ctoken;
};

// Returns a list of Fuse Assets that matches the search criteria
export const queryFuseAssets = async (
  orderBy: string,
  orderDirection: "asc" | "desc",
  limit: number = 1,
  chainId?: ChainID
): Promise<SubgraphCToken[]> => {
  if (!chainId) return [];
  const query = GET_TOP_PERFORMING_FUSE_ASSET;

  const vars = {
    orderBy,
    orderDirection,
    limit,
  };

  const { ctokens } = await makeGqlRequest(query, vars, chainId);

  return ctokens;
};
