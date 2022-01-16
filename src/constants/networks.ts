import { ChainID } from "esm/utils/networks";

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
      name: "Arbi Rinkeby",
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