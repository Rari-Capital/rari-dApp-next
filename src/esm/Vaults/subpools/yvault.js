import { constants } from "ethers";
export default class YVault {
    constructor(provider) {
        this.provider = provider;
    }
    getCurrencyApys() {
        return {
            DAI: constants.Zero,
            USDC: constants.Zero,
            USDT: constants.Zero,
            TUSD: constants.Zero,
        };
    }
}
