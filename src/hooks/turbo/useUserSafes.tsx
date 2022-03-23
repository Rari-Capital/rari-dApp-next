import { useMemo } from "react";

import { useQuery } from "react-query";
import { SafeInfo } from "turbo/fetchers/getSafeInfo";
import { getAllUserSafes } from "turbo/fetchers/getAllUserSafes";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

export const useGetAllUserSafes = (): SafeInfo[] | undefined => {
  const [{ data: userData }] = useAccount()
  const [{ data: network }] = useNetwork()
  const provider = useProvider()

  const { data: safes } = useQuery(
    `User: ${userData?.address} safes`,
    async () => {
        if(!userData?.address || !network.chain?.id) return
        return await getAllUserSafes(provider, userData?.address, network.chain?.id)
    }
  );
  return safes;
};


