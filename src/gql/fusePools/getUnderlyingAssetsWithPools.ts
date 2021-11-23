import gql from "graphql-tag";

export const GET_UNDERLYING_ASSETS_WITH_POOLS = gql`
  query GetUnderlyingAssetsWithPools($tokenAddresses: [Bytes!] = []) {
    underlyingAssets(where: { address_in: $tokenAddresses }, first: 200) {
      address
      symbol
      pools {
        index
        id
      }
    }
  }
`;
