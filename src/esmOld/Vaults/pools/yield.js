var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Contract } from "@ethersproject/contracts";
import StablePool from "./stable";
// ABIs v1.0.0
import LegacyRariFundControllerAbi1 from './yield/abi/legacy/v1.0.0/RariFundController.json';
import LegacyRariFundProxyAbi1 from './yield/abi/legacy/v1.0.0/RariFundProxy.json';
// ABIs v1.1.0
import LegacyRaryFundProxyAbi11 from './yield/abi/legacy/v1.1.0/RariFundProxy.json';
const legacyABIS = {
    "v1.0.0": {
        "RariFundController": LegacyRariFundControllerAbi1,
        "RariFundProxy": LegacyRariFundProxyAbi1
    },
    "v1.1.0": {
        "RariFundProxy": LegacyRaryFundProxyAbi11
    }
};
const contractAddresses = {
    RariFundController: "0x9245efB59f6491Ed1652c2DD8a4880cBFADc3ffA",
    RariFundManager: "0x59FA438cD0731EBF5F4cDCaf72D4960EFd13FCe6",
    RariFundToken: "0x3baa6B7Af0D72006d3ea770ca29100Eb848559ae",
    RariFundPriceConsumer: "0x00815e0e9d118769542ce24be95f8e21c60e5561",
    RariFundProxy: "0x35DDEFa2a30474E64314aAA7370abE14c042C6e8",
};
const legacyContractAddresses = {
    "v1.0.0": {
        RariFundController: "0x6afE6C37bF75f80D512b9D89C19EC0B346b09a8d",
        RariFundProxy: "0x6dd8e1Df9F366e6494c2601e515813e0f9219A88",
    },
    "v1.1.0": {
        RariFundProxy: "0x626d6979F3607d13051594d8B27a0A64E413bC11",
    },
};
export default class YieldPool extends StablePool {
    constructor(provider, subpools, getAllTokens) {
        super(provider, subpools, getAllTokens);
        this.API_BASE_URL = "https://api.rari.capital/pools/yield/";
        this.POOL_NAME = "Rari Yield Pool";
        this.POOL_TOKEN_SYMBOL = "RYPT";
        this.contracts = {
            RariFundController: new Contract("0x9245efB59f6491Ed1652c2DD8a4880cBFADc3ffA", YieldPool.CONTRACT_ABIS["RariFundController"], this.provider),
            RariFundManager: new Contract("0x59FA438cD0731EBF5F4cDCaf72D4960EFd13FCe6", YieldPool.CONTRACT_ABIS["RariFundManager"], this.provider),
            RariFundToken: new Contract("0x3baa6B7Af0D72006d3ea770ca29100Eb848559ae", YieldPool.CONTRACT_ABIS["RariFundToken"], this.provider),
            RariFundPriceConsumer: new Contract("0x00815e0e9d118769542ce24be95f8e21c60e5561", YieldPool.CONTRACT_ABIS["RariFundPriceConsumer"], this.provider),
            RariFundProxy: new Contract("0x35DDEFa2a30474E64314aAA7370abE14c042C6e8", YieldPool.CONTRACT_ABIS["RariFundProxy"], this.provider)
        };
        this.legacyContracts = {
            "v1.0.0": {
                "RariFundController": new Contract("0x6afE6C37bF75f80D512b9D89C19EC0B346b09a8d", LegacyRariFundControllerAbi1, this.provider),
                "RariFundProxy": new Contract("0x6dd8e1Df9F366e6494c2601e515813e0f9219A88", LegacyRariFundProxyAbi1, this.provider)
            },
            "v1.1.0": {
                "RariFundProxy": new Contract("0x626d6979F3607d13051594d8B27a0A64E413bC11", LegacyRaryFundProxyAbi11, this.provider)
            }
        };
        this.rypt = this.rspt;
        delete this.rspt;
        this.allocations.POOLS = ["dYdX", "Compound", "Aave", "mStable", "yVault"];
        this.allocations.POOLS_BY_CURRENCY = {
            DAI: ["dYdX", "Compound", "Aave", "yVault"],
            USDC: ["dYdX", "Compound", "Aave", "yVault"],
            USDT: ["Compound", "Aave", "yVault"],
            TUSD: ["Aave", "yVault"],
            BUSD: ["Aave"],
            sUSD: ["Aave"],
            mUSD: ["mStable"],
        };
        this.allocations.CURRENCIES_BY_POOL = {
            dYdX: ["DAI", "USDC"],
            Compound: ["DAI", "USDC", "USDT"],
            Aave: ["DAI", "USDC", "USDT", "TUSD", "BUSD", "sUSD"],
            mStable: ["mUSD"],
            yVault: ["DAI", "USDC", "USDT", "TUSD"],
        };
        delete this.history.getRsptExchangeRateHistory;
        this.history.getRyptExchangeRateHistory = this.history.getPoolTokenExchangeRateHistory;
        var self = this;
        this.history.getPoolAllocationHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                var events = [];
                if (toBlock >= 11085000 && fromBlock <= 11854009)
                    events = yield self.legacyContracts["v1.0.0"].RariFundController.getPastEvents("PoolAllocation", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock: Math.min(toBlock, 11854009),
                        filter,
                    });
                if (toBlock >= 11854009)
                    events = events.concat(yield self.contracts.RariFundController.getPastEvents("PoolAllocation", {
                        fromBlock: Math.max(fromBlock, 11854009),
                        toBlock,
                        filter,
                    }));
                return events;
            });
        };
        this.history.getCurrencyExchangeHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                var events = [];
                if (toBlock >= 11085000 && fromBlock <= 11854009)
                    events = yield self.legacyContracts["v1.0.0"].RariFundController.getPastEvents("CurrencyTrade", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock: Math.min(toBlock, 11854009),
                        filter,
                    });
                if (toBlock >= 11854009)
                    events = events.concat(yield self.contracts.RariFundController.getPastEvents("CurrencyTrade", {
                        fromBlock: Math.max(fromBlock, 11854009),
                        toBlock,
                        filter,
                    }));
                return events;
            });
        };
        this.history.getDepositHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return toBlock >= 11085000
                    ? yield self.contracts.RariFundManager.getPastEvents("Deposit", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock,
                        filter,
                    })
                    : [];
            });
        };
        this.history.getWithdrawalHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return toBlock >= 11085000
                    ? yield self.contracts.RariFundManager.getPastEvents("Withdrawal", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock,
                        filter,
                    })
                    : [];
            });
        };
        this.history.getPreDepositExchangeHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return toBlock >= 11085000
                    ? yield self.contracts.RariFundProxy.getPastEvents("PreDepositExchange", { fromBlock: Math.max(fromBlock, 11085000), toBlock, filter })
                    : [];
            });
        };
        this.history.getPostWithdrawalExchangeHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return toBlock >= 11085000
                    ? yield self.contracts.RariFundProxy.getPastEvents("PostWithdrawalExchange", { fromBlock: Math.max(fromBlock, 20000001), toBlock, filter })
                    : [];
            });
        };
        this.history.getPoolTokenTransferHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return toBlock >= 11085000
                    ? yield self.contracts.RariFundToken.getPastEvents("Transfer", {
                        fromBlock: Math.max(fromBlock, 10909582),
                        toBlock,
                        filter,
                    })
                    : [];
            });
        };
        delete this.history.getRsptTransferHistory;
        this.history.getRyptTransferHistory = this.history.getPoolTokenTransferHistory;
    }
}
YieldPool.CONTRACT_ADDRESSES = contractAddresses;
YieldPool.LEGACY_CONTRACT_ADDRESSES = legacyContractAddresses;
YieldPool.LEGACY_CONTRACT_ABIS = legacyABIS;
