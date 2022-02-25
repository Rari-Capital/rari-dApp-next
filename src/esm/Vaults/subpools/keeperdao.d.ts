import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
export default class KeeperDAOSubpool {
  provider: JsonRpcProvider;
  constructor(provider: JsonRpcProvider);
  getCurrencyApys: () => {
    ETH: BigNumber;
  };
}
