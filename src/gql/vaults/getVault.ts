import { gql } from "graphql-tag";

// TODO: Use GQL Fragments
export const GET_VAULT_FOR_UNDERLYING = gql`
  query GetVaultForUnderlying($tokenAddress: Bytes!) {
    vaults(where: { underlying: $tokenAddress }) {
      id
      initialized
      totalHoldings
      totalStrategyHoldings
      lastHarvestTimestamp
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
      maxLockedProfit
      nextHarvestDelay
      targetFloatPercent
      lockedProfit
      lastHarvestWindowStartTimestamp
      harvestWindow
      harvestDelay
      feePercent
      exchangeRate
    }
  }
`;
