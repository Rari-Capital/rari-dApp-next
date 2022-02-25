import { SubgraphPool } from "pages/api/explore";

export const getUniqueTokensForFusePools = (pools: SubgraphPool[]) => {
  const addresses = new Set<string>();
  for (let pool of pools) {
    for (let asset of pool.assets) {
      addresses.add(asset.underlying.address);
    }
  }
  return addresses;
};
