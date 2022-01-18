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
import {
  ChainID,
  isSupportedChainId,
  getChainMetadata,
} from "esm/utils/networks";

async function launchModalLazy(
  t: (text: string, extra?: any) => string,
  cacheProvider: boolean = true
) {
  const [WalletConnectProvider, Web3Modal] = await Promise.all([
    import("@walletconnect/web3-provider"),
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

  console.log({ chainId });
  // Check the user's network:
  useEffect(() => {
    Promise.all([
      fuse.provider.send("net_version", []),
      fuse.provider.getNetwork(),
    ]).then(([netId, network]) => {
      const { chainId } = network;
      console.log("Network ID: " + netId, "Chain ID: " + chainId);

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
      setChainId(chainId);
    });
  }, [fuse, toast]);

  // We need to give rari the new provider (todo: and also ethers.js signer) every time someone logs in again
  const setRariAndAddressFromModal = useCallback(
    async (modalProvider) => {
      const provider = new Web3Provider(modalProvider);
      const { chainId } = await provider.getNetwork();
      let _chainId = chainId === 31337 ? ChainID.ETHEREUM : chainId;
      const rariInstance = new Vaults(provider);

      const fuseInstance = initFuseWithProviders(provider, _chainId);

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
        console.log("login 0");
        const providerWeb3Modal = await launchModalLazy(t, cacheProvider);
        console.log("login 1");
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
    console.log("New account, clearing the queryClient! ChainId: ", chainId);

    setRariAndAddressFromModal(web3ModalProvider);

    queryClient.clear();
  }, [setRariAndAddressFromModal, web3ModalProvider, queryClient, chainId]);

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
      web3ModalProvider.on("chainChanged", () => {
        refetchAccountData();
      });
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
  const switchNetwork = async function (newChainId: ChainID) {
    if (chainId == newChainId) return;
    const hexChainId = newChainId.toString(16);
    const chainMetadata = getChainMetadata(newChainId);

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
