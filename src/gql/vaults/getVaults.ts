import { gql } from "graphql-tag";

// TODO: Use GQL Fragments
export const GET_VAULTS = gql`
  query MyQuery {
    vaults {
      id
      initialized
      totalHoldings
      totalStrategyHoldings
      totalFloat
      totalSupply
      underlying
      underlyingDecimals
      underlyingSymbol
      trustedStrategies(
        orderBy: balance
        orderDirection: desc
        where: { balance_gt: "0" }
      ) {
        trusted
        symbol
        name
        id
        balance
      }
    }
  }
`;
