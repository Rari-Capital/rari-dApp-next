import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Cache from "./cache";
export default class Vaults {
  provider: JsonRpcProvider;
  cache: Cache;
  price: any;
  getEthUsdPriceBN: any;
  getAllTokens: any;
  subpools: any;
  pools: any;
  governance: any;
  constructor(web3Provider: JsonRpcProvider | Web3Provider);
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
