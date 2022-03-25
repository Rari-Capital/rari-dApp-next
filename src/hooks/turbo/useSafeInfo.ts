import { useQuery } from "react-query";
import { SafeInfo, getSafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { useRari } from "context/RariContext";

export const useSafeInfo = (safe: string): SafeInfo | undefined => {
  const { provider, chainId } = useRari()

  const { data: safeInfo } = useQuery(
    `Safe info for: ${safe}`,
    async () => {
        if(!safe || !provider || !chainId) return
        return await getSafeInfo(provider, safe, chainId)
    }
  );
  return safeInfo;
};

