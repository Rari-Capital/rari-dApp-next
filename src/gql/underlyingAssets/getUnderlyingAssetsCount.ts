import gql from "graphql-tag";

export const GET_UNDERLYING_ASSETS_COUNT = gql`
  query GetUnderlyingAssetsCount {
    utility(id: "0") {
      underlyingCount
    }
  }
`;
