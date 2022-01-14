// Next
import { useRouter } from "next/router";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import { useQueryClient } from "react-query";
import { useTranslation } from "next-i18next";
import { DASHBOARD_BOX_PROPS } from "../components/shared/DashboardBox";

import { Vaults, Fuse } from "../esm";

import LogRocket from "logrocket";
import { useToast } from "@chakra-ui/react";

import {
  chooseBestWeb3Provider,
  alchemyURL,
  initFuseWithProviders,
} from "../utils/web3Providers";

import { Web3Provider } from "@ethersproject/providers";
import { ChainID, isSupportedChainId } from "esm/utils/networks";

interface ChainMetadata {
  chainId: number;
  name: string;
  imageUrl?: string;
  supported: boolean;
  rpcUrl: string;
}

const chainMetadata = {
  [ChainID.ETHEREUM]: {
    chainId: ChainID.ETHEREUM,
    name: "Ethereum",
    imageUrl: "/static/networks/ethereum.png",
    supported: true,
    rpcUrl:
      "https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN",
  },
  [ChainID.ROPSTEN]: {
    chainId: ChainID.ROPSTEN,
    name: "Ropsten",
    supported: false,
    rpcUrl: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  [ChainID.RINKEBY]: {
    chainId: ChainID.RINKEBY,
    name: "Rinkeby",
    supported: false,
    rpcUrl: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  [ChainID.GÖRLI]: {
    chainId: ChainID.GÖRLI,
    name: "Goerli",
    supported: false,
    rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  [ChainID.KOVAN]: {
    chainId: ChainID.KOVAN,
    name: "Kovan",
    supported: false,
    rpcUrl: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  [ChainID.ARBITRUM]: {
    chainId: ChainID.ARBITRUM,
    name: "Arbitrum",
    imageUrl: "/static/networks/arbitrum.svg",
    supported: false,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  [ChainID.ARBITRUM_TESTNET]: {
    chainId: ChainID.ARBITRUM_TESTNET,
    name: "Arbitrum Testnet",
    imageUrl: "/static/networks/arbitrum.svg",
    supported: true,
    rpcUrl:
      "https://arb-rinkeby.g.alchemy.com/v2/PkZ7ilUhTBT6tHUsgToel62IOcuyKcwb",
  },
  [ChainID.OPTIMISM]: {
    chainId: ChainID.OPTIMISM,
    name: "Optimism",
    imageUrl: "/static/networks/optimism.svg",
    supported: false,
    rpcUrl: "https://mainnet.optimism.io/",
  },
};

export function getSupportedChains(): ChainMetadata[] {
  return Object.values(chainMetadata).filter(
    (chainMetadata) => chainMetadata.supported
  );
}

export function getChainMetadata(chainId: ChainID): ChainMetadata {
  return chainMetadata[chainId];
}

async function launchModalLazy(
  t: (text: string, extra?: any) => string,
  cacheProvider: boolean = true
) {
  const [WalletConnectProvider, Authereum, Fortmatic, Web3Modal] =
    await Promise.all([
      import("@walletconnect/web3-provider"),
      import("authereum"),
      import("fortmatic"),
      import("web3modal"),
    ]);

  const providerOptions = {
    injected: {
      display: {
        description: t("Connect with a browser extension"),
      },
      package: null,
    },
    walletconnect: {
      package: WalletConnectProvider.default,
      options: {
        rpc: {
          1: alchemyURL,
        },
      },
      display: {
        description: t("Scan with a wallet to connect"),
      },
    },
    fortmatic: {
      package: Fortmatic.default,
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY,
      },
      display: {
        description: t("Connect with your {{provider}} account", {
          provider: "Fortmatic",
        }),
      },
    },
    authereum: {
      package: Authereum.default,
      display: {
        description: t("Connect with your {{provider}} account", {
          provider: "Authereum",
        }),
      },
    },
  };

  if (!cacheProvider) {
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  }

  const web3Modal = new Web3Modal.default({
    cacheProvider,
    providerOptions,
    theme: {
      background: DASHBOARD_BOX_PROPS.backgroundColor,
      main: "#FFFFFF",
      secondary: "#858585",
      border: DASHBOARD_BOX_PROPS.borderColor,
      hover: "#000000",
    },
  });

  return web3Modal.connect();
}

export interface RariContextData {
  rari: Vaults;
  fuse: Fuse;
  web3ModalProvider: any | null;
  isAuthed: boolean;
  login: (cacheProvider?: boolean) => Promise<any>;
  logout: () => any;
  address: string;
  isAttemptingLogin: boolean;
  chainId: number | undefined;
  switchNetwork: (newChainId: number) => void;
}

export const EmptyAddress = "0x0000000000000000000000000000000000000000";

export const RariContext = createContext<RariContextData | undefined>(
  undefined
);

export const RariProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { address: requestedAddress } = router.query;

  // Rari and Fuse get initally set already
  const [rari, setRari] = useState<Vaults>(
    () => new Vaults(chooseBestWeb3Provider())
  );
  const [fuse, setFuse] = useState<Fuse>(() => initFuseWithProviders());

  const [isAttemptingLogin, setIsAttemptingLogin] = useState<boolean>(false);

  const [address, setAddress] = useState<string>(EmptyAddress);

  const [web3ModalProvider, setWeb3ModalProvider] = useState<any | null>(null);

  const [chainId, setChainId] = useState<number | undefined>();

  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Check the user's network:
  useEffect(() => {
    Promise.all([
      fuse.provider.send("net_version", []),
      fuse.provider.getNetwork(),
    ]).then(([netId, network]) => {
      const { chainId } = network;
      console.log("Network ID: " + netId, "Chain ID: " + chainId);
      setChainId(chainId);

      // // Don't show "wrong network" toasts if dev
      // if (process.env.NODE_ENV === "development") {
      //   return;
      // }

      if (!isSupportedChainId(chainId)) {
        setTimeout(() => {
          toast({
            title: "Unsupported network!",
            description: "Supported Networks: Mainnet, Arbitrum, Optimism",
            status: "warning",
            position: "bottom-right",
            duration: 300000,
            isClosable: true,
          });
        }, 1500);
      }
    });
  }, [fuse, toast]);

  // We need to give rari the new provider (todo: and also ethers.js signer) every time someone logs in again
  const setRariAndAddressFromModal = useCallback(
    async (modalProvider) => {
      const provider = new Web3Provider(modalProvider);
      const { chainId } = await provider.getNetwork();

      console.log({ chainId });

      let _chainId =
        chainId === ChainID.ETHEREUM_TESTNET ? ChainID.ETHEREUM : chainId;

      const rariInstance = new Vaults(provider);
      const fuseInstance = initFuseWithProviders(provider, _chainId);

      console.log({ fuseInstance });

      setRari(rariInstance);
      setFuse(fuseInstance);

      rariInstance.provider.listAccounts().then((addresses: string[]) => {
        if (addresses.length === 0) {
          console.log("Address array was empty. Reloading!");
          router.reload();
        }

        const address = addresses[0];
        const requestedAddress = router.query.address as string;

        console.log("Setting Logrocket user to new address: " + address);
        LogRocket.identify(address);

        console.log("Requested address: ", requestedAddress);
        setAddress(requestedAddress ?? address);
      });
    },
    [setRari, setAddress, requestedAddress]
  );

  const login = useCallback(
    async (cacheProvider: boolean = true) => {
      try {
        setIsAttemptingLogin(true);
        const providerWeb3Modal = await launchModalLazy(t, cacheProvider);
        setWeb3ModalProvider(providerWeb3Modal);
        setRariAndAddressFromModal(providerWeb3Modal);
        setIsAttemptingLogin(false);
      } catch (err) {
        console.log(err);
        setIsAttemptingLogin(false);
        return console.error(err);
      }
    },
    [setWeb3ModalProvider, setRariAndAddressFromModal, setIsAttemptingLogin, t]
  );

  const refetchAccountData = useCallback(() => {
    console.log("New account, clearing the queryClient!");

    setRariAndAddressFromModal(web3ModalProvider);

    queryClient.clear();
  }, [setRariAndAddressFromModal, web3ModalProvider, queryClient]);

  const logout = useCallback(() => {
    setWeb3ModalProvider((past: any) => {
      if (past?.off) {
        past.off("accountsChanged", refetchAccountData);
        past.off("chainChanged", refetchAccountData);
      }

      return null;
    });

    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");

    setAddress(EmptyAddress);
  }, [setWeb3ModalProvider, refetchAccountData]);

  useEffect(() => {
    if (web3ModalProvider !== null && web3ModalProvider.on) {
      web3ModalProvider.on("accountsChanged", refetchAccountData);
      web3ModalProvider.on("chainChanged", refetchAccountData);
    }

    return () => {
      if (web3ModalProvider?.off) {
        web3ModalProvider.off("accountsChanged", refetchAccountData);
        web3ModalProvider.off("chainChanged", refetchAccountData);
      }
    };
  }, [web3ModalProvider, refetchAccountData]);

  // Based on Metamask-recommended code at
  // https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain
  // TODO(nathanhleung) handle all possible errors
  const switchNetwork = async function (chainId: ChainID) {
    const hexChainId = chainId.toString(16);
    const chainMetadata = getChainMetadata(chainId);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${hexChainId}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${hexChainId}`,
                chainName: chainMetadata.name,
                rpcUrls: [chainMetadata.rpcUrl],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    } finally {
      refetchAccountData();
    }
  };

  const value = useMemo(
    () => ({
      web3ModalProvider,
      rari,
      fuse,
      isAuthed: address !== EmptyAddress,
      login,
      logout,
      address,
      isAttemptingLogin,
      chainId,
      switchNetwork,
    }),
    [rari, web3ModalProvider, login, logout, address, fuse, isAttemptingLogin]
  );

  return <RariContext.Provider value={value}>{children}</RariContext.Provider>;
};

// Hook
export function useRari() {
  const context = useContext(RariContext);

  if (context === undefined) {
    throw new Error(`useRari must be used within a RariProvider`);
  }

  return context;
}
