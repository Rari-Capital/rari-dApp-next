export var ChainID;
(function (ChainID) {
    ChainID[ChainID["ETHEREUM"] = 1] = "ETHEREUM";
    ChainID[ChainID["ROPSTEN"] = 3] = "ROPSTEN";
    ChainID[ChainID["RINKEBY"] = 4] = "RINKEBY";
    ChainID[ChainID["G\u00D6RLI"] = 5] = "G\u00D6RLI";
    ChainID[ChainID["KOVAN"] = 42] = "KOVAN";
    //
    ChainID[ChainID["ARBITRUM"] = 42161] = "ARBITRUM";
    ChainID[ChainID["ARBITRUM_TESTNET"] = 421611] = "ARBITRUM_TESTNET";
    //
    ChainID[ChainID["OPTIMISM"] = 10] = "OPTIMISM";
    ChainID[ChainID["HARDHAT"] = 31337] = "HARDHAT";
})(ChainID || (ChainID = {}));
export const chainMetadata = {
    [ChainID.ETHEREUM]: {
        chainId: ChainID.ETHEREUM,
        name: "Ethereum",
        imageUrl: "/static/networks/ethereum.png",
        supported: true,
        rpcUrl: "https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN",
        blockExplorerURL: "https://etherscan.io",
        color: "#627EEA",
    },
    [ChainID.ROPSTEN]: {
        chainId: ChainID.ROPSTEN,
        name: "Ropsten",
        supported: false,
        rpcUrl: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        blockExplorerURL: "https://etherscan.io",
        color: "#627EEA",
    },
    [ChainID.RINKEBY]: {
        chainId: ChainID.RINKEBY,
        name: "Rinkeby",
        supported: false,
        rpcUrl: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        blockExplorerURL: "https://etherscan.io",
        color: "#627EEA",
    },
    [ChainID.GÖRLI]: {
        chainId: ChainID.GÖRLI,
        name: "Goerli",
        supported: false,
        rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        blockExplorerURL: "https://etherscan.io",
        color: "#627EEA",
    },
    [ChainID.KOVAN]: {
        chainId: ChainID.KOVAN,
        name: "Kovan",
        supported: false,
        rpcUrl: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        blockExplorerURL: "https://etherscan.io",
        color: "#627EEA",
    },
    [ChainID.ARBITRUM]: {
        chainId: ChainID.ARBITRUM,
        name: "Arbitrum",
        imageUrl: "/static/networks/arbitrum.svg",
        supported: true,
        rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/rNfYbx5O5Ng09hw9s9YE-huxzVNaWWbX",
        blockExplorerURL: "https://arbiscan.io",
        color: "#28A0EF",
    },
    [ChainID.ARBITRUM_TESTNET]: {
        chainId: ChainID.ARBITRUM_TESTNET,
        name: "Arbi Rinkeby",
        imageUrl: "/static/networks/arbitrum.svg",
        supported: true,
        rpcUrl: "https://arb-rinkeby.g.alchemy.com/v2/PkZ7ilUhTBT6tHUsgToel62IOcuyKcwb",
        blockExplorerURL: "https://testnet.arbiscan.io",
        color: "#28A0EF",
    },
    [ChainID.OPTIMISM]: {
        chainId: ChainID.OPTIMISM,
        name: "Optimism",
        imageUrl: "/static/networks/optimism.svg",
        supported: false,
        rpcUrl: "https://mainnet.optimism.io/",
        blockExplorerURL: "https://optimistic.etherscan.io",
        color: "#FE0521",
    },
    [ChainID.HARDHAT]: {
      chainId: ChainID.HARDHAT,
      name: "Hardhat",
      imageUrl: "/static/networks/optimism.svg", // no logo
      supported: true,
      rpcUrl: "http://localhost:8545",
      blockExplorerURL: "",
      color: "#BC6C6C"
    }
};
export const isSupportedChainId = (chainId) => Object.values(ChainID).includes(chainId);
export function getSupportedChains() {
    return Object.values(chainMetadata).filter((chainMetadata) => chainMetadata.supported);
}
export function getChainMetadata(chainId) {
    return chainMetadata[chainId];
}
