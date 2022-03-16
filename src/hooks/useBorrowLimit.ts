import { constants, BigNumber } from "ethers";
import { useMemo } from "react";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

export const useBorrowLimit = (
  assets: USDPricedFuseAsset[],
  options?: { ignoreIsEnabledCheckFor?: string },
  id?: string,
): BigNumber => {
  const maxBorrow = useMemo(() => {
    let _maxBorrow = constants.Zero;

    for (let i = 0; i < assets.length; i++) {
      let asset = assets[i];
      if (
        options?.ignoreIsEnabledCheckFor === asset.cToken ||
        asset.membership
      ) {
        _maxBorrow = _maxBorrow.add(
          asset.supplyBalanceUSD.mul(asset.collateralFactor)
        );
      }
    }

    const result = _maxBorrow.div(constants.WeiPerEther);
    // console.log({result, _maxBorrow, id})
    return result
  }, [assets, options?.ignoreIsEnabledCheckFor]);

  return maxBorrow;
};

export const useTotalSupply = (
  assets: USDPricedFuseAsset[],
): BigNumber => {
  const totalSupply = useMemo(() => {
    let _totalSupplyUSD = constants.Zero;

    for (let i = 0; i < assets.length; i++) {
      let asset = assets[i];
      _totalSupplyUSD = _totalSupplyUSD.add(
        asset.supplyBalanceUSD
      )
    }

    // console.log({result, _maxBorrow, id})
    return _totalSupplyUSD
  }, [assets]);

  return totalSupply;
};

export const useBorrowLimits = (
  assetsArray: USDPricedFuseAsset[][] | null,
  options?: { ignoreIsEnabledCheckFor?: string }
) => {
  const maxBorrows = useMemo(() => {
    return assetsArray?.map((assets) => {
      let maxBorrow = constants.Zero;
      for (let i = 0; i < assets.length; i++) {
        let asset = assets[i];

        if (
          options?.ignoreIsEnabledCheckFor === asset.cToken ||
          asset.membership
        ) {
          maxBorrow
            .add(asset.supplyBalanceUSD)
            .mul(asset.collateralFactor.div(constants.WeiPerEther));
        }
      }
      return maxBorrow;
    });
  }, [assetsArray, options?.ignoreIsEnabledCheckFor]);

  return maxBorrows;
};

// Same as useBorrowLimit but we subtract debt from the borrow limit
export const useBorrowCredit = (
  assets: USDPricedFuseAsset[],
  options?: { ignoreIsEnabledCheckFor?: string }
): BigNumber => {
  const maxBorrow = useMemo(() => {
    let maxBorrow = constants.Zero;
    for (let i = 0; i < assets.length; i++) {
      let asset = assets[i];

      // Only factor in borrow limit if asset is listed as collateral
      // OR if that user is GOING to enable as collateral
      if (
        asset.membership || // is asset enabled as collateral
        options?.ignoreIsEnabledCheckFor === asset.cToken // is asset GOING to be enabled as collateral
      ) {
        maxBorrow
          .add(asset.supplyBalanceUSD)
          .mul(asset.collateralFactor.div(constants.WeiPerEther));
      }

      // No matter what, if something is being borrowed we subtract regardless of if its collateral
      maxBorrow
        .sub(asset.borrowBalanceUSD)
        .mul(asset.collateralFactor.div(constants.WeiPerEther));
    }
    return maxBorrow;
  }, [assets, options?.ignoreIsEnabledCheckFor]);

  return maxBorrow;
};
