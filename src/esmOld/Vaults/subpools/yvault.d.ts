export default class YVault {
    provider: any;
    constructor(provider: any);
    getCurrencyApys(): {
        DAI: import("ethers").BigNumber;
        USDC: import("ethers").BigNumber;
        USDT: import("ethers").BigNumber;
        TUSD: import("ethers").BigNumber;
    };
}
