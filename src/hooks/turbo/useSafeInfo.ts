import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { getUSDPricedSafeInfo, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { MOCK_SAFE_1 } from "./test/mocks";

export const useSafeInfo = (safe: string): USDPricedTurboSafe | undefined => {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    return MOCK_SAFE_1;
  }

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

