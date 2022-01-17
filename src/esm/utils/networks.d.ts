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
interface ChainMetadata {
    chainId: number;
    color: string;
    name: string;
    imageUrl?: string;
    supported: boolean;
    rpcUrl: string;
}
export declare const chainMetadata: {
    1: {
        chainId: ChainID;
        name: string;
        imageUrl: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    3: {
        chainId: ChainID;
        name: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    4: {
        chainId: ChainID;
        name: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    5: {
        chainId: ChainID;
        name: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    42: {
        chainId: ChainID;
        name: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    42161: {
        chainId: ChainID;
        name: string;
        imageUrl: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    421611: {
        chainId: ChainID;
        name: string;
        imageUrl: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
    10: {
        chainId: ChainID;
        name: string;
        imageUrl: string;
        supported: boolean;
        rpcUrl: string;
        color: string;
    };
};
export declare const isSupportedChainId: (chainId: number) => boolean;
export declare function getSupportedChains(): ChainMetadata[];
export declare function getChainMetadata(chainId: ChainID): ChainMetadata;
export {};
