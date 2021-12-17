export var ChainID;
(function (ChainID) {
    ChainID[ChainID["ETHEREUM"] = 1] = "ETHEREUM";
    ChainID[ChainID["ROPSTEN"] = 3] = "ROPSTEN";
    ChainID[ChainID["RINKEBY"] = 4] = "RINKEBY";
    ChainID[ChainID["G\u00D6RLI"] = 5] = "G\u00D6RLI";
    ChainID[ChainID["KOVAN"] = 42] = "KOVAN";
    //
    ChainID[ChainID["ARBITRUM"] = 42161] = "ARBITRUM";
    //
    ChainID[ChainID["OPTIMISM"] = 10] = "OPTIMISM";
})(ChainID || (ChainID = {}));
export const isSupportedChainId = (chainId) => {
    const isSupported = Object.values(ChainID).includes(chainId);
    console.log(Object.values(chainId), chainId);
    return isSupported;
};
