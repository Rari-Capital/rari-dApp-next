/* eslint-disable */
import { constants } from "ethers";
export default class KeeperDAOSubpool {
  constructor(provider) {
    this.getCurrencyApys = () => {
      // TODO: KeeperDAO APYs
      return {
        ETH: constants.Zero,
      };
    };
    this.provider = provider;
  }
}
