// Rari
import { Fuse } from "esm";

// Hooks
import { createOracle } from "../../utils/createComptroller";

// Web3

// Libraries
import axios from "axios";
import { useQuery } from "react-query";
import { EmptyAddress, useRari } from "context/RariContext";
import { ETH_TOKEN_DATA } from "hooks/useTokenData";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { ChainID } from "esm/utils/networks";

export type OracleDataType = {
  admin: string; // Address of Oracle's admin
  adminOverwrite: boolean; // Will tell us if admin can overwrite existing oracle-token pairs
  oracleContract: Contract;
  defaultOracle: undefined | string;
};

// Return a string of what we want to call this oracle
export const useIdentifyOracle = (
  oracleAddr: string,
  poolOracle?: string,
  tokenAddr?: string
): string => {
  const { fuse } = useRari();

  const { data } = useQuery("Identifying Oracle " + oracleAddr, async () => {
    if (tokenAddr && tokenAddr === ETH_TOKEN_DATA.address)
      return "MasterPriceOracle";

    // If no oracle address provided, return empty string
    if (!oracleAddr) return "";

    if (oracleAddr === EmptyAddress && !!poolOracle) {
      // If condition is true it means price feed comes from default oracle
      // From MPO get defaultOracle
      const poolOracleContract = createOracle(
        poolOracle,
        fuse,
        "MasterPriceOracle",
        true
      );

      const poolDefaultOracleAddress =
        await poolOracleContract.callStatic.defaultOracle();

      // From Default oracle get token's oracle
      const poolDefaultOracleContract = createOracle(
        poolDefaultOracleAddress,
        fuse,
        "MasterPriceOracle",
        true
      );

      const tokenOracle = await poolDefaultOracleContract.oracles(tokenAddr);

      // Identify type of oracle used
      const identity = await fuse.identifyPriceOracle(tokenOracle);

      console.log("useIdentifyOracle", { identity, tokenOracle, tokenAddr });

      return identity;
    }

    const identity = await fuse.identifyPriceOracle(oracleAddr);

    if (identity === "MasterPriceOracleV1") return "RariMasterPriceOracle";

    return identity;
  });

  return data ?? "";
};

export const useOracleData = (
  oracleAddress: string,
  fuse: Fuse,
  oracleModel: string | undefined
): OracleDataType | undefined => {
  const { data } = useQuery(
    "Oracle info" + oracleAddress + " Oracle Model: " + oracleModel,
    async () => {
      // If its not v2 or v3 (it is  a legacy oracle), then just return the string of the oracleModel
      // If its MPOv1 or MPOv2 or v3
      // if (
      //   oracleModel !== "MasterPriceOracleV2" &&
      //   oracleModel !== "MasterPriceOracleV3"
      // )
      //   return undefined;

      const oracleContract = createOracle(
        oracleAddress,
        fuse,
        "MasterPriceOracle"
      );

      const admin: string = await oracleContract.callStatic.admin();
      const adminOverwrite: boolean =
        await oracleContract.callStatic.canAdminOverwrite();

      let defaultOracle: string | undefined = undefined;

      if (!(oracleAddress === fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle)) {
        try {
          defaultOracle = await oracleContract.callStatic.defaultOracle();
        } catch (err) {
          console.log("Error fetching default oracle for Pool Oracle");
          console.error(err);
        }
      } else {
        defaultOracle = fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle
      }

      return { admin, adminOverwrite, oracleContract, defaultOracle };
    }
  );

  return data;
};

export const useGetOracleOptions = (
  oracleData: OracleDataType | undefined,
  tokenAddress: string
): { [key: string]: any } | null => {
  const { fuse, chainId } = useRari();
  const isValidAddress = utils.isAddress(tokenAddress);

  const { defaultOracle, oracleContract, adminOverwrite } = oracleData ?? {};
  const oracleAddress = oracleContract?.options?.address ?? undefined;

  // If the pool has a default price oracle (RariMasterPriceOracle), query that oracle's price for this token.
  // If it has an available price, we can let the user choose "Default Price Oracle"
  // We should also set this value initially if it is available and if "Current_Price_Oracle" is null.
  const { data: Default_Price_Oracle } = useQuery(
    "Pool Default Price Oracle " +
    (defaultOracle ?? "") +
    " check price feed for " +
    tokenAddress,
    async () => {
      if (!defaultOracle) return null;

      // If defaultOracle address is empty return null
      if (defaultOracle === ETH_TOKEN_DATA.address) return null;

      const oracleContract = createOracle(
        defaultOracle,
        fuse,
        "MasterPriceOracle"
      );

      // Call the defaultOracle's price to make sure we have a price for this token
      try {
        const price = await oracleContract.callStatic.price(tokenAddress);
        if (parseFloat(price) > 0) return defaultOracle;
      } catch (err) {
        console.error(err);
        return null;
      }
    }
  );

  // If it has a custom oracle set, show this option and show it by default
  // If it doesn't have a custom oracle, then query for the default oracle and show that as the "Current oracle"
  const { data: Current_Price_Oracle } = useQuery(
    "MasterOracle " + oracleAddress ??
    "" +
    " check price feed for " +
    tokenAddress +
    " and default oracle " +
    defaultOracle,
    async () => {
      if (!isValidAddress) return null;
      if (!oracleContract) return null;
      if (!oracleData) return null;

      // Get custom Oracle address for asset from the pools MasterPriceOracle
      const customOracleAddress =
        await oracleData.oracleContract.callStatic.oracles(tokenAddress);

      // If we have a custom oracle address set, retur that
      if (customOracleAddress !== ETH_TOKEN_DATA.address)
        return customOracleAddress;
      // If custom oracleAddress is empty
      //  -- If there isnt a defaultOracle, return null
      //  -- If there is a defaultOracle price for this asset, return the defaultOracle
      //  -- If there isnt a default oracle price, then return null
      // -
      else {
        if (!oracleData.defaultOracle) return null;
        // This is copied from the DefaultOracle query
        else {
          const oracleContract = createOracle(
            oracleData.defaultOracle,
            fuse,
            "MasterPriceOracle"
          );

          // Call the defaultOracle's price to make sure we have a price for this token
          try {
            const price = await oracleContract.callStatic.price(tokenAddress);
            if (parseFloat(price) > 0) return oracleData.defaultOracle;
          } catch (err) {
            console.log(
              "Current_Price_Oracle: Default_Price_Oracle: could not fetch price"
            );
            console.error(err);
            return null;
          }
        }
      }
    }
  );

  // If the pool does not have a default oracle (RariMasterPriceOracle) then show this option.
  // If the pool already has a default oracle (RariMasterPriceOracle) then we don't have to show this.
  // In case the Pool's default RariMasterPriceOracle cannot fetch the price for this asset, there would be no point in choosing this option.
  const { data: Rari_MasterPriceOracle } = useQuery(
    "RariMasterPriceOracle price feed check for " + tokenAddress,
    async () => {
      if (
        !isValidAddress ||
        (!adminOverwrite && !Current_Price_Oracle === null) ||
        !!defaultOracle || // our defaultOracle IS RariMasterPriceOracle. ||
        !oracleData
      ) {
        return null;
      }

      // If address is valid and admin can overwrite, get Oracle address for the asset from RariMasterPriceOracle
      const oracleContract = createOracle(
        fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle,
        fuse,
        "MasterPriceOracle"
      );


      try {
        const oracleAddress = await oracleContract.callStatic.oracles(
          tokenAddress
        );

        console.log("MasterPriceOracle", oracleContract, { tokenAddress, oracleAddress })

        // If oracleAddress is empty return null, else return the RARI MASTER PRICE ORACLE
        if (oracleAddress === EmptyAddress) return null;
        return fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle;
      } catch {
        return null
      }

    }
  );

  const { data: Chainlink_Oracle } = useQuery(
    "Chainlink price feed check for: " + tokenAddress + " chainId " + chainId,
    async () => {
      if (
        !isValidAddress ||
        (!adminOverwrite && !Current_Price_Oracle === null) ||
        !oracleData
      )
        return null;

      let oracleAddress =
        chainId === ChainID.ARBITRUM
          ? fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES
            .ChainlinkPriceOracleV2
          : fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES
            .ChainlinkPriceOracleV3;

      // If address is valid and admin can overwrite, get price for the asset from ChainlinkPriceOracle
      const oracleContract = createOracle(
        oracleAddress,
        fuse,
        "ChainlinkPriceOracle"
      );
      try {
        const oraclePrice = await oracleContract.callStatic.price(tokenAddress);
        // If price is zero, this means theres no pricefeed for the asset so return null
        // If we receive a price, return ChainlinkPriceOracle address
        if (oraclePrice <= 0) return null;
        return oracleAddress;
      } catch (err) {
        return null
      }



    }
  );

  // We mount this hook to get data from cache.
  // We need this because if there's no whitelisted uniswap pool,
  // we shouldn't return Uniswap_V3_Oracle as an option

  // TODO:
  const { data: liquidity, error } = useQuery(
    `UniswapV3 pool liquidity for ${tokenAddress} on ChainID: ${chainId}`,
    async () => {
      const tokenAddressFormatted = tokenAddress.toLowerCase();

      // TODO: Config file
      const graphUrl =
        chainId === ChainID.ETHEREUM
          ? "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
          : "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal";

      return (
        await axios.post(graphUrl, {
          query: `{
            token(id:"${tokenAddressFormatted}") {
              whitelistPools {
                id,
                feeTier,
                totalValueLockedUSD,
                token0 {
                  name,
                  id,
                  symbol
                },
                token1 {
                  name,
                  id,
                  symbol
                },
                volumeUSD
              }
            }
          }`,
        })
      ).data.data;
    },
    { refetchOnMount: false }
  );

  // If theres no whitelisted pool for the asset, or if there was an error return null
  // Otherwise its return ''
  // In the UniswapV3PriceOracleConfigurator, we will mount the hook above to get info
  const Uniswap_V3_Oracle =
    !liquidity?.token?.whitelistPools || error ? null : "";

  const { SushiPairs, SushiError, UniV2Pairs, univ2Error } =
    useSushiOrUniswapV2Pairs(tokenAddress);

  // If theres no whitelisted pool for the asset, or if there was an error return null
  // Otherwise its return ''
  // In the UniswapV3PriceOracleConfigurator, we will mount the hook above to get info
  const Uniswap_V2_Oracle =
    UniV2Pairs === null ||
      UniV2Pairs === undefined ||
      UniV2Pairs.length === 0 ||
      univ2Error
      ? null
      : "";

  const SushiSwap_Oracle =
    SushiPairs === null ||
      SushiPairs === undefined ||
      SushiPairs.length === 0 ||
      SushiError
      ? null
      : "";


  const oracleOptions = {
    Default_Price_Oracle,
    Current_Price_Oracle,
    Rari_MasterPriceOracle,
    Chainlink_Oracle,
    Uniswap_V3_Oracle,
    Uniswap_V2_Oracle,
    SushiSwap_Oracle,
    Custom_Oracle: " ",
  }

  // If tokenAddress is not a valid address return null.
  // If tokenAddress is valid and oracle admin can overwrite or if admin can't overwrite but there's no preset, return all options
  // If tokenAddress is valid but oracle admin can't overwrite, return the preset oracle address,

  const Data = !isValidAddress
    ? null
    : adminOverwrite || Current_Price_Oracle === null
      ? oracleOptions
      : { Current_Price_Oracle };

  return Data;
};

export const useSushiOrUniswapV2Pairs = (tokenAddress: string) => {
  const { chainId } = useRari();
  const { data: UniV2Pairs, error: univ2Error } = useQuery(
    "UniswapV2 pairs for  " + tokenAddress,
    async () => {
      if (chainId != ChainID.ETHEREUM) return null;
      const lowerCaseAddress = tokenAddress.toLocaleLowerCase();
      const pairs = await axios.post(
        "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
        {
          query: `{
          pairs(first: 10, orderBy: totalSupply, orderDirection: desc, where: { token0: "${lowerCaseAddress}", totalSupply_gt: 10000 } ) {
            id,
           token0 {
             id,
             symbol
           },
           token1 {
             id,
             symbol
           }
           totalSupply
          }
         }`,
        }
      );
      return pairs !== undefined &&
        pairs.data !== undefined &&
        pairs.data.data.pairs !== undefined
        ? pairs.data.data.pairs
        : null;
    },
    { refetchOnMount: false }
  );

  const { data: SushiPairs, error: SushiError } = useQuery(
    "SushiSwap pairs for  " + tokenAddress + " " + chainId,
    async () => {
      const graphUrl =
        chainId === ChainID.ETHEREUM
          ? "https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork"
          : "https://api.thegraph.com/subgraphs/name/simplefi-finance/sushiswap-arbitrum";

      const pairs = await axios.post(graphUrl, {
        query: `{
          pairs(first: 10, orderBy: totalSupply, orderDirection: desc, where: { token0: "${tokenAddress.toLocaleLowerCase()}" } ) {
            id,
           token0 {
             id,
             symbol
           },
           token1 {
             id,
             symbol
           }
           totalSupply
          }
         }`,
      });
      return pairs !== undefined &&
        pairs.data !== undefined &&
        pairs.data.data.pairs !== undefined
        ? pairs.data.data.pairs.filter((pair: any) => pair.totalSupply > 10000)
        : null;
    },
    { refetchOnMount: false }
  );

  return { SushiPairs, SushiError, UniV2Pairs, univ2Error };
};
