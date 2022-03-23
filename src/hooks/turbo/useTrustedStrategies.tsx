import { useMemo } from "react";
import { useQuery } from "react-query";
import { getBoostableStrategies } from "lib/turbo/fetchers/getBoostableStrategies";
import { useRari } from "context/RariContext";


// Trusted Strategies will be independent of any Safe and whitelisted by TRIBE Governance
export const useTrustedStrategies = (): string[] | undefined => {
    const { provider, chainId } = useRari() 

    const {data: trustedStrategies }= useQuery(
      `Boostable strategies`, async () => {
          if(!provider || !chainId) return
          return await getBoostableStrategies(
            provider,
            chainId
          )
      }
    );

  return trustedStrategies ;
};