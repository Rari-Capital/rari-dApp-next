import gql from "graphql-tag";
import {
  CTokenFragment,
  FusePoolFragment,
  UnderlyingAssetFragment,
} from "../fragments";

export const GET_TOP_FUSE_POOLS = gql`
  query GetTopFusePools(
    $amount: Int = 3
    $metric: Pool_orderBy = "totalSupplyUSD"
  ) {
    pools(
      orderBy: $metric
      orderDirection: desc
      first: $amount
      where: { index_not_in: ["90", "23", "6", "18f"] }
    ) {
      ...FusePoolFragment
      assets(first: 6, orderBy: totalSupplyUSD, orderDirection: desc) {
        ...CTokenFragment
        underlying {
          id
          address
          name
          symbol
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
