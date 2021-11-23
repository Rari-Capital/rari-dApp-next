import gql from "graphql-tag";
import { UnderlyingAssetFragment } from "./fragments";

export const GET_ALL_UNDERLYING_ASSETS = gql`
  query GetAllUnderlyingAssets {
    underlyingAssets(first: 200) {
      ...UnderlyingAssetFragment
    }
  }
  ${UnderlyingAssetFragment}
`;
