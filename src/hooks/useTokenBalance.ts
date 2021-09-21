// React
import { useMemo } from "react";
import { useQueries, useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";
import { Fuse } from '../esm/index'
import ERC20ABI from "../esm/Vaults/abi/ERC20.json"

// Hooks
import { ETH_TOKEN_DATA } from "./useTokenData";
import BigNumber from "bignumber.js";

// Ethers
import { Contract, BigNumber as EthersBigNumber } from 'ethers'

export const fetchTokenBalance = async (
  tokenAddress: string,
  fuse: Fuse,
  address?: string
): Promise<EthersBigNumber> => {
  let stringBalance;

  if (!address || address === ETH_TOKEN_DATA.address) {
    stringBalance = "0";
  } else if (
    tokenAddress === ETH_TOKEN_DATA.address ||
    tokenAddress === "NO_ADDRESS_HERE_USE_WETH_FOR_ADDRESS"
  ) {
    stringBalance = await fuse.provider.getBalance(address);
  } else {
    const contract = new Contract(tokenAddress,ERC20ABI as any, fuse.provider.getSigner());
    stringBalance = await contract.callStatic.balanceOf(address);
  }

  return stringBalance;
};

export function useTokenBalance(tokenAddress: string) {
  const { fuse, address } = useRari();

  const { data, isLoading } = useQuery(
    tokenAddress + " balanceOf " + address,
    () => fetchTokenBalance(tokenAddress, fuse, address)
  );

  return { data, isLoading };
}

export function useTokenBalances(tokenAddresses: string[]): number[] {
  const { fuse, address } = useRari();

  const balances = useQueries(
    tokenAddresses.map((tokenAddress: string) => {
      return {
        queryKey: tokenAddress + " balance",
        queryFn: () => {
          return fetchTokenBalance(tokenAddress, fuse, address);
        },
      };
    })
  );

  return useMemo(() => {
    return balances.map((bal) => {
      return bal.data ? parseFloat((bal.data as BigNumber).toString()) : 0;
    });
  }, [balances]);
}
