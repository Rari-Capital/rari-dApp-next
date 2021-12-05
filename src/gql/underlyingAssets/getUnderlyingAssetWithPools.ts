import gql from "graphql-tag";
import { GQLUnderlyingAsset } from "types/gql";
import {
  CTokenFragment,
  FusePoolFragment,
  UnderlyingAssetFragment,
} from "../fragments";

export const GET_UNDERLYING_ASSET_WITH_POOLS = gql`
  query GetUnderlyingAssetWithPools($tokenAddress: ID!) {
    underlyingAsset(id: $tokenAddress) {
      ...UnderlyingAssetFragment
      pools {
        ...FusePoolFragment
        assets(where: { underlying_contains: $tokenAddress }) {
          ...CTokenFragment
        }
        underlyingAssets {
          id
        }
      }
    }
  }
  ${CTokenFragment}
  ${FusePoolFragment}
  ${UnderlyingAssetFragment}
`;
