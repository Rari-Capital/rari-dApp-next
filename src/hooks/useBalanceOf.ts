import { useQueries, useQuery, UseQueryResult } from "react-query";
import { balanceOf } from "utils/erc20Utils";
import { BigNumber, constants } from "ethers";
import { useRari } from "context/RariContext";


const fetchBalanceOf = async (provider: any, holder: string | undefined, tokenAddress: string | undefined) => {
  if (!holder || !tokenAddress) return constants.Zero;
  const balance = await balanceOf(holder, tokenAddress, provider);
  return balance;
}

export const useBalanceOf = (
  holder: string | undefined,
  tokenAddress: string | undefined
) => {
  const { provider } = useRari();
  const { data: balance } = useQuery(
    `${holder} balance of ${tokenAddress}`,
    async () => await fetchBalanceOf(provider, holder, tokenAddress)
  );

  return balance ?? constants.Zero;
};

export type BalancesMap = {
  [account: string]: BigNumber
}
export const useBalancesOfMultipleAddresses = (
  holders: string[],
  tokenAddress: string,
): BalancesMap => {
  const { provider } = useRari();
  const result: UseQueryResult[] = useQueries(
    holders.map(holder => {
      return {
        queryKey: `${holder} balance of ${tokenAddress}`,
        queryFn: async () => await fetchBalanceOf(provider, holder, tokenAddress)
      }

    })
  )

  const balancesMap: BalancesMap = result.reduce((acc: BalancesMap, r, i) => {
    const { data } = r
    return {
      ...acc,
      [holders[i]]: data as BigNumber
    }
  }, {})

  return balancesMap
};
