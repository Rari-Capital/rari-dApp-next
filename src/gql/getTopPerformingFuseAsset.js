import { gql } from "graphql-tag";
import { CTokenFragment, FusePoolFragment, UnderlyingAssetFragment } from "./fragments";

// TODO: Use GQL Fragments
export const GET_TOP_PERFORMING_FUSE_ASSET = gql`
  query GetTopPerformingFuseAsset(
    $orderBy: Ctoken_orderBy = supplyAPY
    $orderDirection: OrderDirection! = desc
    $liquidityThreshold: BigInt = 10000
    $limit: Int = 1
  ) {
    ctokens(
      where: {liquidityUSD_gte: $liquidityThreshold
        pool_not_in: [
          "0xa58056e9dcc7bf3006dbb695a4cd70a11553b9bf"
          "0xf53c73332459b0dbd14d8e073319e585f7a46434"
          "0xAbDFCdb1503d89D9a6fFE052a526d7A41f5b76D6"
        ]
      }
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $limit
    ) {
      ...CTokenFragment
      pool {
        ...FusePoolFragment
      },
      underlying {
        ...UnderlyingAssetFragment
      }
    }
  }
  ${CTokenFragment}
  ${UnderlyingAssetFragment}
  ${FusePoolFragment}
`;
