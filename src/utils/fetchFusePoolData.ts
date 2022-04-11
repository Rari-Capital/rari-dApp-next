// @ts-ignore
import Filter from "bad-words";
import { TokenData } from "hooks/useTokenData";
import { Fuse } from "../esm/index";
import { BigNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { EmptyAddress } from "context/RariContext";
import { callInterfaceWithMulticall, sendWithMultiCall } from "./multicall";
import { Interface } from "ethers/lib/utils";
export const filter = new Filter({ placeHolder: " " });
filter.addWords(...["R1", "R2", "R3", "R4", "R5", "R6", "R7"]);

export function filterOnlyObjectProperties<T>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => isNaN(k as any))
  ) as T
}

export function filterOnlyObjectPropertiesBNtoNumber(obj: any) {
  const cleanAssetWithBNs: any[] = Object.entries(obj).filter(([k]: any) =>
    isNaN(k)
  );

  // const assetObject = Object.fromEntries(
  //   cleanAssetWithBNs
  //   ) as any;

  // const final = Object.keys(assetObject).map((key) => typeof assetObject[key] === "object" ? [key, assetObject[key].toString()] : [key, assetObject[key]])

  return Object.fromEntries(cleanAssetWithBNs);
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
  oracle: string;

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

  isPaused: boolean;
  borrowGuardianPaused?: boolean;
}

export interface USDPricedFuseAssetWithTokenData extends USDPricedFuseAsset {
  tokenData: TokenData;
}

export interface FusePoolData {
  assets: USDPricedFuseAsset[];
  comptroller: string;
  name: string;
  oracle: string;
  oracleModel: string | undefined;
  isPrivate: boolean;
  totalLiquidityUSD: BigNumber;
  totalSuppliedUSD: BigNumber;
  totalBorrowedUSD: BigNumber;
  totalSupplyBalanceUSD: BigNumber;
  totalBorrowBalanceUSD: BigNumber;
  id?: number;
  admin: string;
  isAdminWhitelisted: boolean;
}

export enum FusePoolMetric {
  TotalLiquidityUSD,
  TotalSuppliedUSD,
  TotalBorrowedUSD,
}

export const filterPoolName = (name: string) => {
  if (name === "Tetranode's Pool") {
    return "Tetranode's Locker";
  }

  if (name === "state's pool") {
    return "Ribbon Pool";
  }

  if (name === "Stake DAO Pool") {
    return "The Animal Kingdom";
  }

  if (name === "Tetranode's ETH Pool") {
    return "ChainLinkGod's / Tetranode's Up Only Pool";
  }

  if (name === "Tetranode's Flavor of the Month") {
    return "FeiRari (Fei DAO Pool)";
  }

  if (name === "WOO pool") {
    return "Warlord's WOO Pool";
  }

  if (name === "Yearn's Yield") {
    return "Yearn Soup Pot of Yield";
  }
  if (name === "GMI Hot Tub") {
    return "GMI Hot Tub ♨️ ";
  }
  if (name === "Gk's preferred") {
    return "Regen Pool";
  }

  return filter.clean(name + "$W@G0N0M1C$").replace("$W@G0N0M1C$", "");
};

export const fetchFusePoolData = async (
  poolId: string | undefined,
  address: string,
  fuse: Fuse,
  blockNum: string | number = "latest",
  isAuthed: boolean,
  dev?: boolean,
): Promise<FusePoolData | undefined> => {
  if (!poolId) return undefined;

  const addressToUse = address === EmptyAddress ? "" : address

  const {
    comptroller,
    name: _unfiliteredName,
    isPrivate,
  } = await fuse.contracts.FusePoolDirectory.pools(poolId);

  const IComptroller = new Interface(JSON.parse(
    fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
  ))

  // Remove any profanity from the pool name
  let name = filterPoolName(_unfiliteredName);

  let assets: USDPricedFuseAsset[] = (
    await fuse.contracts.FusePoolLens.callStatic.getPoolAssetsWithData(
      comptroller,
      { from: addressToUse }
    )
  ).map(filterOnlyObjectPropertiesBNtoNumber);


  let totalLiquidityUSD = constants.Zero;

  let totalSupplyBalanceUSD = constants.Zero;
  let totalBorrowBalanceUSD = constants.Zero;

  let totalSuppliedUSD = constants.Zero;
  let totalBorrowedUSD = constants.Zero;

  const ethPrice: BigNumber =
    // prefer rari because it has caching
    await getEthUsdPriceBN();

  let [[admin], [oracle]] = await callInterfaceWithMulticall(fuse.provider, IComptroller, comptroller, ["admin", "oracle"], [[], []])
  let oracleModel: string | undefined = await fuse.getPriceOracle(oracle);

  // Whitelisted (Verified)
  const isAdminWhitelisted =
    await fuse.contracts.FusePoolDirectory.callStatic.adminWhitelist(admin);

  for (let i = 0; i < assets.length; i++) {
    let asset = assets[i];

    asset.supplyBalanceUSD = asset.supplyBalance
      .mul(asset.underlyingPrice)
      .mul(ethPrice)
      .div(constants.WeiPerEther.pow(3));

    asset.borrowBalanceUSD = asset.borrowBalance
      .mul(asset.underlyingPrice)
      .mul(ethPrice)
      .div(constants.WeiPerEther.pow(3));

    totalSupplyBalanceUSD = totalSupplyBalanceUSD.add(asset.supplyBalanceUSD);
    totalBorrowBalanceUSD = totalBorrowBalanceUSD.add(asset.borrowBalanceUSD);

    asset.totalSupplyUSD = asset.totalSupply
      .mul(asset.underlyingPrice)
      .mul(ethPrice)
      .div(constants.WeiPerEther.pow(3));

    asset.totalBorrowUSD = asset.totalBorrow
      .mul(asset.underlyingPrice)
      .mul(ethPrice)
      .div(constants.WeiPerEther.pow(3));

    totalSuppliedUSD = totalSuppliedUSD.add(asset.totalSupplyUSD);
    totalBorrowedUSD = totalBorrowedUSD.add(asset.totalBorrowUSD);

    asset.liquidityUSD = asset.liquidity
      .mul(asset.underlyingPrice)
      .mul(ethPrice)
      .div(constants.WeiPerEther.pow(3));

    totalLiquidityUSD.add(asset.liquidityUSD);
  }

  const data = {
    assets: assets.sort((a, b) => (b.liquidityUSD.gt(a.liquidityUSD) ? 1 : -1)),
    comptroller,
    name,
    isPrivate,
    oracle,
    oracleModel,
    admin,

    totalLiquidityUSD,

    totalSuppliedUSD,
    totalBorrowedUSD,

    totalSupplyBalanceUSD,
    totalBorrowBalanceUSD,
    isAdminWhitelisted
  };
  return data
};
