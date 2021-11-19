import gql from "graphql-tag";
import {
  CTokenFragment,
  FusePoolFragment,
  UnderlyingAssetFragment,
} from "../fragments";

export const GET_RECOMMENDED_POOLS = gql`
  query GetRecommendedPoolsWithUnderlyingAssets(
    $poolIds: [ID!] = []
    $tokenIds: [String!] = []
    $liquidityThreshold: BigInt = 10000
  ) {
    pools(
      where: { id_in: $poolIds, totalLiquidityUSD_gte: $liquidityThreshold }
    ) {
      ...FusePoolFragment
      assets(
        where: { underlying_in: $tokenIds }
        orderBy: supplyAPY
        orderDirection: desc
      ) {
        ...CTokenFragment
        underlying {
          id
        }
      }
      underlyingAssets {
        id
      }
    }
  }
  ${CTokenFragment}
  ${FusePoolFragment}
  ${UnderlyingAssetFragment}
`;
