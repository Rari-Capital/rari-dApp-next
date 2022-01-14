import { Fuse } from "../esm";

import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ChainID } from "esm/utils/networks";

export const alchemyURL = `https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN`;
export const providerURL = `http://127.0.0.1:8545/`;

export function chooseBestWeb3Provider(): JsonRpcProvider | Web3Provider {
  const isClient = typeof window === "object";
  if (!isClient) {
    return new JsonRpcProvider(alchemyURL);
  }

  if (window.ethereum) {
    return new Web3Provider(window.ethereum);
  } else if (window.web3) {
    return new Web3Provider(window.web3.currentProvider);
  } else {
    return new JsonRpcProvider(alchemyURL);
  }
}

export const initFuseWithProviders = (
  provider = chooseBestWeb3Provider(),
  chainId = 1
): Fuse => {
  const fuse = new Fuse(provider, chainId);

  let url =
    chainId === ChainID.ARBITRUM_TESTNET
      ? "https://arb-rinkeby.g.alchemy.com/v2/PkZ7ilUhTBT6tHUsgToel62IOcuyKcwb"
      : alchemyURL;

  console.log({ url });

  // @ts-ignore We have to do this to avoid Infura ratelimits on our large calls.
  fuse.contracts.FusePoolLens = fuse.contracts.FusePoolLens.connect(
    new JsonRpcProvider(url)
  );

  return fuse;
};
