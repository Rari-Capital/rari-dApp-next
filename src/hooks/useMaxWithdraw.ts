// React
import { useQuery } from "react-query";

// Rari
import { usePoolType } from "../context/PoolContext";
import { Pool } from "../utils/poolUtils";
import { useRari } from "../context/RariContext";
import { Vaults } from "../esm/index"

// utils
import { getSDKPool } from "../utils/poolUtils";

// Hooks
import { fetchPoolBalance } from "./usePoolBalance";

// Ethers
import { BigNumber } from "@ethersproject/bignumber";

export const fetchMaxWithdraw = async ({
  rari,
  address,
  poolType,
  symbol,
}: {
  rari: Vaults;
  address: string;
  symbol: string;
  poolType: Pool;
}): Promise<BigNumber> => {
  const bigBalance = await fetchPoolBalance({
    pool: poolType,
    rari,
    address,
  });

  const [amount] = await getSDKPool({
    rari,
    pool: poolType,
  }).withdrawals.getMaxWithdrawalAmount(symbol, bigBalance, address);

  return amount;
};

export const useMaxWithdraw = (symbol: string) => {
  const { rari, address } = useRari();

  const poolType = usePoolType();

  const { data: max, isLoading: isMaxLoading } = useQuery(
    address + " max " + symbol,
    async () => {
      return fetchMaxWithdraw({ rari, address, symbol, poolType });
    }
  );

  return { max, isMaxLoading };
};
