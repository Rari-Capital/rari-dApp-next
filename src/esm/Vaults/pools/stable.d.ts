import { Contract, BigNumber } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
export default class StablePool {
    API_BASE_URL: string;
    POOL_NAME: string;
    POOL_TOKEN_SYMBOL: string;
    provider: JsonRpcProvider | Web3Provider;
    pools: any;
    getAllTokens: any;
    cache: any;
    contracts: {
        [key: string]: Contract;
    };
    legacyContracts: {
        [key: string]: {
            [key: string]: Contract;
        };
    };
    balances: {
        getTotalSupply: () => Promise<BigNumber>;
        getTotalInterestAccrued: (fromBlock: number, toBlock: number | string) => Promise<BigNumber>;
        balanceOf: (address: string) => Promise<BigNumber>;
        interestAccruedBy: (account: string, fromBlock?: number, toBlock?: number | string) => Promise<any>;
        transfer: (recipient: string, amount: BigNumber) => any;
    };
    allocations: any;
    apy: any;
    rspt?: {
        getExchangeRate: (blockNumber: number) => Promise<number>;
        balanceOf: (addres: string) => Promise<BigNumber>;
        transfer: (recipient: string, amount: BigNumber) => Promise<any>;
    };
    poolToken: {
        getExchangeRate: (blockNumber: number) => Promise<number>;
        balanceOf: (addres: string) => Promise<BigNumber>;
        transfer: (recipient: string, amount: BigNumber) => Promise<any>;
    };
    fees: {
        getInterestFeeRate: () => Promise<BigNumber>;
    };
    deposits: any;
    withdrawals: {
        getWithdrawalCurrencies: () => Promise<String[]>;
        getMaxWithdrawalAmount: (currecyCode: string, senderUsdBalance: BigNumber, sender: string) => Promise<BigNumber[]>;
        getWithdrawalCurrenciesWithoutSlippage: () => Promise<any[]>;
        validateWithdrawal: (currencyCode: string, amount: BigNumber, sender: string, getSlippage: boolean) => Promise<any[]>;
        getWithdrawalSlippage: (currencyCode: string, amount: BigNumber, usdAmount: number | BigNumber) => Promise<string | BigNumber>;
        withdraw: (currencyCode: string, amount: BigNumber, maxUsdAmount: BigNumber, options: any) => Promise<any[]>;
    };
    history: any;
    static CONTRACT_ADDRESSES: any;
    static CONTRACT_ABIS: any;
    constructor(provider: JsonRpcProvider | Web3Provider, subpools: any, getAllTokens: () => any[]);
}
