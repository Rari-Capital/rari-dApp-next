import gql from "graphql-tag";
import { UnderlyingAssetFragment } from "../fragments";

export const GET_UNDERLYING_ASSETS_PAGINATED = gql`
  query GetUnderlyingAssetsPaginated(
    $offset: Int = 0
    $limit: Int = 20
    $orderBy: UnderlyingAsset_orderBy! = address
    $orderDir: OrderDirection = asc
  ) {
    underlyingAssets(
      skip: $offset
      first: $limit
      orderBy: $orderBy
      orderDirection: $orderDir
    ) {
      ...UnderlyingAssetFragment
    }
  }
  ${UnderlyingAssetFragment}
`;
