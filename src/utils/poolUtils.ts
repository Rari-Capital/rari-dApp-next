import EthereumPool from '../esm/Vaults/pools/ethereum'
import StablePool from '../esm/Vaults/pools/stable'
import DAIPool from '../esm/Vaults/pools/dai'
import YieldPool from '../esm/Vaults/pools/yield'
import { Vaults } from "../esm/index"

export enum Pool {
  STABLE = "stable",
  YIELD = "yield",
  ETH = "eth",
  DAI = "dai",
  USDC = "usdc",
}

export function getSDKPool({
  rari,
  pool,
}: {
  rari: Vaults;
  pool: Pool | undefined;
}) {
  let sdkPool: StablePool | EthereumPool | YieldPool | DAIPool;

  switch (pool?.toLowerCase()) {
    case Pool.USDC:
      sdkPool = rari.pools.stable;
      break;
    case Pool.STABLE:
      sdkPool = rari.pools.stable;
      break;
    case Pool.DAI:
      sdkPool = rari.pools.dai;
      break;
    case Pool.ETH:
      sdkPool = rari.pools.ethereum;
      break;
    case Pool.YIELD:
      sdkPool = rari.pools.yield;
      break;
    default:
      sdkPool = rari.pools.yield;
      break;
  }

  return sdkPool;
}

export function poolHasDivergenceRisk(pool: Pool) {
  return pool === Pool.YIELD;
}

export const getPoolName = (pool: Pool, t: any) => {
  switch (pool.toLowerCase()) {
    case Pool.USDC:
      return t("USDC Pool");
    case Pool.DAI:
      return t("DAI Pool");
    case Pool.ETH:
      return t("ETH Pool");
    case Pool.YIELD:
      return t("Yield Pool");
    case Pool.STABLE:
      return t("Stable Pool")
    default:
      return t("Yield Pool");
  }
};

export const getPoolCaption = (pool: Pool, t: any) => {
  switch (pool.toLowerCase()) {
    case Pool.USDC:
      return t("Safe returns on USDC");
    case Pool.DAI:
      return t("Safe returns on DAI");
    case Pool.ETH:
      return t("Returns on ETH");
    case Pool.YIELD:
      return t("High risk, high reward");
    default:
      return t("High risk, high reward");
  }
};
