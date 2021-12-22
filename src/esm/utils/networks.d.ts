export declare enum ChainID {
    ETHEREUM = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    ARBITRUM = 42161,
    ARBITRUM_TESTNET = 421611,
    OPTIMISM = 10
}
export declare const isSupportedChainId: (chainId: number) => boolean;
