import axios from "axios";
import { ETH_TOKEN_DATA } from "hooks/useTokenData";
import { RariApiTokenData } from "types/tokens";

// Fetches Token Api Data for a single address
export const fetchTokenAPIData = async (
  address: string
): Promise<RariApiTokenData> => {
  if (address === ETH_TOKEN_DATA.address) return ETH_TOKEN_DATA;
  const url = `https://app.rari.capital/api/tokenData?address=${address}`;
  const { data } = await axios.get(url);
  return data;
};

// Returns a hashmap of Token API Data for easy lookups
export const fetchTokensAPIDataAsMap = async (
  addresses: string[]
): Promise<{ [address: string]: RariApiTokenData }> => {
  
  const uniqueAddresses = Array.from(new Set(addresses));

  const tokenDatas = await fetchTokensAPIData(uniqueAddresses);

  // construct a map for easy lookups
  const tokensDataMap: { [address: string]: RariApiTokenData } = {};
  for (let i: number = 0; i < uniqueAddresses.length; i++) {
    tokensDataMap[uniqueAddresses[i]] = tokenDatas[i];
  }

  return tokensDataMap;
};

// Returns a list of Token API Data
export const fetchTokensAPIData = async (
  addresses: string[]
): Promise<RariApiTokenData[]> => {
  try {
    const fetchers = addresses.map((addr) => fetchTokenAPIData(addr));
    const tokenDatas: RariApiTokenData[] = await Promise.all(fetchers);
    return tokenDatas;
  } catch {
    return [];
  }
};