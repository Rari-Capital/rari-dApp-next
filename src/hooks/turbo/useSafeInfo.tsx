import { useMemo } from "react";
import { useQuery } from "react-query";
import { SafeInfo, getSafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { useNetwork, useProvider } from "wagmi";
// import ERC20ABI from "contracts/abi/ERC20.json";

export const useSafeInfo = (safe: string): SafeInfo | undefined => {
  // get provider
  const provider = useProvider()
  const [{ data: network }] = useNetwork()

  const { data: safeInfo } = useQuery(
    `Safe info for: ${safe}`,
    async () => {
        if(!safe || !provider || !network.chain?.id) return
        return await getSafeInfo(provider, safe, network.chain?.id)
    }
  );
  return safeInfo;
};