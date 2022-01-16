// React
import { useMemo } from "react";
import { useQueries, useQuery } from "react-query";

// 13
import { getBalancesForEthereumAddress } from "ethereum-erc20-token-balances-multicall";

// Rari
import { useRari } from "context/RariContext";
import { Fuse } from "../esm/index";
import ERC20ABI from "../esm/Vaults/abi/ERC20.json";

// Hooks
import { ETH_TOKEN_DATA } from "./useTokenData";

// Ethers
import { Contract, BigNumber as EthersBigNumber, constants } from "ethers";
import { chooseBestWeb3Provider } from "utils/web3Providers";


export function useERC20Balances(tokenAddresses: string[]) {
  const { fuse, address, chainId } = useRari();

  const {data: balances} = useQuery(tokenAddresses.join(', '), async () => {
       const balances = await getBalancesForEthereumAddress({
        // erc20 tokens you want to query!
        contractAddresses: tokenAddresses,
        // ethereum address of the user you want to get the balances for
        ethereumAddress: address,
        // your web3 provider
        providerOptions: {
          web3Instance: chooseBestWeb3Provider(),
        },
      });

      console.log({balances})

      

  return useMemo(() => {
    return balances.map((bal) => {
      return bal.data
        ? parseFloat((bal.data as EthersBigNumber).toString())
        : 0;
    });
  }, [balances]);
}
