import { BigNumber } from "@ethersproject/bignumber";

export interface SubgraphStrategy {
  id: string;

  // # ERC20
  name: string;
  symbol: string;
  balance: string;

  // # Public Attributes
  trusted: boolean;
  vault: SubgraphVault;
}

export interface SubgraphVault {
  id: string;

  initialized: boolean;
  targetFloatPercent: string;
  feePercent: string;

  underlying: string;
  underlyingSymbol: string;
  underlyingDecimals: number;
  underlyingIsWeth: boolean;

  lastHarvestTimestamp: string;
  harvestWindow: string;
  harvestDelay: string;
  nextHarvestDelay: string;
  lastHarvestWindowStartTimestamp: string;

  trustedStrategies: SubgraphStrategy[];

  maxLockedProfit: string;
  totalSupply: string;
  totalStrategyHoldings: string;

  lockedProfit: string;
  exchangeRate: string;
  totalFloat: string;
  totalHoldings: string;

  // Withdrawal Queue
  withdrawalQueue: SubgraphStrategy[];
}

export interface Strategy {
  id: string;

  name: string;
  symbol: string;
  balance: BigNumber;

  trusted: boolean;
  vault: SubgraphVault;
}

export interface Vault {
  id: string;

  initialized: boolean;
  targetFloatPercent: BigNumber;
  feePercent: BigNumber;

  underlying: string;
  underlyingSymbol: string;
  underlyingDecimals: number;
  underlyingIsWeth: boolean;

  lastHarvestTimestamp: number;
  harvestWindow: BigNumber;
  harvestDelay: BigNumber;
  nextHarvestDelay: BigNumber;
  lastHarvestWindowStartTimestamp: BigNumber;

  trustedStrategies: Strategy[];

  maxLockedProfit: BigNumber;
  totalSupply: BigNumber;
  totalStrategyHoldings: BigNumber;

  lockedProfit: BigNumber;
  exchangeRate: BigNumber;
  totalFloat: BigNumber;
  totalHoldings: BigNumber;

  withdrawalQueue: Strategy[];
}
