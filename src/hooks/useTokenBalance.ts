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

import { providers } from "@0xsequence/multicall";

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

export const useTokenBalances = (tokenAddresses: string[]): number[] => {
  //TODO BalancesContext calls this multiple times with empty tokenAddresses array
  const { fuse, address, isAuthed } = useRari();

  const multiCallProvider = new providers.MulticallProvider(fuse.provider);
  return (
    useQuery<number[] | undefined>(
      address + " balancesMulticall " + tokenAddresses.join(" "),
      () => {
        if (!isAuthed) return undefined;
        return Promise.all<number>(
          tokenAddresses.map((tokenAddress: string) => {
            if (tokenAddress === ETH_TOKEN_DATA.address)
              return fuse.provider.getBalance(address);

            let contract = new Contract(
              tokenAddress,
              ERC20ABI as any,
              multiCallProvider
            );
            return contract
              .balanceOf(address)
              .then((balance: number) => parseFloat(balance.toString()))
              .catch((_err: any) => {});
          })
        );
      }
    ).data || []
  );
};
