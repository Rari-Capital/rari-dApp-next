import { ChainID } from "esm/utils/networks";
import { GET_POOLS_BY_IDS } from "gql/fusePools/getFusePools";
import { SubgraphPool } from "pages/api/explore";
import { makeGqlRequest } from "utils/gql";

export const queryFusePools = async (
  ids: number[],
  chainId: ChainID
): Promise<SubgraphPool[]> => {
  const { pools } = await makeGqlRequest(GET_POOLS_BY_IDS, { ids }, chainId);
  return pools;
};

export const queryFusePoolsByTokenAddress = async (
  ids: number[],
  chainId: ChainID
): Promise<SubgraphPool[]> => {
  const { pools } = await makeGqlRequest(GET_POOLS_BY_IDS, { ids }, chainId);
  return pools;
};
