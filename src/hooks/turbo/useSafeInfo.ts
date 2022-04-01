import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { getUSDPricedSafeInfo, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

export const useSafeInfo = (safe: string): USDPricedTurboSafe | undefined => {
  const { provider, chainId } = useRari()

  const { data: safeInfo } = useQuery(
    `Safe info for: ${safe}`,
    async () => {
      if (!safe || !provider || !chainId) return
      return await getUSDPricedSafeInfo(provider, safe, chainId)
    }
  );
  return safeInfo;
};

