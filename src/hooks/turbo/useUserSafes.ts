import { useQuery } from "react-query";

import { useRari } from "context/RariContext";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { getAllUserSafes } from "lib/turbo/fetchers/safes/getAllUserSafes";
import { MOCK_SAFE_1, MOCK_SAFE_2 } from "./test/mocks";

export const useAllUserSafes = (): SafeInfo[] | undefined => {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    return [MOCK_SAFE_1, MOCK_SAFE_2];
  }

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


