import { JsonRpcProvider } from "@ethersproject/providers";
import Cache from "../cache";
export default class AlphaSubpool {
  provider: JsonRpcProvider;
  cache: Cache;
  externalContracts: any;
  constructor(provider: JsonRpcProvider);
  getCurrencyApys(): Promise<{
    ETH: any;
  }>;
  getIBEthApyBN(): Promise<any>;
}
