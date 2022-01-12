import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Img, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { useRari } from "context/RariContext";

import { ChainID } from "esm/utils/networks";

import DashboardBox from "./DashboardBox";

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
    rpcUrl: "https://cloudflare-eth.com",
  },
  [ChainID.ROPSTEN]: {
    chainId: ChainID.ROPSTEN,
    name: "Ropsten",
    supported: false,
    rpcUrl: "",
  },
  [ChainID.RINKEBY]: {
    chainId: ChainID.RINKEBY,
    name: "Rinkeby",
    supported: false,
    rpcUrl: "",
  },
  [ChainID.GÖRLI]: {
    chainId: ChainID.GÖRLI,
    name: "Ropsten",
    supported: false,
    rpcUrl: "",
  },
  [ChainID.KOVAN]: {
    chainId: ChainID.KOVAN,
    name: "Kovan",
    supported: false,
    rpcUrl: "",
  },
  [ChainID.ARBITRUM]: {
    chainId: ChainID.ARBITRUM,
    name: "Arbitrum",
    imageUrl: "/static/networks/arbitrum.svg",
    supported: true,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  [ChainID.ARBITRUM_TESTNET]: {
    chainId: ChainID.ARBITRUM_TESTNET,
    name: "Arbitrum Testnet",
    supported: false,
    rpcUrl: "",
  },
  [ChainID.OPTIMISM]: {
    chainId: ChainID.OPTIMISM,
    name: "Optimism",
    imageUrl: "/static/networks/optimism.svg",
    supported: true,
    rpcUrl: "https://mainnet.optimism.io/",
  },
};

function getSupportedChains(): ChainMetadata[] {
  return Object.values(chainMetadata).filter(
    (chainMetadata) => chainMetadata.supported
  );
}

function getChainMetadata(chainId: ChainID): ChainMetadata {
  return chainMetadata[chainId];
}

const SwitchNetworkButton: React.FC = () => {
  const [chainId, setChainId] = useState<number>();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const { fuse } = useRari();
  const supportedChains = useMemo(() => getSupportedChains(), []);

  // Based on Metamask-recommended code at
  // https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain
  // TODO(nathanhleung) handle all possible errors
  async function switchNetwork(chainId: ChainID) {
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
    }
  }

  useEffect(() => {
    // On first load, get the id of the connected network
    fuse.provider.getNetwork().then(({ chainId }) => {
      setChainId(chainId);
    });

    // TODO(nathanhleung): handle network changes in Metamask
    //
    // ethers.js docs recommends refreshing the page on a network change:
    // https://docs.ethers.io/v5/concepts/best-practices/
    //
    // In that case, maybe there should be a network listener higher up
    // that automatically refreshes?
  }, []);

  let chainMetadata;
  if (chainId) {
    chainMetadata = getChainMetadata(chainId);
  }

  return (
    <DashboardBox
      position="relative"
      ml={1}
      as="button"
      height="40px"
      px={3}
      flexShrink={0}
      fontSize={15}
      tabIndex={0}
      onClick={() => {
        setDropdownOpened(!dropdownOpened);
      }}
      onBlur={() => setDropdownOpened(false)}
      fontWeight="bold"
      cursor="pointer"
    >
      <Center expand>
        {chainMetadata ? (
          <>
            {chainMetadata.imageUrl && (
              <Img
                width="20px"
                height="20px"
                margin={1}
                mr={3}
                borderRadius="50%"
                src={chainMetadata.imageUrl}
                alt=""
              />
            )}
            {chainMetadata.name}
          </>
        ) : (
          "Loading..."
        )}
        <ChevronDownIcon ml={3} mr={1} />
      </Center>
      {dropdownOpened && (
        <DashboardBox
          position="absolute"
          width="175%"
          left={0}
          top="50px"
          textAlign="left"
          p={4}
          cursor="default"
        >
          <Text fontWeight="normal" color="grey" mb={2} cursor="default">
            Select a network
          </Text>
          {supportedChains.map((chainMetadata) => (
            <Flex
              cursor="pointer"
              alignItems="center"
              my={1}
              p={1}
              borderRadius="10px"
              _hover={{
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
              onClick={async () => {
                await switchNetwork(chainMetadata.chainId);
                window.location.reload();
              }}
            >
              {chainMetadata.imageUrl && (
                <Img
                  width="20px"
                  height="20px"
                  margin={1}
                  mr={3}
                  borderRadius="50%"
                  src={chainMetadata.imageUrl}
                  alt=""
                />
              )}
              {chainMetadata.name}
              <Spacer />
              {chainId === chainMetadata.chainId && (
                <Box
                  borderRadius="50%"
                  backgroundColor="green.200"
                  height="8px"
                  width="8px"
                  mr={3}
                />
              )}
            </Flex>
          ))}
        </DashboardBox>
      )}
    </DashboardBox>
  );
};

export default SwitchNetworkButton;
