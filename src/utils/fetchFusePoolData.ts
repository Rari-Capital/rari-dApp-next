// @ts-ignore
import Filter from "bad-words";
import { TokenData } from "hooks/useTokenData";
import { Vaults, Fuse } from "../esm/index"
import { fromWei } from "./ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";
import { constants, utils } from "ethers";
import { createComptroller } from "./createComptroller";
export const filter = new Filter({ placeHolder: " " });
filter.addWords(...["R1", "R2", "R3", "R4", "R5", "R6", "R7"]);

export function filterOnlyObjectProperties(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => isNaN(k as any))
  ) as any;
}

export function filterOnlyObjectPropertiesBNtoNumber(obj: any) {

  const cleanAssetWithBNs: any[] = Object.entries(obj).filter(([k]: any) => isNaN(k))
  
  // const assetObject = Object.fromEntries(
  //   cleanAssetWithBNs
  //   ) as any; 

  // const final = Object.keys(assetObject).map((key) => typeof assetObject[key] === "object" ? [key, assetObject[key].toString()] : [key, assetObject[key]])
  

  return Object.fromEntries(cleanAssetWithBNs)
}

export interface FuseAsset {
  cToken: string;

  borrowBalance: BigNumber;
  supplyBalance: BigNumber;
  liquidity: BigNumber;

  membership: boolean;

  underlyingName: string;
  underlyingSymbol: string;
  underlyingToken: string;
  underlyingDecimals: BigNumber;
  underlyingPrice: BigNumber;
  underlyingBalance: BigNumber;

  collateralFactor: BigNumber;
  reserveFactor: BigNumber;

  adminFee: BigNumber;
  fuseFee: BigNumber;

  borrowRatePerBlock: BigNumber;
  supplyRatePerBlock: BigNumber;

  totalBorrow: BigNumber;
  totalSupply: BigNumber;
}

export interface USDPricedFuseAsset extends FuseAsset {
  supplyBalanceUSD: BigNumber;
  borrowBalanceUSD: BigNumber;

  totalSupplyUSD: BigNumber;
  totalBorrowUSD: BigNumber;

  liquidityUSD: BigNumber;
}

export interface USDPricedFuseAssetWithTokenData extends USDPricedFuseAsset {
  tokenData: TokenData;
}

export interface FusePoolData {
  assets: USDPricedFuseAssetWithTokenData[] | USDPricedFuseAsset[];
  comptroller: any;
  name: any;
  isPrivate: boolean;
  totalLiquidityUSD: any;
  totalSuppliedUSD: any;
  totalBorrowedUSD: any;
  totalSupplyBalanceUSD: BigNumber;
  totalBorrowBalanceUSD: BigNumber;
  id: number;
}

export enum FusePoolMetric {
  TotalLiquidityUSD,
  TotalSuppliedUSD,
  TotalBorrowedUSD,
}

export const filterPoolName = (name: string) => {
  // Manual rename pool 6 until we add func to change pool names.
  if (name === "Tetranode's Pool") {
    return "Tetranode's RGT Pool";
  }

  if (name === "Tetranode's ETH Pool") {
    return "ChainLinkGod's / Tetranode's Up Only Pool";
  }

  return filter.clean(name);
};

export const fetchFusePoolData = async (
  poolId: string | undefined,
  address: string,
  fuse: Fuse,
  rari?: Vaults,
  blockNum: string | number = "latest",
  dev?: boolean
): Promise<FusePoolData | undefined> => {
  if (!poolId) return undefined;

  const {
    comptroller,
    name: _unfiliteredName,
    isPrivate,
  } = await fuse.contracts.FusePoolDirectory
    .pools(poolId)

  // Remove any profanity from the pool name
  let name = filterPoolName(_unfiliteredName);

  let assets: USDPricedFuseAsset[] = (
    await fuse.contracts.FusePoolLens.callStatic
      .getPoolAssetsWithData(comptroller)
  ).map(filterOnlyObjectPropertiesBNtoNumber);

  let totalLiquidityUSD = constants.Zero;
  
  let totalSupplyBalanceUSD = constants.Zero;
  let totalBorrowBalanceUSD = constants.Zero;
  
  let totalSuppliedUSD = constants.Zero;
  let totalBorrowedUSD = constants.Zero;
  
  const ethPrice: BigNumber = 
  // prefer rari because it has caching
  await (rari ?? fuse).getEthUsdPriceBN()
  
  for (let i = 0; i < assets.length; i++) {
    let asset = assets[i];

    asset.supplyBalanceUSD = (asset.supplyBalance.mul(asset.underlyingPrice)).mul(ethPrice.div(constants.WeiPerEther));

    asset.borrowBalanceUSD = (asset.borrowBalance.mul(asset.underlyingPrice)).mul(ethPrice.div(constants.WeiPerEther));

    totalSupplyBalanceUSD.add(asset.supplyBalanceUSD);
    totalBorrowBalanceUSD.add(asset.borrowBalanceUSD);

    asset.totalSupplyUSD = (asset.totalSupply.mul(asset.underlyingPrice)).mul(ethPrice.div(constants.WeiPerEther));
    asset.totalBorrowUSD = (asset.totalBorrow.mul(asset.underlyingPrice)).mul(ethPrice.div(constants.WeiPerEther));

    totalSuppliedUSD.add(asset.totalSupplyUSD);
    totalBorrowedUSD.add(asset.totalBorrowUSD);

    asset.liquidityUSD = (asset.liquidity.mul(asset.underlyingPrice)).mul(ethPrice.div(constants.WeiPerEther));

    totalLiquidityUSD.add(asset.liquidityUSD);
  }

  return {
    assets: assets.sort((a, b) => (b.liquidityUSD.gt(a.liquidityUSD) ? 1 : -1)),
    comptroller,
    name,
    isPrivate,

    totalLiquidityUSD,

    totalSuppliedUSD,
    totalBorrowedUSD,

    totalSupplyBalanceUSD,
    totalBorrowBalanceUSD,
    id: parseFloat(poolId),
  };
};
