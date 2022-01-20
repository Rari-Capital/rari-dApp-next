import { useQuery } from "react-query";
import { Pool } from "../utils/poolUtils";
import { getSDKPool } from "../utils/poolUtils";
import useVaultsSDK from "./vaults/useVaultsSDK";

export const useNoSlippageCurrencies = (pool: Pool) => {
  const { rari } = useVaultsSDK();

  const { data } = useQuery(pool + " noSlippageCurrencies", async () => {
    let noSlippageCurrencies: string[];

    if (pool === Pool.ETH) {
      noSlippageCurrencies = ["ETH"];
    } else {
      noSlippageCurrencies = await getSDKPool({
        rari,
        pool,
      }).deposits.getDirectDepositCurrencies();
    }

    if (noSlippageCurrencies.length === 0) {
      return ["None"];
    }

    return noSlippageCurrencies;
  });

  return data;
};
