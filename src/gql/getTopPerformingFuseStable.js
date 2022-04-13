import { gql } from "graphql-tag";
import {
  CTokenFragment,
  FusePoolFragment,
  UnderlyingAssetFragment,
} from "./fragments";

export const stables = [
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x956f47f50a910163d8bf957cf5846d573e7f87ca",
  "0x6b175474e89094c44da98b954eedeac495271d0f",
];

// TODO: Use GQL Fragments
export const GET_TOP_PERFORMING_FUSE_ASSET_OF_UNDERLYING = gql`
  query GetMostPopularAssetByUnderlying(
    $orderBy: Ctoken_orderBy = supplyAPY
    $orderDirection: OrderDirection! = desc
    $liquidityThreshold: BigInt = 10000
    $addresses: [String!]!
  ) {
    ctokens(
      where: {
        underlying_in: $addresses
        liquidityUSD_gte: $liquidityThreshold
        pool_not_in: [
          "0xa58056e9dcc7bf3006dbb695a4cd70a11553b9bf"
          "0xf53c73332459b0dbd14d8e073319e585f7a46434"
          "0xAbDFCdb1503d89D9a6fFE052a526d7A41f5b76D6"
        ]
      }
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: 1
    ) {
      ...CTokenFragment
      pool {
        ...FusePoolFragment
      }
      underlying {
        ...UnderlyingAssetFragment
      }
    }
  }
  ${CTokenFragment}
  ${UnderlyingAssetFragment}
  ${FusePoolFragment}
`;
