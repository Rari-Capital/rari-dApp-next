import { useQuery } from "react-query";

import { useRari } from "context/RariContext";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { getAllUserSafes } from "lib/turbo/fetchers/safes/getAllUserSafes";

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


