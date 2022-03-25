import { useQuery } from "react-query";

import { useRari } from "context/RariContext";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { getAllUserSafes } from "lib/turbo/fetchers/getAllUserSafes";

export const useAllUserSafes = (): SafeInfo[] | undefined => {
  const { address, provider, chainId } = useRari()

  const { data: safes } = useQuery(
    `User: ${address} safes`,
    async () => {
        if(!address || !chainId) return
        return await getAllUserSafes(provider, address, chainId)
    }
  );
  return safes;
};


