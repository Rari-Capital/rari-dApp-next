// React
import { useMemo } from "react";
import { useQueries, useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";
import { Fuse } from "../esm/index";
import ERC20ABI from "../esm/Vaults/abi/ERC20.json";

// Hooks
import { ETH_TOKEN_DATA } from "./useTokenData";

// Ethers
import { Contract, BigNumber as EthersBigNumber, constants } from "ethers";

export const fetchTokenBalance = async (
  tokenAddress: string | undefined,
  fuse: Fuse,
  address?: string,
  chainId = 1
): Promise<EthersBigNumber> => {
  let balance;

  if (chainId !== 1) return constants.Zero;

  if (!tokenAddress) return constants.Zero;

  if (!address || address === ETH_TOKEN_DATA.address) {
    balance = "0";
  } else if (
    tokenAddress === ETH_TOKEN_DATA.address ||
    tokenAddress === "NO_ADDRESS_HERE_USE_WETH_FOR_ADDRESS"
  ) {
    balance = await fuse.provider.getBalance(address);
  } else {
    const contract = new Contract(
      tokenAddress,
      ERC20ABI as any,
      fuse.provider.getSigner()
    );
    balance = await contract.callStatic.balanceOf(address);
  }

  return balance;
};

export function useTokenBalance(
  tokenAddress: string | undefined,
  customHolder?: string
) {
  const { fuse, address } = useRari();

  const addressToCheck = customHolder ?? address;

  return useQuery(tokenAddress + " balanceOf " + addressToCheck, () =>
    fetchTokenBalance(tokenAddress, fuse, addressToCheck)
  );
}

export function useTokenBalances(tokenAddresses: string[]): number[] {
  const { fuse, address, chainId } = useRari();

  const balances = useQueries(
    tokenAddresses.map((tokenAddress: string) => {
      return {
        queryKey: tokenAddress + " balance " + chainId,
        queryFn: () => {
          return fetchTokenBalance(tokenAddress, fuse, address, chainId);
        },
      };
    })
  );

  return useMemo(() => {
    return balances.map((bal) => {
      return bal.data
        ? parseFloat((bal.data as EthersBigNumber).toString())
        : 0;
    });
  }, [balances]);
}
