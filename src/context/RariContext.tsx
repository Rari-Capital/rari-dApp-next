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

import { Fuse } from "../esm";

import LogRocket, { init } from "logrocket";
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
import WalletLink from "walletlink";

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
    walletlink: {
      package: WalletLink,
      options: {
        appName: "Rari Capital",
        appLogoUrl: "/logo512.png",
        rpc: alchemyURL,
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
  fuse: Fuse;
  web3ModalProvider: any | null;
  isAuthed: boolean;
  login: (cacheProvider?: boolean) => Promise<any>;
  logout: () => any;
  address: string;
  isAttemptingLogin: boolean;
  chainId: number | undefined;
  switchNetwork: (newChainId: number, router: any) => void;
  switchingNetwork: boolean;
}

export const EmptyAddress = "0x0000000000000000000000000000000000000000";

export const RariContext = createContext<RariContextData | undefined>(
  undefined
);

export const RariProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { address: requestedAddress, network: networkQueryParameter } =
    router.query;

  const [firstRender, setFirstRender] = useState(true);
  // Rari and Fuse get initally set already
  const [provider, setProvider] = useState(() => chooseBestWeb3Provider());
  const [fuse, setFuse] = useState<Fuse>(() => initFuseWithProviders());

  const [isAttemptingLogin, setIsAttemptingLogin] = useState<boolean>(false);
  const [switchingNetwork, setSwitchingNetwork] = useState<boolean>(false);

  const [address, setAddress] = useState<string>(EmptyAddress);

  const [web3ModalProvider, setWeb3ModalProvider] = useState<any | null>(null);

  const [chainId, setChainId] = useState<number | undefined>(1);

  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Check the user's network:
  // First render only
  useEffect(() => {
    Promise.all([provider.send("net_version", []), provider.getNetwork()]).then(
      ([netId, network]) => {
        // Get the network from the provider
        const { chainId: internalChainId } = network;

        // If the chainID matches on first render, do nothing
        if (
          firstRender &&
          chainId === internalChainId &&
          networkQueryParameter !== "arbitrum"
        )
          return;
        console.log("Network ID: " + netId, "Chain ID: " + internalChainId);

        if (
          networkQueryParameter === "arbitrum" &&
          internalChainId !== ChainID.ARBITRUM
        ) {
          setFirstRender(false);
          switchNetwork(ChainID.ARBITRUM, router);
        }

        // // Don't show "wrong network" toasts if dev
        // if (process.env.NODE_ENV === "development") {
        //   return;
        // }
        if (!isSupportedChainId(internalChainId)) {
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

        // Use what u get from   the metamask provider
        const provider = chooseBestWeb3Provider();
        const fuse = initFuseWithProviders(provider, internalChainId);
        setFuse(fuse);
        setFirstRender(false);
        queryClient.refetchQueries();

        setChainId(internalChainId);
      }
    );
  }, [provider, toast, firstRender, networkQueryParameter]);

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [fuse]);

  // We need to give rari the new provider.
  const setRariAndAddressFromModal = useCallback(
    async (modalProvider, source) => {
      const provider = new Web3Provider(modalProvider);
      const { chainId } = await provider.getNetwork();
      const fuseInstance = initFuseWithProviders(provider, chainId);
      setSwitchingNetwork(false);

      setFuse(fuseInstance);

      fuseInstance.provider.listAccounts().then((addresses: string[]) => {
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
    [setAddress, requestedAddress]
  );

  const login = useCallback(
    async (cacheProvider: boolean = true) => {
      try {
        setIsAttemptingLogin(true);
        const providerWeb3Modal = await launchModalLazy(t, cacheProvider);
        setWeb3ModalProvider(providerWeb3Modal);
        setRariAndAddressFromModal(providerWeb3Modal, "login");
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
    const provider = chooseBestWeb3Provider();
    setProvider(provider);
    const fuseInstance = initFuseWithProviders(provider, chainId);
    setFuse(fuseInstance);
    setSwitchingNetwork(false);
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

  // when web3ModalProvider changes
  useEffect(() => {
    if (web3ModalProvider !== null && web3ModalProvider.on) {
      web3ModalProvider.on("accountsChanged", refetchAccountData);
      web3ModalProvider.on("chainChanged", () => {
        console.log("chain Changed");
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
  const switchNetwork = async function (newChainId: ChainID, router: any) {
    if (chainId == newChainId) return;

    const hexChainId = newChainId.toString(16);
    const chainMetadata = getChainMetadata(newChainId);

    // TODO: We could just start fuse with our providers if theres no wallet and user changes chain.
    if (typeof window === undefined) return;

    try {
      setSwitchingNetwork(true);

      await window.ethereum!.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${hexChainId}` }],
      });

      const { pathname } = router;

      router.reload();
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum!.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${hexChainId}`,
                chainName: chainMetadata.name,
                rpcUrls: [chainMetadata.rpcUrl],
              },
            ],
          });

          setChainId(newChainId);
        } catch (addError) {
          // handle "add" error
        }
      }

      // This error code indicates that the user aborted chain switch from wallet interface.
      if ((switchError as any).code === 4001) {
        setSwitchingNetwork(false);
      }

      console.log({ switchError });
      // handle other "switch" errors
    }
    // finally {
    //   refetchAccountData();
    // }
  };

  const value = useMemo(
    () => ({
      web3ModalProvider,
      fuse,
      isAuthed: address !== EmptyAddress,
      login,
      logout,
      address,
      isAttemptingLogin,
      chainId,
      switchNetwork,
      switchingNetwork,
    }),
    [
      web3ModalProvider,
      login,
      logout,
      address,
      fuse,
      isAttemptingLogin,
      switchNetwork,
      switchingNetwork,
    ]
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
