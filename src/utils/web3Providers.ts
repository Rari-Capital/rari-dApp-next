import { Fuse } from "../esm";

import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ChainID, getChainMetadata } from "esm/utils/networks";

export const alchemyURL = `https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN`;
export const providerURL = `http://127.0.0.1:8545/`;

export function chooseBestWeb3Provider(
  /**
   * Default chain is mainnet. Used for SSR or for when theres no wallet in the browser.
   */
  chainId = 1,
  /**
   * If true this is being used by vaults, in which case we only need a JsonRpc provider
   *  thats because this app only reads opportunities from vaults and routes the user to the old
   *  interface if they want to interact with vaults.
   */
  vaults?: boolean
): JsonRpcProvider | Web3Provider {

  let providerURL = getChainMetadata(chainId).rpcUrl ?? "";

  const isClient = typeof window === "object";
  if (!isClient || vaults) {
    return new JsonRpcProvider(providerURL);
  }

  if (window.ethereum) {
    // @ts-ignore
    return new Web3Provider(window.ethereum)
  } else {
    return new JsonRpcProvider(providerURL);
  }

}

export const initFuseWithProviders = (
  provider = chooseBestWeb3Provider(),
  chainId: ChainID = 1
): Fuse => {
  const fuse = new Fuse(provider, chainId === 31337 ? 1 : chainId);
  let lensProvider = getChainMetadata(chainId).rpcUrl ?? "";
  // @ts-ignore We have to do this to avoid Infura ratelimits on our large calls.
  fuse.contracts.FusePoolLens = fuse.contracts.FusePoolLens.connect(
    new JsonRpcProvider(lensProvider)
  );
  fuse.contracts.FusePoolLensSecondary = fuse.contracts.FusePoolLensSecondary.connect(
    new JsonRpcProvider(lensProvider)
  );
  return fuse;
};
