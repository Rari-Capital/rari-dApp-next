import { useMemo } from "react";

import { useQuery, useQueries } from "react-query";
import ERC20ABI from "../esm/Vaults/abi/ERC20.json";
import { useRari } from "../context/RariContext";

import { Contract } from "ethers";

export const ETH_TOKEN_DATA = {
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  name: "Ethereum",
  decimals: 18,
  color: "#627EEA",
  overlayTextColor: "#fff",
  logoURL:
    "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/64/Ethereum-ETH-icon.png",
};

export const WETH9_TOKEN_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const WETH9_TOKEN_ADDRESS_KOVAN =
  "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  color: string;
  overlayTextColor: string;
  logoURL: string;
}

export const useTokenDataWithContract = (address: string) => {
  const { fuse } = useRari();

  const tokenData = useTokenData(address);

  const contract = useMemo(
    () => new Contract(address, ERC20ABI as any, fuse.provider),
    [address]
  );

  return { tokenData, contract };
};

export const fetchTokenData = async (address: string): Promise<TokenData> => {
  let data;

  if (address !== ETH_TOKEN_DATA.address) {
    try {
      // Since running the vercel functions requires a Vercel account and is super slow,
      // just fetch this data from the live site in development:
      let url =
        (process.env.NODE_ENV === "development"
          ? "https://app.rari.capital"
          : "") +
        "/api/tokenData?address=" +
        address;

      data = {
        ...(await fetch(url).then((res) => res.json())),
        address: address,
      };
    } catch (e) {
      data = {
        name: null,
        address: null,
        symbol: null,
        decimals: null,
        color: null,
        overlayTextColor: null,
        logoURL: null,
      };
    }
  } else {
    console.log("eth2 address", address);
    data = ETH_TOKEN_DATA;
  }

  return data as TokenData;
};

export const useTokenData = (
  address: string | undefined
): TokenData | undefined => {
  const { data: tokenData } = useQuery(address + " tokenData", async () => {
    return !!address ? await fetchTokenData(address) : undefined;
  });
  return tokenData;
};

export const useTokensData = (addresses: string[]): TokenData[] | null => {
  const tokensData = useQueries(
    addresses.map((address: string) => {
      return {
        queryKey: address + " tokenData",
        queryFn: async () => await fetchTokenData(address),
      };
    })
  );

  return useMemo(() => {
    const ret: any[] = [];

    if (!tokensData.length) return null;

    // Return null altogether
    tokensData.forEach(({ data }) => {
      if (!data) return null;
      ret.push(data);
    });

    if (!ret.length) return null;

    return ret;
  }, [tokensData]);
};

export interface TokensDataMap {
  [address: string]: TokenData;
}

export const useTokensDataAsMap = (addresses: string[] = []): TokensDataMap => {
  const tokensData = useQueries(
    addresses.map((address: string) => {
      return {
        queryKey: address + " tokenData",
        queryFn: async () => await fetchTokenData(address),
      };
    })
  );

  return useMemo(() => {
    const ret: TokensDataMap = {};
    if (!tokensData.length) return {};
    tokensData.forEach(({ data }) => {
      const _data = data as TokenData;
      if (_data && _data.address) {
        ret[_data.address] = _data;
      }
    });

    return ret;
  }, [tokensData]);
};
