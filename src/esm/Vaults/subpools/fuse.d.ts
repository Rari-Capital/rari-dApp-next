import { BigNumber } from "ethers";
export default class FuseSubpool {
  provider: any;
  cTokens: any;
  cache: any;
  constructor(provider: any, cTokens: any);
  getCurrencyApy(cTokenAddress: any): Promise<BigNumber>;
  getCurrencyApys(): Promise<any>;
}
