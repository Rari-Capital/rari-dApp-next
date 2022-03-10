import axios from "axios";
import { ChainID } from "esm/utils/networks";
import { ETH_TOKEN_DATA } from "hooks/useTokenData";
import { RariApiTokenData, TokensDataMap } from "types/tokens";

// Fetches Token Api Data for a single address
export const fetchTokenAPIData = async (
  address: string,
  chainId: number
): Promise<RariApiTokenData> => {
  if (address === ETH_TOKEN_DATA.address) return ETH_TOKEN_DATA;
  let url = `https://v2.rari.capital/api/tokenData?address=${address.toLowerCase()}&chainId=${chainId}`;
  const { data } = await axios.get(url);

  if (address == "0xa693B19d2931d498c5B318dF961919BB4aee87a5") {
    return {
      symbol: "USTw",
      name: "UST (Wormhole)",
      decimals: 6,
      logoURL:
        "https://raw.githubusercontent.com/sushiswap/icons/master/token/ust.jpg",
      color: "#5494fa",
      overlayTextColor: "#fff",
      address: "0xa693B19d2931d498c5B318dF961919BB4aee87a5",
    };
  }
  return data;
};

// Returns a hashmap of Token API Data for easy lookups
export const fetchTokensAPIDataAsMap = async (
  addresses: string[],
  chainId?: ChainID | undefined
): Promise<TokensDataMap> => {
  if (!chainId) return {};
  const uniqueAddresses = Array.from(new Set(addresses));

  const tokenDatas = await fetchTokensAPIData(uniqueAddresses, chainId);

  // construct a map for easy lookups
  const tokensDataMap: { [address: string]: RariApiTokenData } = {};
  for (let i: number = 0; i < uniqueAddresses.length; i++) {
    tokensDataMap[uniqueAddresses[i]] = tokenDatas[i];
  }

  return tokensDataMap;
};

// Returns a list of Token API Data
export const fetchTokensAPIData = async (
  addresses: string[],
  chainId: ChainID
): Promise<RariApiTokenData[]> => {
  try {
    const fetchers = addresses.map((addr) => fetchTokenAPIData(addr, chainId));
    const tokenDatas: RariApiTokenData[] = await Promise.all(fetchers);
    return tokenDatas;
  } catch {
    return [];
  }
};

export async function fetchTokenDataWithCache(
  address: string,
  chainId: ChainID
) {
  if (typeof window === undefined) {
    return await fetchTokenAPIData(address.toLowerCase(), chainId);
  }
  const storageKey = "tokenInfo:" + address;
  if (window.sessionStorage.getItem(storageKey)) {
    return JSON.parse(window.sessionStorage.getItem(storageKey) as string);
  }

  // if not in storage, fetch it fresh
  const tokenData = await fetchTokenAPIData(address.toLowerCase(), chainId);
  window.sessionStorage.setItem(storageKey, JSON.stringify(tokenData));

  return tokenData;
}
