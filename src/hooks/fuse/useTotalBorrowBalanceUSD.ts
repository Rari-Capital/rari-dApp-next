import { constants } from "ethers";
import { useMemo } from "react";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

export const useTotalBorrowAndSupplyBalanceUSD = (
  assets: USDPricedFuseAsset[]
) => {
  return useMemo(() => getTotalBorrowAndSupplyBalanceUSD(assets), [assets]);
};

export const getTotalBorrowAndSupplyBalanceUSD = (
  assets: USDPricedFuseAsset[]
) => {
  let totalSupplyBalanceUSD = constants.Zero;
  let totalBorrowBalanceUSD = constants.Zero;

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    totalSupplyBalanceUSD = totalSupplyBalanceUSD.add(asset.supplyBalanceUSD);
    totalBorrowBalanceUSD = totalBorrowBalanceUSD.add(asset.borrowBalanceUSD);
  }

  return {
    totalBorrowBalanceUSD,
    totalSupplyBalanceUSD,
  };
};
