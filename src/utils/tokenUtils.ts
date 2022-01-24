import { AllTokens } from "rari-tokens-generator";
import {
  USDPricedFuseAsset,
  USDPricedFuseAssetWithTokenData,
} from "utils/fetchFusePoolData";
import { Fuse } from "../esm/index"

// Hooks
import { ETH_TOKEN_DATA, TokenData } from "hooks/useTokenData";

// Ethers
import { Contract, BigNumber } from 'ethers'

import Tokens from "../static/compiled/tokens.json";

export const tokens = Tokens as AllTokens;

export interface AssetHash {
  [address: string]: USDPricedFuseAsset;
}

export interface AssetHashWithTokenData {
  [address: string]: USDPricedFuseAssetWithTokenData;
}

export interface TokensDataHash {
  [address: string]: TokenData;
}

export const createAssetsMap = (assetsArray: USDPricedFuseAsset[][]) => {
  const assetsMap: AssetHash = {};

  for (const assets of assetsArray) {
    for (const asset of assets) {
      const address = asset.underlyingToken;
      if (!assetsMap[address]) {
        assetsMap[address] = asset;
      }
    }
  }

  return assetsMap;
};

export const createTokensDataMap = (
  tokensData: TokenData[] | null
): TokensDataHash => {
  const _tokensData = tokensData ?? [];
  const _tokensDataMap: TokensDataHash = {};

  for (const tokenData of _tokensData) {
    if (!tokenData.address) continue;
    if (!_tokensDataMap[tokenData.address]) {
      _tokensDataMap[tokenData.address] = tokenData;
    }
  }

  return _tokensDataMap;
};

export function getMinMaxOf2DIndex(arr: any[][], idx: number) {
  return {
    min: Math.min.apply(
      null,
      arr.map(function (e) {
        return e[idx];
      })
    ),
    max: Math.max.apply(
      null,
      arr.map(function (e) {
        return e[idx];
      })
    ),
  };
}

// Check if address is null address = ETH
export const isAssetETH = (assetAddress?: string) =>
  assetAddress ? assetAddress === ETH_TOKEN_DATA.address : false;

// Creates an instance of an ERC20 contract
export const createERC20Contract = ({
  fuse,
  tokenAddress,
}: {
  fuse: Fuse;
  tokenAddress: string;
}): Contract => {
  return new Contract(
    tokenAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/EIP20Interface.sol:EIP20Interface"].abi
    ),
    fuse.provider.getSigner()
  );
};

// Checks if there a user has approved this Token
export const checkHasApprovedEnough = async ({
  fuse,
  token,
  userAddress,
  approveForAddress,
  approvedForAmount,
}: {
  fuse: Fuse;
  token: Contract;
  userAddress: string;
  approveForAddress: string;
  approvedForAmount: BigNumber;
}) => {
  return (await token.allowance(userAddress, approveForAddress))
    .gte(approvedForAmount);
};

export const MAX_APPROVAL_AMOUNT = BigNumber.from(2)
  .pow(256)
  .sub(1); // big fucking #


const ETH_AND_WETH = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x0000000000000000000000000000000000000000",
  "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
];


export const isTokenETHOrWETH = (tokenAddress: string) =>
  ETH_AND_WETH.includes(tokenAddress.toLowerCase());
