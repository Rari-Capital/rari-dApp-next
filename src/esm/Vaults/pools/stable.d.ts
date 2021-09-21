import { JsonRpcProvider } from "@ethersproject/providers";
export default class StablePool {
    API_BASE_URL: string;
    POOL_NAME: string;
    POOL_TOKEN_SYMBOL: string;
    provider: any;
    pools: any;
    getAllTokens: any;
    cache: any;
    contracts: any;
    legacyContracts: any;
    balances: any;
    allocations: any;
    apy: any;
    rspt: any;
    poolToken: any;
    fees: any;
    deposits: any;
    withdrawals: any;
    history: any;
    static CONTRACT_ADDRESSES: any;
    static CONTRACT_ABIS: any;
    constructor(provider: JsonRpcProvider, subpools: any, getAllTokens: any);
    internalTokens: {
        DAI: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        USDC: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        USDT: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        TUSD: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        BUSD: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        sUSD: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
        mUSD: {
            symbol: string;
            address: string;
            name: string;
            decimals: number;
        };
    };
}
