import { useQuery, useQueries, UseQueryResult } from "react-query";
import { Pool } from "../utils/poolUtils";

import { fetchRGTAPR, fetchPoolAPY } from "../utils/fetchPoolAPY";
import { useMemo } from "react";
import { PoolInterface } from "constants/pools";
import useVaultsSDK from "./vaults/useVaultsSDK";

export const useRGTAPR = () => {
  const { rari } = useVaultsSDK();
  const { data: rgtAPR } = useQuery("rgtAPR", async () => fetchRGTAPR(rari));
  return rgtAPR;
};

export const usePoolAPY = (pool: Pool | undefined) => {
  const { rari } = useVaultsSDK();
  const { data: poolAPY } = useQuery(pool + " apy", () => {
    return fetchPoolAPY(rari, pool);
  });

  return poolAPY;
};

// Fetch APYs for all pools
export const usePoolsAPY = (pools: PoolInterface[]) => {
  const { rari } = useVaultsSDK();

  const poolAPYs: UseQueryResult[] = useQueries(
    pools.map(({ type: poolType }) => {
      return {
        queryKey: poolType + " apy",
        queryFn: () => fetchPoolAPY(rari, poolType),
      };
    })
  );

  return useMemo(() => {
    return !poolAPYs.length ? [] : poolAPYs.map(({ data: poolAPY }) => poolAPY);
  }, [poolAPYs]);
};
