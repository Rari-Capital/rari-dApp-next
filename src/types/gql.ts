export interface GQLCToken {
  id: string;
  name: string;
  symbol: string;
  supplyRatePerBlock: string;
  borrowRatePerBlock: string;
  supplyAPY: string;
  borrowAPR: string;
  liquidity: string;
  liquidityUSD: string;
  totalSupply: string;
  totalBorrow: string;
  totalSupplyUSD: string;
  totalBorrowUSD: string;
  adminFee: string;
  fuseFee: string;
  reserveFactor: string;
  underlyingBalance: string;
  collateralFactor: string;
  underlying?: GQLUnderlyingAsset;
  pool?: GQLFusePool;
}

export interface GQLUnderlyingAsset {
  address: string;
  id: string;
  name: string;
  symbol: string;
  price: string;
  totalBorrow: string;
  totalBorrowUSD: string;
  totalLiquidity: string;
  totalLiquidityUSD: string;
  totalSupply: string;
  totalSupplyUSD: string;
  pools?: GQLFusePool[];
  ctokens?: GQLCToken[];
}

export interface GQLFusePool {
  address: string;
  closeFactor: string;
  comptroller: string;
  id: string;
  index: string;
  maxAssets: string;
  liquidationIncentive: string;
  name: string;
  priceOracle: string;
  totalBorrowUSD: string;
  totalLiquidityUSD: string;
  totalSupplyUSD: string;
  assets?: GQLCToken[];
  underlyingAssets?: GQLUnderlyingAsset[];
}
