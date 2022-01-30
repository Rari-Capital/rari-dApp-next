// for supply-side rewards apy:
// export const

import { useQuery } from "react-query";
import { ETH_TOKEN_DATA, useTokensDataAsMap } from "hooks/useTokenData";
import {
  useCreateComptroller,
  createCToken,
  createERC20,
  createMasterPriceOracle,
  createOracle,
} from "utils/createComptroller";
import { Fuse } from "esm";
import { useRari } from "context/RariContext";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

import {
  CTokenIncentivesMap,
  CTokenRewardsDistributorIncentives,
} from "./usePoolIncentives";
import { convertMantissaToAPR, convertMantissaToAPY } from "utils/apyUtils";
import { constants, BigNumber } from "ethers";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

// ( ( rewardSupplySpeed * rewardEthPrice ) / ( underlyingTotalSupply * underlyingEthPrice / 1e18 / 1e18 ) )
// (
//     rewardSpeed: number,  // getRewardsSpeedsByPool
//     rewardEthPrice: number,  // useAssetPricesInEth + the rewardtoken -- price of the rewardToken in ETH
//     underlyingTotalSupply: number, // (CToken.totalSupply() * CToken.exchangeRateCurrent())
//     underlyingEthPrice: number // useAssetPricesInEth + the CToken underlying price in ETH
// )

export interface CTokenRewardsDistributorIncentivesWithRates
  extends CTokenRewardsDistributorIncentives {
  supplyAPY: number;
  borrowAPY: number;
  supplyAPR: number;
  borrowAPR: number;
}

export interface CTokenRewardsDistributorIncentivesWithRatesMap {
  [cTokenAddress: string]: CTokenRewardsDistributorIncentivesWithRates[];
}

interface RewardsDataForMantissa {
  cTokenAddress: string;
  rewardSpeed: number;
  rewardEthPrice: number;
  underlyingTotalSupply: number;
  underlyingEthPrice: number;
  underlyingDecimals: number;
  rewardDecimals: number;
}

export const useIncentivesWithRates = (
  incentives: CTokenIncentivesMap,
  rewardTokenAddrs: string[],
  rewardTokensData: TokensDataMap,
  comptroller: string
) => {
  // this is what we return
  const incentivesWithRates: CTokenRewardsDistributorIncentivesWithRatesMap =
    {};

  const ctokenAddrs = Object.keys(incentives);

  const cTokensDataMap = useCTokensDataForRewards(ctokenAddrs);

  // return speed;

  // Reduce CTokens Array to Underlying, using same indices
  const underlyings = Object.keys(cTokensDataMap).map(
    (key) => cTokensDataMap[key].underlyingToken
  );

  // const rewardTokens = Object.keys(ctokensRewardsMap).map(
  //   (key) => ctokensRewardsMap[key].rewardTOk
  // );

  // Then we need to get underlying prices
  const tokenPrices = useAssetPricesInEth(
    [...underlyings, ...rewardTokenAddrs],
    comptroller
  );
  // console.log({ incentives, cTokensDataMap, underlyings, tokenPrices });

  // This shit is bananas
  if (!tokenPrices || !ctokenAddrs) return {};

  // Each CToken has an array of incentives data
  for (let cTokenAddress of ctokenAddrs) {
    const incentivesForCToken = incentives[cTokenAddress];
    const cTokenData = cTokensDataMap[cTokenAddress];

    const incentivesForCTokenWithRates: CTokenRewardsDistributorIncentivesWithRates[] =
      incentivesForCToken.length && !!cTokenData
        ? incentivesForCToken.map((incentiveForCToken) => {
            const { rewardToken, borrowSpeed, supplySpeed } =
              incentiveForCToken;

            const supplyMantissaData: RewardsDataForMantissa = {
              cTokenAddress,
              rewardSpeed: supplySpeed,
              rewardEthPrice: tokenPrices.tokenPrices[rewardToken].ethPrice,
              underlyingTotalSupply: parseFloat(
                cTokenData.totalSupply.toString()
              ),
              underlyingEthPrice:
                tokenPrices.tokenPrices[cTokenData.underlyingToken].ethPrice,
              rewardDecimals: rewardTokensData[rewardToken].decimals ?? 18,
              underlyingDecimals: cTokenData.underlyingDecimals,
            };

            const borrowMantissaData: RewardsDataForMantissa = {
              cTokenAddress,
              rewardSpeed: borrowSpeed,
              rewardEthPrice: tokenPrices.tokenPrices[rewardToken].ethPrice,
              underlyingTotalSupply: parseFloat(
                cTokenData.totalSupply.toString()
              ),
              underlyingEthPrice:
                tokenPrices.tokenPrices[cTokenData.underlyingToken].ethPrice,
              rewardDecimals: rewardTokensData[rewardToken].decimals ?? 18,
              underlyingDecimals: cTokenData.underlyingDecimals,
            };

            const supplyMantissa = constructMantissa(
              supplyMantissaData.rewardSpeed,
              supplyMantissaData.rewardEthPrice,
              supplyMantissaData.underlyingTotalSupply,
              supplyMantissaData.underlyingEthPrice,
              supplyMantissaData.rewardDecimals,
              supplyMantissaData.underlyingDecimals
            );

            const borrowMantissa = constructMantissa(
              borrowMantissaData.rewardSpeed,
              borrowMantissaData.rewardEthPrice,
              borrowMantissaData.underlyingTotalSupply,
              borrowMantissaData.underlyingEthPrice,
              borrowMantissaData.rewardDecimals,
              borrowMantissaData.underlyingDecimals
            );

            const supplyAPY = convertMantissaToAPY(supplyMantissa, 365);
            const supplyAPR = convertMantissaToAPR(supplyMantissa);
            const borrowAPY = convertMantissaToAPY(borrowMantissa, 365);
            const borrowAPR = convertMantissaToAPR(borrowMantissa);

            const cTokenIncentiveDataWithAPYs = {
              ...incentiveForCToken,
              supplyAPY,
              supplyAPR,
              borrowAPY,
              borrowAPR,
            };

            return cTokenIncentiveDataWithAPYs;
          })
        : [];

    // this is what we return
    incentivesWithRates[cTokenAddress] = incentivesForCTokenWithRates;
  }

  return incentivesWithRates;
};

const constructMantissa = (
  rewardSpeed: number,
  rewardEthPrice: number,
  underlyingTotalSupply: number,
  underlyingEthPrice: number,
  rewardDecimals: number = 18,
  underlyingDecimals: number = 18
) => {
  const newRewardETHPerBlock =
    rewardEthPrice * (rewardSpeed / 10 ** rewardDecimals);

  const newUnderlyingTotalSupplyETH =
    underlyingEthPrice * (underlyingTotalSupply / 10 ** underlyingDecimals);

  const newMantissa =
    (newRewardETHPerBlock * 1e18) / newUnderlyingTotalSupplyETH;

  return newMantissa;
};

export interface CTokensDataForRewardsMap {
  [cTokenAddr: string]: CTokenDataForRewards;
}

export type CTokenDataForRewards = Pick<
  USDPricedFuseAsset,
  "underlyingToken" | "cToken" | "totalSupply" | "underlyingPrice"
>;

export const useCTokensDataForRewards = (
  cTokenAddrs: string[]
): CTokensDataForRewardsMap => {
  const { fuse } = useRari();
  const { data: cTokensMap } = useQuery(
    "CTokens underlying for " + cTokenAddrs?.join(","),
    async () => {
      const _map: CTokensDataForRewardsMap = {};

      const cTokensArray = await Promise.all(
        cTokenAddrs.map(async (cTokenAddr) => {
          const ctokenInstance = createCToken(fuse, cTokenAddr, true);
          // console.log({ ctokenInstance });
          const underlying = await ctokenInstance.callStatic.underlying();
          const underlyingInstance = createERC20(fuse, underlying);
          const underlyingDecimals = await underlyingInstance.callStatic.decimals();

          const decimals = await ctokenInstance.callStatic.decimals();

          const cTokenTotalSupply: BigNumber =
            await ctokenInstance.callStatic.totalSupply();

          const exchangeRateCurrent: BigNumber =
            await ctokenInstance.callStatic.exchangeRateCurrent();

          // console.log({ underlying, cTokenTotalSupply, exchangeRateCurrent });

          const underlyingTotalSupply2 = cTokenTotalSupply
            .mul(exchangeRateCurrent)
            .div(constants.WeiPerEther);

          // const underlyingTotalSupply =
          //   parseFloat(
          //     toBN(cTokenTotalSupply).mul(toBN(exchangeRateCurrent)).toString()
          //   ) /
          //   10 ** 18;

          // console.log({
          //   cTokenAddr,
          //   cTokenTotalSupply,
          //   exchangeRateCurrent,
          //   underlyingTotalSupply2,
          // });

          const obj: CTokenDataForRewards = {
            underlyingToken: underlying,
            underlyingPrice: constants.Zero,
            cToken: cTokenAddr,
            totalSupply: underlyingTotalSupply2 ?? 0,
            underlyingDecimals: parseFloat(underlyingDecimals),
          };

          // console.log({ obj });

          _map[cTokenAddr] = obj;

          return obj;
        })
      );

      return _map;
    }
  );

  return cTokensMap ?? {};
};

interface TokenPricesMap {
  [x: string]: {
    ethPrice: number;
    usdPrice: number;
  };
}

interface TokenPrices {
  tokenPrices: TokenPricesMap;
  ethUSDPrice: number;
}

// Fetches price from pool oracle then from Rari DAO MasterPriceOracle if fail
export const getPriceFromOracles = async (
  tokenAddress: string,
  comptroller: string,
  fuse: Fuse,
  isAuthed: boolean
) => {
  // Rari MPO
  const masterPriceOracle = createMasterPriceOracle(fuse, true);

  // Pool's MPO
  const comptrollerInstance = useCreateComptroller(comptroller, fuse, isAuthed);
  const oracleAddress: string = await comptrollerInstance.callStatic.oracle();
  // const oracleModel: string | undefined = await fuse.getPriceOracle(oracle);
  const oracleContract = createOracle(
    oracleAddress,
    fuse,
    "MasterPriceOracle",
    true
  );

  let price;
  try {
    if (tokenAddress === ETH_TOKEN_DATA.address) {
      price = BigNumber.from(1);
    } else {
      try {
        price = await oracleContract.callStatic.price(tokenAddress);
      } catch {
        price = await masterPriceOracle.callStatic.price(tokenAddress);
      }
    }
  } catch (err) {
    // alert(`ERROR ${oracleAddress} -  ${tokenAddress} - ${comptroller}`);
  }

  return price;
};

// Todo - handle situation where oracle cant find the price
// Todo 2 - make sure that you are always using the Fuse Pool's oracle and that the Fuse Pool's Oracle supports this asset
export const useAssetPricesInEth = (
  tokenAddresses: string[],
  comptroller: string
): TokenPrices | undefined => {
  const { fuse, isAuthed } = useRari();
  const masterPriceOracle = createMasterPriceOracle(fuse);

  const tokensData = useTokensDataAsMap(tokenAddresses);

  const { data } = useQuery(
    "asset prices for " +
      tokenAddresses.join(",") +
      " " +
      Object.keys(tokensData).join(","),
    async () => {
      const [ethUSDBN, ...tokenPricesInEth] = await Promise.all([
        getEthUsdPriceBN(),
        ...tokenAddresses.map(
          async (t) => await getPriceFromOracles(t, comptroller, fuse, isAuthed)
        ),
      ]);

      const ethUSDPrice = parseFloat(ethUSDBN.toString()) / 1e18;
      const tokenUSDPrices: number[] = [];

      // Calc usd prices
      for (let i = 0; i < tokenAddresses.length; i++) {
        const priceInEth = parseFloat(tokenPricesInEth[i]);
        const tokenData = tokensData[tokenAddresses[i]];
        const decimals = tokenData.decimals;

        const price = (priceInEth / 10 ** (decimals ?? 18)) * ethUSDPrice;

        tokenUSDPrices.push(price);
      }

      // construct map
      const tokenPrices: {
        [x: string]: {
          ethPrice: number;
          usdPrice: number;
        };
      } = {};

      for (let i = 0; i < tokenAddresses.length; i++) {
        const tokenAddress = tokenAddresses[i];
        const usdPrice = tokenUSDPrices[i];
        const ethPrice = parseFloat(tokenPricesInEth[i]);
        tokenPrices[tokenAddress] = {
          ethPrice,
          usdPrice,
        };
      }

      return { tokenPrices, ethUSDPrice };
    }
  );

  return data;
};
