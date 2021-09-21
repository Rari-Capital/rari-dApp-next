var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Axios
import axios from "axios";
// Ethers
import { Contract, BigNumber, constants } from "ethers";
// Cache
import RariCache from "../cache.js";
// ERC20ABI
import erc20Abi from '../abi/ERC20.json';
import { get0xSwapOrders } from "../0x.js";
// Current ABIs
import RariFundControllerABI from "./stable/abi/RariFundController.json";
import RariFundManagerABI from "./stable/abi/RariFundManager.json";
import RariFundTokenABI from "./stable/abi/RariFundToken.json";
import RariFundPriceConsumerABI from "./stable/abi/RariFundPriceConsumer.json";
import RariFundProxyABI from "./stable/abi/RariFundProxy.json";
// Legacy ABIs (v1.0.0)
import RariFundManagerABIv100 from "./stable/abi/legacy/v1.0.0/RariFundManager.json";
import RariFundTokenABIv100 from "./stable/abi/legacy/v1.0.0/RariFundToken.json";
import RariFundProxyABIv100 from "./stable/abi/legacy/v1.0.0/RariFundProxy.json";
// Legacy ABIs (v1.1.0)
import RariFundManagerABIv110 from "./stable/abi/legacy/v1.1.0/RariFundManager.json";
import RariFundControllerABIv110 from "./stable/abi/legacy/v1.1.0/RariFundController.json";
import RariFundProxyABIv110 from "./stable/abi/legacy/v1.1.0/RariFundProxy.json";
// Legacy ABIs (v1.2.0)
import RariFundProxyABIv120 from "./stable/abi/legacy/v1.2.0/RariFundProxy.json";
// Legacy ABIs (v2.0.0)
import RariFundManagerABIv200 from "./stable/abi/legacy/v2.0.0/RariFundManager.json";
import RariFundControllerABIv200 from "./stable/abi/legacy/v2.0.0/RariFundController.json";
import RariFundProxyABIv200 from "./stable/abi/legacy/v2.0.0/RariFundProxy.json";
// Legacy ABIs (v2.2.0)
import RariFundProxyABIv220 from "./stable/abi/legacy/v2.2.0/RariFundProxy.json";
// Legacy ABIs (v2.4.0)
import RariFundProxyABIv240 from "./stable/abi/legacy/v2.4.0/RariFundProxy.json";
// Legacy ABIs (v2.5.0)
import RariFundControllerABIv250 from "./stable/abi/legacy/v2.5.0/RariFundController.json";
// Mstable
import MStableSubpool from "../subpools/mstable.js";
// Contract addresses
const contractAddressesStable = {
    RariFundController: "0x66f4856f1bbd1eb09e1c8d9d646f5a3a193da569",
    RariFundManager: "0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a",
    RariFundToken: "0x016bf078ABcaCB987f0589a6d3BEAdD4316922B0",
    RariFundPriceConsumer: "0xFE98A52bCAcC86432E7aa76376751DcFAB202244",
    RariFundProxy: "0x4a785fa6fcd2e0845a24847beb7bddd26f996d4d",
};
const abisStable = {
    RariFundController: RariFundControllerABI,
    RariFundManager: RariFundManagerABI,
    RariFundToken: RariFundTokenABI,
    RariFundPriceConsumer: RariFundPriceConsumerABI,
    RariFundProxy: RariFundProxyABI,
};
// Legacy addresses
const legacyContractAddresses = {
    "v1.0.0": {
        RariFundManager: "0x686ac9d046418416d3ed9ea9206f3dace4943027",
        RariFundToken: "0x9366B7C00894c3555c7590b0384e5F6a9D55659f",
        RariFundProxy: "0x27C4E34163b5FD2122cE43a40e3eaa4d58eEbeaF",
    },
    "v1.1.0": {
        RariFundController: "0x15c4ae284fbb3a6ceb41fa8eb5f3408ac485fabb",
        RariFundManager: "0x6bdaf490c5b6bb58564b3e79c8d18e8dfd270464",
        RariFundProxy: "0x318cfd99b60a63d265d2291a4ab982073fbf245d",
    },
    "v1.2.0": {
        RariFundProxy: "0xb6b79D857858004BF475e4A57D4A446DA4884866",
    },
    "v2.0.0": {
        RariFundController: "0xEe7162bB5191E8EC803F7635dE9A920159F1F40C",
        RariFundManager: "0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a",
        RariFundProxy: "0xD4be7E211680e12c08bbE9054F0dA0D646c45228",
    },
    "v2.2.0": {
        RariFundProxy: "0xB202cAd3965997f2F5E67B349B2C5df036b9792e",
    },
    "v2.4.0": {
        RariFundProxy: "0xe4deE94233dd4d7c2504744eE6d34f3875b3B439",
    },
    "v2.5.0": {
        RariFundController: "0x369855b051d1b2dbee88a792dcfc08614ff4e262",
    },
};
// Legacy addresses
const legacyAbis = {
    "v1.0.0": {
        RariFundManager: RariFundManagerABIv100,
        RariFundToken: RariFundTokenABIv100,
        RariFundProxy: RariFundProxyABIv100,
    },
    "v1.1.0": {
        RariFundController: RariFundControllerABIv110,
        RariFundManager: RariFundManagerABIv110,
        RariFundProxy: RariFundProxyABIv110,
    },
    "v1.2.0": {
        RariFundProxy: RariFundProxyABIv120,
    },
    "v2.0.0": {
        RariFundController: RariFundControllerABIv200,
        RariFundManager: RariFundManagerABIv200,
        RariFundProxy: RariFundProxyABIv200,
    },
    "v2.2.0": {
        RariFundProxy: RariFundProxyABIv220,
    },
    "v2.4.0": {
        RariFundProxy: RariFundProxyABIv240,
    },
    "v2.5.0": {
        RariFundController: RariFundControllerABIv250,
    },
};
export default class StablePool {
    constructor(provider, subpools, getAllTokens) {
        this.API_BASE_URL = "https://api.rari.capital/pools/stable/";
        this.POOL_NAME = "Rari Stable Pool";
        this.POOL_TOKEN_SYMBOL = "RSPT";
        this.internalTokens = {
            DAI: {
                symbol: "DAI",
                address: "0x6b175474e89094c44da98b954eedeac495271d0f",
                name: "Dai Stablecoin",
                decimals: 18,
            },
            USDC: {
                symbol: "USDC",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                name: "USD Coin",
                decimals: 6,
            },
            USDT: {
                symbol: "USDT",
                address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
                name: "Tether USD",
                decimals: 6,
            },
            TUSD: {
                symbol: "TUSD",
                address: "0x0000000000085d4780b73119b644ae5ecd22b376",
                name: "TrueUSD",
                decimals: 18,
            },
            BUSD: {
                symbol: "BUSD",
                address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
                name: "Binance USD",
                decimals: 18,
            },
            sUSD: {
                symbol: "sUSD",
                address: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
                name: "sUSD",
                decimals: 18,
            },
            mUSD: {
                symbol: "mUSD",
                address: "0xe2f2a5c287993345a840db3b0845fbc70f5935a5",
                name: "mStable USD",
                decimals: 18,
            },
        };
        this.provider = provider;
        this.pools = subpools;
        this.getAllTokens = getAllTokens;
        this.cache = new RariCache({
            usdPrices: 300,
            allBalances: 30,
            accountBalanceLimit: 3600,
            coinGeckoList: 3600,
            coinGeckoUsdPrices: 900,
            acceptedCurrencies: 30,
        });
        this.contracts = {
            RariFundController: new Contract(contractAddressesStable["RariFundController"], abisStable["RariFundController"], this.provider),
            RariFundManager: new Contract(contractAddressesStable["RariFundManager"], abisStable["RariFundManager"], this.provider),
            RariFundToken: new Contract(contractAddressesStable["RariFundToken"], abisStable["RariFundToken"], this.provider),
            RariFundPriceConsumer: new Contract(contractAddressesStable["RariFundPriceConsumer"], abisStable["RariFundPriceConsumer"], this.provider),
            RariFundProxy: new Contract(contractAddressesStable["RariFundProxy"], abisStable["RariFundProxy"], this.provider)
        };
        this.legacyContracts = {
            "v1.0.0": {
                RariFundManager: new Contract(legacyContractAddresses["v1.0.0"]["RariFundManager"], legacyAbis["v1.0.0"]["RariFundManager"], this.provider),
                RariFundToken: new Contract(legacyContractAddresses["v1.0.0"]["RariFundToken"], legacyAbis["v1.0.0"]["RariFundToken"], this.provider),
                RariFundProxy: new Contract(legacyContractAddresses["v1.0.0"]["RariFundProxy"], legacyAbis["v1.0.0"]["RariFundProxy"], this.provider),
            },
            "v1.1.0": {
                RariFundController: new Contract(legacyContractAddresses["v1.1.0"]["RariFundController"], legacyAbis["v1.1.0"]["RariFundController"], this.provider),
                RariFundManager: new Contract(legacyContractAddresses["v1.1.0"]["RariFundManager"], legacyAbis["v1.1.0"]["RariFundManager"], this.provider),
                RariFundProxy: new Contract(legacyContractAddresses["v1.1.0"]["RariFundProxy"], legacyAbis["v1.1.0"]["RariFundProxy"], this.provider),
            },
            "v1.2.0": {
                RariFundProxy: new Contract(legacyContractAddresses["v1.2.0"]["RariFundProxy"], legacyAbis["v1.2.0"]["RariFundProxy"], this.provider),
            },
            "v2.0.0": {
                RariFundController: new Contract(legacyContractAddresses["v2.0.0"]["RariFundController"], legacyAbis["v2.0.0"]["RariFundController"], this.provider),
                RariFundManager: new Contract(legacyContractAddresses["v2.0.0"]["RariFundManager"], legacyAbis["v2.0.0"]["RariFundManager"], this.provider),
                RariFundProxy: new Contract(legacyContractAddresses["v2.0.0"]["RariFundProxy"], legacyAbis["v2.0.0"]["RariFundProxy"], this.provider),
            },
            "v2.2.0": {
                RariFundProxy: new Contract(legacyContractAddresses["v2.2.0"]["RariFundProxy"], legacyAbis["v2.2.0"]["RariFundProxy"], this.provider),
            },
            "v2.4.0": {
                RariFundProxy: new Contract(legacyContractAddresses["v2.4.0"]["RariFundProxy"], legacyAbis["v2.4.0"]["RariFundProxy"], this.provider),
            },
            "v2.5.0": {
                RariFundController: new Contract(legacyContractAddresses["v2.5.0"]["RariFundController"], legacyAbis["v2.5.0"]["RariFundController"], this.provider),
            }
        };
        for (const currencyCode of Object.keys(this.internalTokens))
            this.internalTokens[currencyCode].contract = new Contract(this.internalTokens[currencyCode].address, erc20Abi, this.provider);
        var self = this;
        this.balances = {
            getTotalSupply: () => __awaiter(this, void 0, void 0, function* () {
                return (yield self.contracts.RariFundManager.callStatic.getFundBalance());
            }),
            getTotalInterestAccrued: (fromBlock = 0, toBlock = "latest") => __awaiter(this, void 0, void 0, function* () {
                if (!fromBlock)
                    fromBlock = 0;
                if (toBlock === undefined)
                    toBlock = "latest";
                if (fromBlock === 0 && toBlock === "latest")
                    return (yield self.contracts.RariFundManager.callStatic.getInterestAccrued());
                else
                    try {
                        return (yield axios.get(self.API_BASE_URL + "interest", { params: { fromBlock, toBlock }, })).data;
                    }
                    catch (e) {
                        throw new Error("Error in Rari API: " + e);
                    }
            }),
            balanceOf: (account) => __awaiter(this, void 0, void 0, function* () {
                if (!account)
                    throw new Error("No account specified");
                return (yield self.contracts.RariFundManager.callStatic.balanceOf(account));
            }),
            interestAccruedBy: (account, fromTimestamp = 0, toTimestamp = "latest") => __awaiter(this, void 0, void 0, function* () {
                if (!account)
                    throw new Error("No account specified");
                if (!fromTimestamp)
                    fromTimestamp = 0;
                if (toTimestamp === undefined)
                    toTimestamp = "latest";
                try {
                    return (yield axios.get(self.API_BASE_URL + "interest/" + account, { params: { fromTimestamp, toTimestamp } })).data;
                }
                catch (e) {
                    throw new Error("Error in Rari API: " + e);
                }
            }),
            transfer: (recipient, amount, options) => __awaiter(this, void 0, void 0, function* () {
                if (!recipient)
                    throw new Error("No recipient specified.");
                if (!amount || !BigNumber.from(amount) || !amount.gt(constants.Zero))
                    throw new Error("Amount is not a valid BN instance greater than 0.");
                var fundBalanceBN = BigNumber.from(yield self.contracts.RariFundManager.callStatic.getFundBalance());
                var rftTotalSupplyBN = BigNumber.from(yield self.contracts.RariFundToken.callStatic.totalSupply());
                var rftAmountBN = amount.mul(rftTotalSupplyBN).div(fundBalanceBN);
                return yield self.contracts.RariFundToken.transfer(recipient, rftAmountBN).send(options);
            })
        };
        this.allocations = {
            CURRENCIES: ["DAI", "USDC", "USDT", "TUSD", "BUSD", "sUSD", "mUSD"],
            POOLS: (function () {
                var pools = ["dYdX", "Compound", "Aave", "mStable"];
                pools[100] = "Fuse3";
                pools[101] = "Fuse7";
                pools[102] = "Fuse13";
                pools[103] = "Fuse14";
                pools[104] = "Fuse15";
                pools[105] = "Fuse16";
                pools[106] = "Fuse11";
                pools[107] = "Fuse2";
                pools[108] = "Fuse18";
                pools[109] = "Fuse6";
                return pools;
            })(),
            POOLS_BY_CURRENCY: {
                DAI: ["dYdX", "Compound", "Aave"],
                USDC: ["dYdX", "Compound", "Aave", "Fuse3", "Fuse7", "Fuse13", "Fuse14", "Fuse15", "Fuse16", "Fuse11", "Fuse2", "Fuse18", "Fuse6"],
                USDT: ["Compound", "Aave"],
                TUSD: ["Aave"],
                BUSD: ["Aave"],
                sUSD: ["Aave"],
                mUSD: ["mStable"],
            },
            CURRENCIES_BY_POOL: {
                dYdX: ["DAI", "USDC"],
                Compound: ["DAI", "USDC", "USDT"],
                Aave: ["DAI", "USDC", "USDT", "TUSD", "BUSD", "sUSD"],
                mStable: ["mUSD"],
                Fuse3: ["USDC"],
                Fuse7: ["USDC"],
                Fuse13: ["USDC"],
                Fuse14: ["USDC"],
                Fuse15: ["USDC"],
                Fuse16: ["USDC"],
                Fuse11: ["USDC"],
                Fuse2: ["USDC"],
                Fuse18: ["USDC"],
                Fuse6: ["USDC"],
            },
            getRawCurrencyAllocations: () => __awaiter(this, void 0, void 0, function* () {
                var allocationsByCurrency = {
                    DAI: constants.Zero,
                    USDC: constants.Zero,
                    USDT: constants.Zero,
                    TUSD: constants.Zero,
                    BUSD: constants.Zero,
                    sUSD: constants.Zero,
                    mUSD: constants.Zero,
                };
                var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                for (var i = 0; i < allBalances["0"].length; i++) {
                    const currencyCode = allBalances["0"][i];
                    const contractBalanceBN = BigNumber.from(allBalances["1"][i]);
                    allocationsByCurrency[currencyCode] = contractBalanceBN;
                    const pools = allBalances["2"][i];
                    const poolBalances = allBalances["3"][i];
                    for (let j = 0; j < pools.length; j++) {
                        const poolBalanceBN = BigNumber.from(poolBalances[j]);
                        allocationsByCurrency[currencyCode] = allocationsByCurrency[currencyCode].add(poolBalanceBN);
                    }
                }
                return allocationsByCurrency;
            }),
            getRawCurrencyAllocationsInUsd: () => __awaiter(this, void 0, void 0, function* () {
                const allocationsByCurrency = {
                    DAI: constants.Zero,
                    USDC: constants.Zero,
                    USDT: constants.Zero,
                    TUSD: constants.Zero,
                    BUSD: constants.Zero,
                    sUSD: constants.Zero,
                    mUSD: constants.Zero,
                };
                const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                for (var i = 0; i < allBalances["0"].length; i++) {
                    const currencyCode = allBalances["0"][i];
                    const priceInUsdBN = BigNumber.from(allBalances["4"][i]);
                    const contractBalanceBN = BigNumber.from(allBalances["1"][i]);
                    const contractBalanceUsdBN = contractBalanceBN
                        .mul(priceInUsdBN)
                        .div(self.internalTokens[currencyCode].decimals === 18
                        ? constants.WeiPerEther
                        : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                    allocationsByCurrency[currencyCode] = contractBalanceUsdBN;
                    const pools = allBalances["2"][i];
                    const poolBalances = allBalances["3"][i];
                    for (var j = 0; j < pools.length; j++) {
                        const poolBalanceBN = BigNumber.from(poolBalances[j]);
                        const poolBalanceUsdBN = poolBalanceBN
                            .mul(priceInUsdBN)
                            .div(self.internalTokens[currencyCode].decimals === 18
                            ? constants.WeiPerEther
                            : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                        allocationsByCurrency[currencyCode] = allocationsByCurrency[currencyCode].add(poolBalanceUsdBN);
                    }
                    ;
                }
                ;
                return allocationsByCurrency;
            }),
            getRawPoolAllocations: () => __awaiter(this, void 0, void 0, function* () {
                const allocationsByPool = {
                    _cash: constants.Zero,
                };
                for (const poolName of self.allocations.POOLS)
                    if (poolName !== undefined)
                        allocationsByPool[poolName] = constants.Zero;
                const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                for (var i = 0; i < allBalances["0"].length; i++) {
                    const currencyCode = allBalances["0"][i];
                    const priceInUsdBN = BigNumber.from(allBalances["4"][i]);
                    const contractBalanceBN = BigNumber.from(allBalances["1"][i]);
                    const contractBalanceUsdBN = contractBalanceBN
                        .mul(priceInUsdBN)
                        .div(self.internalTokens[currencyCode].decimals === 18
                        ? constants.WeiPerEther
                        : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                    allocationsByPool._cash = allocationsByPool._cash.add(contractBalanceUsdBN);
                    const pools = allBalances["2"][i];
                    const poolBalances = allBalances["3"][i];
                    for (let j = 0; j < pools.length; j++) {
                        const pool = pools[j];
                        const poolBalanceBN = BigNumber.from(poolBalances[j]);
                        const poolBalanceUsdBN = poolBalanceBN
                            .mul(priceInUsdBN)
                            .div(self.internalTokens[currencyCode].decimals === 18
                            ? constants.WeiPerEther
                            : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                        allocationsByPool[self.allocations.POOLS[pool]] = allocationsByPool[self.allocations.POOLS[pool]].add(poolBalanceUsdBN);
                    }
                }
                return allocationsByPool;
            }),
            getRawAllocations: () => __awaiter(this, void 0, void 0, function* () {
                const currencies = {};
                const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                for (var i = 0; i < allBalances["0"].length; i++) {
                    const currencyCode = allBalances["0"][i];
                    const contractBalanceBN = BigNumber.from(allBalances["1"][i]);
                    currencies[currencyCode] = { _cash: contractBalanceBN };
                    const pools = allBalances["2"][i];
                    const poolBalances = allBalances["3"][i];
                    for (let j = 0; j < pools.length; j++) {
                        const pool = pools[j];
                        const poolBalanceBN = BigNumber.from(poolBalances[j]);
                        currencies[currencyCode][self.allocations.POOLS[pool]] = poolBalanceBN;
                    }
                }
                return currencies;
            }),
            getCurrencyUsdPrices: () => __awaiter(this, void 0, void 0, function* () {
                const prices = {};
                const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                for (var i = 0; i < allBalances["0"].length; i++) {
                    prices[allBalances["0"][i]] = BigNumber.from(allBalances["4"][i]);
                }
                return prices;
            })
        };
        this.apy = {
            getCurrentRawApy: () => __awaiter(this, void 0, void 0, function* () {
                let factors = [];
                let totalBalanceUsdBN = constants.Zero;
                // Get all Balances
                const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                // Get raw balance
                for (var i = 0; i < allBalances["0"].length; i++) {
                    const currencyCode = allBalances["0"][i];
                    const priceInUsdBN = BigNumber.from(allBalances["4"][i]);
                    const contractBalanceBN = BigNumber.from(allBalances["1"][i]);
                    const contractBalanceUsdBN = contractBalanceBN
                        .mul(priceInUsdBN)
                        .div(self.internalTokens[currencyCode].decimals === 18
                        ? constants.WeiPerEther
                        : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                    factors.push([contractBalanceUsdBN, constants.Zero]);
                    totalBalanceUsdBN = totalBalanceUsdBN.add(contractBalanceUsdBN);
                    const pools = allBalances["2"][i];
                    const poolBalances = allBalances["3"][i];
                    for (let j = 0; j < pools.length; j++) {
                        const pool = pools[j];
                        const poolBalanceBN = BigNumber.from(poolBalances[j]);
                        const poolBalanceUsdBN = poolBalanceBN
                            .mul(priceInUsdBN)
                            .div(self.internalTokens[currencyCode].decimals === 18
                            ? constants.WeiPerEther
                            : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                        const poolApyBN = poolBalanceUsdBN.gt(constants.Zero)
                            ? (yield self.pools[self.allocations.POOLS[pool]].getCurrencyApys())[currencyCode]
                            : constants.Zero;
                        factors.push([poolBalanceUsdBN, poolApyBN]);
                        totalBalanceUsdBN = totalBalanceUsdBN.add(poolBalanceUsdBN);
                    }
                }
                console.log(totalBalanceUsdBN.isZero());
                if (totalBalanceUsdBN.isZero()) {
                    let maxApyBN = constants.Zero;
                    for (var i = 0; i < factors.length; i++) {
                        if (factors[i][1].gt(maxApyBN))
                            maxApyBN = factors[i][1];
                    }
                    return maxApyBN;
                }
                let apyBN = constants.Zero;
                for (var i = 0; i < factors.length; i++) {
                    apyBN = apyBN.add(factors[i][0]
                        .mul(factors[i][1].gt(constants.Zero)
                        ? factors[i][1]
                        : constants.Zero).div(totalBalanceUsdBN));
                }
                ;
                return apyBN;
            }),
            getCurrentApy: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var rawFundApy = yield self.apy.getCurrentRawApy();
                    var fee = yield self.contracts.RariFundManager.getInterestFeeRate();
                    return rawFundApy.sub(rawFundApy.mul(fee).div(constants.WeiPerEther));
                });
            },
            calculateApy: function (startTimestamp, startRsptExchangeRate, endTimestamp, endRsptExchangeRate) {
                const SECONDS_PER_YEAR = 365 * 86400;
                var timeDiff = endTimestamp - startTimestamp;
                const division = (endRsptExchangeRate.toString() / startRsptExchangeRate.toString());
                const response = (Math.pow(division, (SECONDS_PER_YEAR / timeDiff)) - 1) * 1e18;
                return Math.trunc(response);
            },
            getApyOverTime: function (fromTimestamp = 0, toTimestamp = "latest") {
                return __awaiter(this, void 0, void 0, function* () {
                    fromTimestamp =
                        fromTimestamp !== undefined
                            ? Math.max(fromTimestamp, 1593499687)
                            : 1593499687;
                    toTimestamp =
                        toTimestamp !== undefined && toTimestamp !== "latest"
                            ? Math.min(toTimestamp, new Date().getTime() / 1000)
                            : Math.trunc(new Date().getTime() / 1000);
                    try {
                        return BigNumber.from((yield axios.get(self.API_BASE_URL + "apy", {
                            params: { fromTimestamp, toTimestamp },
                        })).data);
                    }
                    catch (error) {
                        throw new Error("Error in Rari API: " + error);
                    }
                });
            },
        };
        this.rspt = this.poolToken = {
            getExchangeRate: function (blockNumber) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!blockNumber)
                        blockNumber = (yield self.provider.getBlock()).number;
                    var balance = yield self.contracts.RariFundManager.callStatic.getFundBalance({ blockTag: blockNumber });
                    var supply = yield self.contracts.RariFundToken.callStatic.totalSupply({ blockTag: blockNumber });
                    return balance.toString() / supply.toString();
                });
            },
            balanceOf: function (account) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariFundToken.callStatic.balanceOf(account);
                });
            },
            transfer: function (recipient, amount, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariFundToken.transfer(recipient, amount, { options });
                });
            }
        };
        this.fees = {
            getInterestFeeRate: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariFundManager.callStatic.getInterestFeeRate();
                });
            }
        };
        this.history = {
            getApyHistory: function (fromTimestamp, toTimestamp, intervalSeconds = 86400) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (fromTimestamp === undefined || fromTimestamp === "latest")
                        fromTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (toTimestamp === undefined || toTimestamp === "latest")
                        toTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (!intervalSeconds)
                        intervalSeconds = 86400;
                    try {
                        return (yield axios.get(self.API_BASE_URL + "apys", {
                            params: { fromTimestamp, toTimestamp, intervalSeconds },
                        })).data;
                    }
                    catch (error) {
                        throw new Error("Error in Rari API: " + error);
                    }
                });
            },
            getTotalSupplyHistory: function (fromTimestamp = "latest", toTimestamp = "latest", intervalSeconds = 86400) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (fromTimestamp === undefined || fromTimestamp === "latest")
                        fromTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (toTimestamp === undefined || toTimestamp === "latest")
                        toTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (!intervalSeconds)
                        intervalSeconds = 86400;
                    try {
                        return (yield axios.get(self.API_BASE_URL + "balances", {
                            params: { fromTimestamp, toTimestamp, intervalSeconds },
                        })).data;
                    }
                    catch (error) {
                        throw new Error("Error in Rari API: " + error);
                    }
                });
            },
            getBalanceHistoryOf: function (account, fromBlock, toBlock, intervalBlocks = 6500) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!account)
                        throw new Error("No account specified");
                    if (fromBlock === undefined)
                        fromBlock = "latest";
                    if (toBlock === undefined)
                        toBlock = "latest";
                    if (!intervalBlocks)
                        intervalBlocks = 6500;
                    try {
                        return (yield axios.get(self.API_BASE_URL + "balances/" + account, {
                            params: { fromBlock, toBlock, intervalBlocks },
                        })).data;
                    }
                    catch (error) {
                        throw new Error("Error in Rari API: " + error);
                    }
                });
            },
            getPoolTokenExchangeRateHistory: function (fromTimestamp, toTimestamp, intervalSeconds = 86400) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (fromTimestamp === undefined || fromTimestamp === "latest")
                        fromTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (toTimestamp === undefined || toTimestamp === "latest")
                        toTimestamp = Math.trunc(new Date().getTime() / 1000);
                    if (!intervalSeconds)
                        intervalSeconds = 86400;
                    try {
                        return (yield axios.get(self.API_BASE_URL +
                            self.POOL_TOKEN_SYMBOL.toLowerCase() +
                            "/rates", {
                            params: { fromTimestamp, toTimestamp, intervalSeconds },
                        })).data;
                    }
                    catch (error) {
                        throw new Error("Error in Rari API: " + error);
                    }
                });
            },
            // @ts-ignore for some reason when using this its refering to StablePool, not history. 
            getRsptExchangeRateHistory: this.getPoolTokenExchangeRateHistory,
            getPredictedDailyRawFundApyHistoryLastYear: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    // TODO: Get results from app.rari.capital
                });
            },
            getPredictedDailyFundApyHistoryLastYear: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var history = yield self.history.getDailyRawFundApyHistoryLastYear();
                    for (const timestamp of Object.keys(history))
                        history[timestamp] -=
                            (history[timestamp] *
                                parseFloat(yield self.contracts.RariFundManager.methods
                                    .getInterestFeeRate()
                                    .call())) /
                                1e18;
                });
            },
            getPredictedDailyRawFundReturnHistoryLastYear: function (principal) {
                return __awaiter(this, void 0, void 0, function* () {
                    var apyHistory = yield self.history.getPredictedDailyRawFundApyHistoryLastYear();
                    var returns = {};
                    for (const timestamp of Object.keys(apyHistory))
                        returns[timestamp] = principal *=
                            1 + apyHistory[timestamp] / 100 / 365;
                    return returns;
                });
            },
            getPredictedDailyFundReturnHistoryLastYear: function (principal) {
                return __awaiter(this, void 0, void 0, function* () {
                    var apyHistory = yield self.history.getPredictedDailyFundApyHistoryLastYear();
                    var returns = {};
                    for (const timestamp of Object.keys(apyHistory))
                        returns[timestamp] = principal *=
                            1 + apyHistory[timestamp] / 100 / 365;
                    return returns;
                });
            },
            getPoolAllocationHistory: function (fromBlock, toBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    let events = [];
                    if (toBlock >= 10909705 && fromBlock <= 11821040)
                        events = yield self.legacyContracts["v2.0.0"]["RariFundController"].queryFilter(self.contracts.RariFundController.filters.PoolAllocation(), Math.max(fromBlock, 10909705), Math.min(toBlock, 11821040));
                    if (toBlock >= 11821040)
                        events = events.concat(yield self.contracts.RariFundController.queryFilter(self.contracts.RariFundController.filters.PoolAllocation(), Math.max(fromBlock, 11821040), toBlock));
                    return events;
                });
            },
            getCurrencyExchangeHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10926182 && fromBlock <= 11821040)
                        events = yield self.legacyContracts["v2.0.0"].RariFundController.getPastEvents(self.contracts.RariFundController.filters.PoolAllocation(), {
                            fromBlock: Math.max(fromBlock, 10926182),
                            toBlock: Math.min(toBlock, 11821040),
                            filter,
                        });
                    if (toBlock >= 11821040)
                        events = events.concat(yield self.contracts.RariFundController.getPastEvents("CurrencyTrade", {
                            fromBlock: Math.max(fromBlock, 11821040),
                            toBlock,
                            filter,
                        }));
                    return events;
                });
            },
            getDepositHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10365607 && fromBlock <= 10457338)
                        events = yield self.legacyContracts["v1.0.0"].RariFundManager.getPastEvents("Deposit", {
                            fromBlock: Math.max(fromBlock, 10365607),
                            toBlock: Math.min(toBlock, 10457338),
                            filter,
                        });
                    if (toBlock >= 10458405 && fromBlock <= 10889999)
                        events = events.concat(yield self.legacyContracts["v1.1.0"].RariFundManager.getPastEvents("Deposit", {
                            fromBlock: Math.max(fromBlock, 10458405),
                            toBlock: Math.min(toBlock, 10889999),
                            filter,
                        }));
                    if (toBlock >= 10922173)
                        events = events.concat(yield self.contracts.RariFundManager.getPastEvents("Deposit", {
                            fromBlock: Math.max(fromBlock, 10922173),
                            toBlock,
                            filter,
                        }));
                    return events;
                });
            },
            getWithdrawalHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10365668 && fromBlock <= 10365914)
                        events = yield self.legacyContracts["v1.0.0"].RariFundManager.getPastEvents("Withdrawal", {
                            fromBlock: Math.max(fromBlock, 10365668),
                            toBlock: Math.min(toBlock, 10365914),
                            filter,
                        });
                    if (toBlock >= 10468624 && fromBlock <= 10890985)
                        events = events.concat(yield self.legacyContracts["v1.1.0"].RariFundManager.getPastEvents("Withdrawal", {
                            fromBlock: Math.max(fromBlock, 10468624),
                            toBlock: Math.min(toBlock, 10890985),
                            filter,
                        }));
                    if (toBlock >= 10932051)
                        events = events.concat(yield self.contracts.RariFundManager.getPastEvents("Withdrawal", {
                            fromBlock: Math.max(fromBlock, 10932051),
                            toBlock,
                            filter,
                        }));
                    return events;
                });
            },
            getPreDepositExchangeHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10365738 && fromBlock <= 10395897)
                        events = yield self.legacyContracts["v1.0.0"].RariFundProxy.getPastEvents("PreDepositExchange", {
                            fromBlock: Math.max(fromBlock, 10365738),
                            toBlock: Math.min(toBlock, 10395897),
                            filter,
                        });
                    if (toBlock >= 10458408 && fromBlock <= 10489095)
                        events = events.concat(yield self.legacyContracts["v1.1.0"].RariFundProxy.getPastEvents("PreDepositExchange", {
                            fromBlock: Math.max(fromBlock, 10458408),
                            toBlock: Math.min(toBlock, 10489095),
                            filter,
                        }));
                    if (toBlock >= 10499014 && fromBlock <= 10833530)
                        events = events.concat(yield self.legacyContracts["v1.2.0"].RariFundProxy.getPastEvents("PreDepositExchange", {
                            fromBlock: Math.max(fromBlock, 10499014),
                            toBlock: Math.min(toBlock, 10833530),
                            filter,
                        }));
                    if (toBlock >= 10967766)
                        events = events.concat(yield self.contracts.RariFundProxy.getPastEvents("PreDepositExchange", { fromBlock: Math.max(fromBlock, 10967766), toBlock, filter }));
                    return events;
                });
            },
            getPostWithdrawalExchangeHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10365914 && fromBlock <= 10365914)
                        events = yield self.legacyContracts["v1.0.0"].RariFundToken.getPastEvents("PostWithdrawalExchange", {
                            fromBlock: Math.max(fromBlock, 10365914),
                            toBlock: Math.min(toBlock, 10365914),
                            filter,
                        });
                    if (toBlock >= 10545467 && fromBlock <= 10545467)
                        events = events.concat(yield self.legacyContracts["v1.2.0"].RariFundProxy.getPastEvents("PostWithdrawalExchange", {
                            fromBlock: Math.max(fromBlock, 10545467),
                            toBlock: Math.min(toBlock, 10545467),
                            filter,
                        }));
                    if (toBlock >= 10932051 && fromBlock <= 10932051)
                        events = events.concat(yield self.legacyContracts["v2.0.0"].RariFundProxy.getPastEvents("PostWithdrawalExchange", {
                            fromBlock: Math.max(fromBlock, 10932051),
                            toBlock: Math.min(toBlock, 10932051),
                            filter,
                        }));
                    if (toBlock >= 11141845)
                        events = events.concat(self.contracts.RariFundProxy.getPastEvents("PostWithdrawalExchange", {
                            fromBlock: Math.max(fromBlock, 11141845),
                            toBlock,
                            filter,
                        }));
                    return events;
                });
            },
            getPoolTokenTransferHistory: function (fromBlock, toBlock, filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var events = [];
                    if (toBlock >= 10365607 && fromBlock <= 10890985)
                        events = yield self.legacyContracts["v1.0.0"].RariFundToken.getPastEvents("Transfer", {
                            fromBlock: Math.max(fromBlock, 10365607),
                            toBlock: Math.min(toBlock, 10890985),
                            filter,
                        });
                    if (toBlock >= 10909582)
                        events = events.concat(yield self.contracts.RariFundToken.getPastEvents("Transfer", {
                            fromBlock: Math.max(fromBlock, 10909582),
                            toBlock,
                            filter,
                        }));
                    return events;
                });
            },
            //@ts-ignore
            getRsptTransferHistory: this.getPoolTokenTransferHistory,
        };
        this.deposits = {
            getDepositCurrencies: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let currencyCodes = self.allocations.CURRENCIES.slice();
                    currencyCodes.push("ETH");
                    let allTokens = yield self.getAllTokens();
                    for (const currencyCode of Object.keys(allTokens)) {
                        if (currencyCodes.indexOf(currencyCode) < 0)
                            currencyCodes.push(currencyCode);
                    }
                    return currencyCodes;
                });
            },
            getDirectDepositCurrencies: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariFundManager.callStatic.getAcceptedCurrencies();
                });
            },
            validateDeposit: function (currencyCode, amount, sender, getSlippage) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Input validation
                    if (!sender)
                        throw new Error("Sender parameter not set.");
                    const allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    if (!amount || amount.lte(constants.Zero))
                        throw new Error("Deposit amount must be greater than 0!");
                    const accountBalanceBN = yield (currencyCode == "ETH"
                        ? self.provider.getBalance(sender)
                        : allTokens[currencyCode].contract.balanceOf(sender));
                    if (amount.gt(accountBalanceBN))
                        throw new Error("Not enough balance in your account to make a deposit of this amount.");
                    // Get currencies we can directly deposit (no swap needed)
                    const directlyDepositableCurrencyCodes = yield self.cache.getOrUpdate("acceptedCurrencies", self.contracts.RariFundManager.callStatic.getAcceptedCurrencies);
                    // Check if theres something
                    if (!directlyDepositableCurrencyCodes || directlyDepositableCurrencyCodes.length === 0)
                        throw new Error("No directly depositable currencies found.");
                    // If currencyCode is directly depositable, return amount that would be added to users balance, null, and no slippage (because theres no swap)
                    if (directlyDepositableCurrencyCodes.indexOf(currencyCode) >= 0) {
                        const allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                        const amountUsdBN = amount.mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals)));
                        return [amountUsdBN.toString(), null, constants.Zero];
                    }
                    else {
                        // If currency Code is not directly depositable we try swapping.
                        // First with mStable (if currencyCode is supported), then with 0xSwap
                        // Get mStable output currency if possible
                        let mStableOutputCurrency;
                        let mStableOutputAmountAfterFeeBN;
                        // if currency we want to depost, is mUSD or if its supported by mStable exchange
                        if (currencyCode === "mUSD" || MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(currencyCode) >= 0) {
                            // for every acceptedCurrency
                            for (let acceptedCurrency of directlyDepositableCurrencyCodes) {
                                // if accepted currency is mUSD or if its supported by the exchange
                                if (acceptedCurrency === "mUSD" || MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(acceptedCurrency) >= 0) {
                                    // if currency we want to deposit is mUSD
                                    if (currencyCode === "mUSD") {
                                        // try to get validation to exchange token for the accepted token
                                        try {
                                            var redeemValidity = yield self.pools["mStable"].externalContracts.MassetValidationHelper.getRedeemValidity("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", amount, self.internalTokens[acceptedCurrency].address);
                                        }
                                        catch (err) {
                                            console.error("Failed to check mUSD redeem validity: ", err);
                                            continue;
                                        }
                                        if (!redeemValidity || !redeemValidity["0"])
                                            continue;
                                        mStableOutputAmountAfterFeeBN = BigNumber.from(redeemValidity["2"]);
                                        // If currency we want to deposit is not mUSD but its still supported by mStable exchange
                                    }
                                    else {
                                        // try to get validation to exchange token. This returns validation (boolean), and maxExchangeable amount
                                        try {
                                            var maxSwap = yield self.pools["mStable"].externalContracts.MassetValidationHelper.getMaxSwap("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", self.internalTokens[currencyCode].address, self.internalTokens[acceptedCurrency].address);
                                        }
                                        catch (err) {
                                            console.error("Failed to check mUSD max swap:", err);
                                            continue;
                                        }
                                        // if validation is false continue (as in stop executing for loop iteration) 
                                        if (!maxSwap || !maxSwap["0"] || amount.gt(BigNumber.from(maxSwap["2"])))
                                            continue;
                                        // if validation is true
                                        // define outputAmountBeforeFeedBN as 
                                        // amount * accepted currency decimals / decimals of the currency we want to use
                                        var outputAmountBeforeFeesBN = amount
                                            .mul(self.internalTokens[acceptedCurrency].decimals >= 18
                                            ? constants.WeiPerEther
                                            : BigNumber.from(Math.pow(10, self.internalTokens[acceptedCurrency].decimals)))
                                            .div(self.internalTokens[currencyCode].decimals >= 18
                                            ? constants.WeiPerEther
                                            : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                                        // if acceptedCurrency is mUSD there is no fee so
                                        // mStableOutputAmountAfterFeeBN is the same as outputAmountBeforeFeesBN
                                        if (acceptedCurrency === "mUSD")
                                            mStableOutputAmountAfterFeeBN = outputAmountBeforeFeesBN;
                                        else {
                                            // if acceptedCurrency is not mUSD
                                            // get the swap fee
                                            var swapFeeBN = yield self.pools["mStable"].getMUsdSwapFeeBN();
                                            // mStableOutputAmountAfterFeeBN = outputAmountBeforeFeesBN - outputAmountBeforeFeesNM * swapFee / 10^18
                                            mStableOutputAmountAfterFeeBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                                .mul(swapFeeBN)
                                                .div(constants.WeiPerEther));
                                        }
                                    }
                                    mStableOutputCurrency = acceptedCurrency;
                                    break;
                                }
                            }
                        }
                        // if mStableOutputCurrency is not null, it meant its exchangeable by mStable
                        if (mStableOutputCurrency !== null) {
                            // Get USD amount added to sender's fund balance
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.getRawFundBalancesAndPrices());
                            // mStableOutputAmountAfterFee is turned into dollars
                            const outputAmountUsdBN = mStableOutputAmountAfterFeeBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(mStableOutputCurrency)]))
                                .div((BigNumber.from(10)).pow(self.internalTokens[mStableOutputCurrency].decimals));
                            return [
                                outputAmountUsdBN,
                                null,
                                getSlippage
                                    ? yield self.deposits.getDepositSlippage(currencyCode, amount, outputAmountUsdBN)
                                    : null,
                            ];
                        }
                        else {
                            // if its not exchangeable by mStable use 0x
                            // Turn currency we want to use int first accepted currency
                            var acceptedCurrency = directlyDepositableCurrencyCodes[0];
                            // Get orders from 0x swap API
                            try {
                                var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(currencyCode === "ETH"
                                    ? "WETH"
                                    : allTokens[currencyCode].address, allTokens[acceptedCurrency].address, amount);
                            }
                            catch (err) {
                                throw new Error("Failed to get swap orders from 0x API: " + err);
                            }
                            // Get USD amount added to senders fund balance
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                            var makerAssetFilledAmountUsdBN = makerAssetFilledAmountBN.mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(acceptedCurrency)])).div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[acceptedCurrency].decimals)));
                            // Make sure input amount is completely filled
                            if (inputFilledAmountBN.lt(amount))
                                throw new Error("Unable to find enough liquidity to exchange " +
                                    currencyCode +
                                    " before depositing.");
                            // Multiply protocol fee by 1.5 to account for user upping the gas price
                            var protocolFeeBN = BigNumber.from(protocolFee).mul(BigNumber.from(15)).div(BigNumber.from(10));
                            // Make sure we have enough ETH for protocol fee
                            var ethBalanceBN = currencyCode === "ETH"
                                ? accountBalanceBN
                                : BigNumber.from(yield provider.getBalance(sender));
                            if (protocolFeeBN.gt(currencyCode === "ETH" ? ethBalanceBN.sub(amount) : ethBalanceBN))
                                throw new Error("ETH balance too low to cover 0x exchange protocol fee.");
                            return [
                                makerAssetFilledAmountBN,
                                protocolFeeBN,
                                getSlippage
                                    ? yield self.deposits.getDepositSlippage(currencyCode, amount, makerAssetFilledAmountUsdBN)
                                    : null
                            ];
                        }
                    }
                });
            },
            getDepositSlippage: function (currencyCode, amount, usdAmount) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (self.POOL_TOKEN_SYMBOL === "RYPT") {
                        var directlyDepositableCurrencyCodes = yield self.cache.getOrUpdate("acceptedCurrencies", self.contracts.RariFundManager.callStatic.getAcceptedCurrencies);
                        if (directlyDepositableCurrencyCodes && directlyDepositableCurrencyCodes.length > 0 && directlyDepositableCurrencyCodes.indexOf(currencyCode) >= 0) {
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                            return constants.WeiPerEther.sub(usdAmount.mul(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[currencyCode].decimals))).div(amount
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                                .div(constants.WeiPerEther)));
                        }
                    }
                    else if (self.POOL_TOKEN_SYMBOL === "RSPT") {
                        if (currencyCode === "USDC") {
                            return constants.WeiPerEther
                                .sub(usdAmount
                                .mul(BigNumber.from(1e6))
                                .div(amount)).toString();
                        }
                    }
                    else if (self.POOL_TOKEN_SYMBOL === "RDPT") {
                        if (currencyCode === "DAI") {
                            return constants.WeiPerEther
                                .sub(usdAmount
                                .mul(constants.WeiPerEther)
                                .div(amount)).toString();
                        }
                    }
                    else {
                        throw "Not implemented for " + self.POOL_TOKEN_SYMBOL;
                    }
                    // Get tokens
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode]) {
                        throw new Error("Invalid currency code!");
                    }
                    // Try cache
                    if (self.cache._raw.coinGeckoUsdPrices
                        && self.cache._raw.coinGeckoUsdPrices.value
                        && self.cache._raw.coinGeckoUsdPrices.value["USDC"]
                        && self.cache._raw.coinGeckoUsdPrices.value[currencyCode]
                        && new Date().getTime() / 1000 <= (self.cache._raw.coinGeckoUsdPrices.lastUpdated + self.cache._raw.coinGeckoUsdPrices.timeout)) {
                        if (self.POOL_TOKEN_SYMBOL === "RSPT") {
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["USDC"];
                        }
                        else if (self.POOL_TOKEN_SYMBOL === "RDPT") {
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["DAI"];
                        }
                        else {
                            usdAmount = parseFloat(usdAmount.toString());
                        }
                        return constants.WeiPerEther.sub(BigNumber.from(Math.trunc(usdAmount * (Math.pow(10, (currencyCode === "ETH" ? 18 : allTokens[currencyCode].decimals))
                            / (parseFloat(amount.toString()) * self.cache._raw.coinGeckoUsdPrices.value[currencyCode])))));
                    }
                    // Build currency code arraw
                    var currencyCodes = [...self.allocations.CURRENCIES];
                    if (currencyCodes.indexOf(currencyCode) < 0) {
                        currencyCodes.push(currencyCode);
                    }
                    // Get CoinGecko IDs
                    var decoded = yield self.cache.getOrUpdate("coinGeckoList", function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            return (yield axios.get("https://api.coingecko.com/api/v3/coins/list")).data;
                        });
                    });
                    if (!decoded)
                        throw new Error("Failed to decode coins list from CoinGecko");
                    var currencyCodesByCoinGeckoIds = {};
                    for (const currencyCode of currencyCodes) {
                        var filtered = decoded.filter((coin) => coin.symbol.toLowerCase() === currencyCode.toLowerCase());
                        if (!filtered)
                            throw new Error("Failed to get currency IDs from CoinGecko");
                        for (const coin of filtered)
                            currencyCodesByCoinGeckoIds[coin.id] = currencyCode;
                    }
                    // Get prices
                    var decoded = (yield axios.get("https://api.coingecko.com/api/v3/simple/price", {
                        params: {
                            vs_currencies: "usd",
                            ids: Object.keys(currencyCodesByCoinGeckoIds).join(","),
                            include_market_cap: true,
                        },
                    })).data;
                    if (!decoded)
                        throw new Error("Failed to decode USD exchange rates from CoinGecko");
                    var prices = {};
                    var maxMarketCaps = {};
                    for (const key of Object.keys(decoded))
                        if (prices[currencyCodesByCoinGeckoIds[key]] === undefined ||
                            decoded[key].usd_market_cap >
                                maxMarketCaps[currencyCodesByCoinGeckoIds[key]]) {
                            maxMarketCaps[currencyCodesByCoinGeckoIds[key]] =
                                decoded[key].usd_market_cap;
                            prices[currencyCodesByCoinGeckoIds[key]] = decoded[key].usd;
                        }
                    // Update cache
                    self.cache.update("coinGeckoUsdPrices", prices);
                    // Return slippage
                    if (self.cache._raw.coinGeckoUsdPrices.value["USDC"] &&
                        self.cache._raw.coinGeckoUsdPrices.value[currencyCode]) {
                        if (self.POOL_TOKEN_SYMBOL === "RSPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["USDC"];
                        else if (self.POOL_TOKEN_SYMBOL === "RDPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["DAI"];
                        else
                            usdAmount = parseFloat(usdAmount.toString());
                        return constants.WeiPerEther
                            .sub(BigNumber.from(Math.trunc(usdAmount *
                            (Math.pow(10, (currencyCode === "ETH"
                                ? 18
                                : allTokens[currencyCode].decimals)) /
                                (parseFloat(amount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value[currencyCode])))));
                    }
                    else
                        throw new Error("Failed to get currency prices from CoinGecko");
                });
            },
            deposit: function (currencyCode, amount, minUsdAmount, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Input validation
                    if (!options || !options.from)
                        throw new Error("Options parameter not set or from address not set.");
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    if (!amount || amount.lte(constants.Zero))
                        throw new Error("Deposit amount must be greater than 0!");
                    var accountBalanceBN = BigNumber.from(yield (currencyCode == "ETH"
                        ? self.provider.getBalance(options.from)
                        : allTokens[currencyCode].contract.methods
                            .balanceOf(options.from)
                            .call()));
                    if (amount.gt(accountBalanceBN))
                        throw new Error("Not enough balance in your account to make a deposit of this amount.");
                    // Check if currency is directly depositable
                    var directlyDepositableCurrencyCodes = yield self.cache.getOrUpdate("acceptedCurrencies", self.contracts.RariFundManager.methods.getAcceptedCurrencies().call);
                    if (!directlyDepositableCurrencyCodes ||
                        directlyDepositableCurrencyCodes.length == 0)
                        throw new Error("No directly depositable currencies found.");
                    if (directlyDepositableCurrencyCodes.indexOf(currencyCode) >= 0) {
                        // Get USD amount added to sender's fund balance
                        var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.methods.getRawFundBalancesAndPrices()
                            .call);
                        var amountUsdBN = amount
                            .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals)));
                        // Check amountUsdBN against minUsdAmount
                        if (typeof minUsdAmount !== "undefined" && minUsdAmount !== null && amountUsdBN.lt(minUsdAmount))
                            return [amountUsdBN];
                        // Get deposit contract
                        var useGsn = /* amountUsdBN.gte(Web3.utils.toBN(250e18)) && myFundBalanceBN.isZero() */ false;
                        var approvalReceipt = null;
                        var receipt;
                        const approveAndDeposit = function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                const depositContract = self.contracts.RariFundManager;
                                // Approve tokens to RariFundManager
                                try {
                                    var allowanceBN = BigNumber.from(yield allTokens[currencyCode].contract.methods
                                        .allowance(options.from, depositContract.options.address)
                                        .call());
                                    if (allowanceBN.lt(amount)) {
                                        if (allowanceBN.gt(constants.Zero) &&
                                            currencyCode === "USDT")
                                            yield allTokens[currencyCode].contract.methods
                                                .approve(depositContract.options.address, "0")
                                                .send(options);
                                        approvalReceipt = yield allTokens[currencyCode].contract.methods
                                            .approve(depositContract.options.address, amount)
                                            .send(options);
                                    }
                                }
                                catch (err) {
                                    throw new Error("Failed to approve tokens: " + (err.message ? err.message : err));
                                }
                                // Deposit tokens to RariFundManager
                                try {
                                    receipt = yield depositContract.methods
                                        .deposit(currencyCode, amount)
                                        .send(options);
                                }
                                catch (err) {
                                    if (useGsn) {
                                        useGsn = false;
                                        return yield approveAndDeposit();
                                    }
                                    throw err;
                                }
                            });
                        };
                        yield approveAndDeposit();
                        self.cache.clear("allBalances");
                        return [amountUsdBN, null, approvalReceipt, receipt];
                    }
                    else {
                        // Get mStable output currency if possible
                        let mStableOutputCurrency;
                        let mStableOutputAmountAfterFeeBN;
                        if (currencyCode === "mUSD" || MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(currencyCode) >= 0) {
                            for (var acceptedCurrency of directlyDepositableCurrencyCodes) {
                                if (acceptedCurrency === "mUSD" || MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(acceptedCurrency) >= 0) {
                                    if (currencyCode === "mUSD") {
                                        try {
                                            var redeemValidity = yield self.pools["mStable"].externalContracts.MassetValidationHelper.methods
                                                .getRedeemValidity("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", amount, self.internalTokens[acceptedCurrency].address)
                                                .call();
                                        }
                                        catch (err) {
                                            console.error("Failed to check mUSD redeem validity:", err);
                                            continue;
                                        }
                                        if (!redeemValidity || !redeemValidity["0"])
                                            continue;
                                        mStableOutputAmountAfterFeeBN = BigNumber.from(redeemValidity["2"]);
                                    }
                                }
                                else {
                                    try {
                                        var maxSwap = yield self.pools["mStable"].externalContracts.MassetValidationHelper.methods
                                            .getMaxSwap("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", self.internalTokens[currencyCode].address, self.internalTokens[acceptedCurrency].address)
                                            .call();
                                    }
                                    catch (err) {
                                        console.error("Failed to check mUSD max swap:", err);
                                        continue;
                                    }
                                    if (!maxSwap || !maxSwap["0"] || amount.gt(BigNumber.from(maxSwap["2"])))
                                        continue;
                                    var outputAmountBeforeFeesBN = amount
                                        .mul(self.internalTokens[acceptedCurrency].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, self.internalTokens[acceptedCurrency].decimals))).div(self.internalTokens[currencyCode].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, self.internalTokens[currencyCode].decimals)));
                                    if (acceptedCurrency === "mUSD")
                                        mStableOutputAmountAfterFeeBN = outputAmountBeforeFeesBN;
                                    else {
                                        var swapFeeBN = yield self.pools["mStable"].getMUsdSwapFeeBN();
                                        mStableOutputAmountAfterFeeBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN.mul(swapFeeBN).div(constants.WeiPerEther));
                                    }
                                }
                                mStableOutputCurrency = acceptedCurrency;
                                break;
                            }
                        }
                        // Ideally mStable, but 0x works too
                        if (mStableOutputCurrency !== null) {
                            let approvalReceipt;
                            // Get USD amount added to sender's fund balance
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                            var outputAmountUsdBN = mStableOutputAmountAfterFeeBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(mStableOutputCurrency)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[mStableOutputCurrency].decimals)));
                            // Check outputAmountUsdBN against minUsdAmount
                            if (typeof minUsdAmount !== "undefined" && minUsdAmount !== null && outputAmountUsdBN.lt(minUsdAmount))
                                return [outputAmountUsdBN];
                            // Approve tokens to RariFundProxy
                            try {
                                var allowanceBN = BigNumber.from(yield self.internalTokens[currencyCode].contract.callStatic.allowance(options.from, self.contracts.RariFundProxy.options.address));
                                if (allowanceBN.lt(amount)) {
                                    if (allowanceBN.gt(constants.Zero) && currencyCode === "USDT") {
                                        yield self.internalTokens[currencyCode].contract
                                            .approve(self.contracts.RariFundProxy.options.address, "0", options);
                                    }
                                    approvalReceipt = yield self.internalTokens[currencyCode].contract
                                        .approve(self.contracts.RariFundProxy.options.address, amount, options);
                                }
                            }
                            catch (err) {
                                throw new Error("Failed to approve tokens to RariFundProxy: " +
                                    (err.message ? err.message : err));
                            }
                            // Exchange and deposit tokens via mStable via RariFundProxy
                            try {
                                var receipt = yield self.contracts.RariFundProxy.exchangeAndDeposit(currencyCode, amount, mStableOutputCurrency, options);
                            }
                            catch (err) {
                                throw new Error("RariFundProxy.exchangeAndDeposit failed: " + (err.message ? err.message : err));
                            }
                            self.cache.clear("allBalances");
                            return [
                                mStableOutputAmountAfterFeeBN,
                                null,
                                approvalReceipt,
                                receipt,
                            ];
                        }
                        else {
                            // Use first accepted currency for 0x
                            let acceptedCurrency = directlyDepositableCurrencyCodes[0];
                            let approvalReceipt;
                            // Get orders from 0x swap API
                            try {
                                var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(currencyCode === "ETH"
                                    ? "WETH"
                                    : allTokens[currencyCode].address, allTokens[acceptedCurrency].address, amount);
                            }
                            catch (err) {
                                throw new Error("Failed to get swap orders from 0x API: " + err);
                            }
                            // Get USD amount added to sender's fund balance
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                            var makerAssetFilledAmountUsdBN = makerAssetFilledAmountBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(acceptedCurrency)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[acceptedCurrency].decimals)));
                            // Make sure input amount is completely filled
                            if (inputFilledAmountBN.lt(amount))
                                throw new Error("Unable to find enough liquidity to exchange " +
                                    currencyCode +
                                    " before depositing.");
                            // Multiply protocol fee by 1.5 to account for user upping the gas price
                            var protocolFeeBN = BigNumber.from(protocolFee).mul(BigNumber.from(15)).div(BigNumber.from(10));
                            // Make sure we have enough ETH for the protocol fee
                            var ethBalanceBN = currencyCode == "ETH"
                                ? accountBalanceBN
                                : BigNumber.from(yield self.provider.getBalance(options.from));
                            if (protocolFeeBN.gt(currencyCode === "ETH" ? ethBalanceBN.sub(amount) : ethBalanceBN)) {
                                throw new Error("ETH balance too low to cover 0x exchange protocol fee.");
                            }
                            // Check makerAssetFilledAmountUsdBN against minUsdAmount
                            if (typeof minUsdAmount !== "undefined" && minUsdAmount !== null && makerAssetFilledAmountUsdBN.lt(minUsdAmount))
                                return [makerAssetFilledAmountUsdBN];
                            // Approve tokens to RariFundProxy if token is not ETH
                            if (currencyCode !== "ETH") {
                                try {
                                    var allowanceBN = BigNumber.from(yield allTokens[currencyCode].contract
                                        .allowance(options.from, self.contracts.RariFundProxy.options.address));
                                    if (allowanceBN.lt(amount)) {
                                        if (allowanceBN.gt(constants.Zero) &&
                                            currencyCode === "USDT")
                                            yield allTokens[currencyCode].contract.methods
                                                .approve(self.contracts.RariFundProxy.options.address, "0")
                                                .send(options);
                                        approvalReceipt = yield allTokens[currencyCode].contract.methods
                                            .approve(self.contracts.RariFundProxy.options.address, amount)
                                            .send(options);
                                    }
                                }
                                catch (err) {
                                    throw new Error("Failed to approve tokens to RariFundProxy: " + (err.message ? err.message : err));
                                }
                            }
                            // Build array of orders and signatures
                            let signatures = [];
                            for (var j = 0; j < orders.length; j++) {
                                signatures[j] = orders[j].signature;
                                orders[j] = {
                                    makerAddress: orders[j].makerAddress,
                                    takerAddress: orders[j].takerAddress,
                                    feeRecipientAddress: orders[j].feeRecipientAddress,
                                    senderAddress: orders[j].senderAddress,
                                    makerAssetAmount: orders[j].makerAssetAmount,
                                    takerAssetAmount: orders[j].takerAssetAmount,
                                    makerFee: orders[j].makerFee,
                                    takerFee: orders[j].takerFee,
                                    expirationTimeSeconds: orders[j].expirationTimeSeconds,
                                    salt: orders[j].salt,
                                    makerAssetData: orders[j].makerAssetData,
                                    takerAssetData: orders[j].takerAssetData,
                                    makerFeeAssetData: orders[j].makerFeeAssetData,
                                    takerFeeAssetData: orders[j].takerFeeAssetData,
                                };
                            }
                            // Exchange and deposit tokens via RariFundProxy
                            try {
                                var receipt = yield self.contracts.RariFundProxy.methods
                                    .exchangeAndDeposit(currencyCode === "ETH"
                                    ? "0x0000000000000000000000000000000000000000"
                                    : allTokens[currencyCode].address, amount, acceptedCurrency, orders, signatures, takerAssetFilledAmountBN)
                                    .send(Object.assign({
                                    value: currencyCode === "ETH"
                                        ? protocolFeeBN.add(amount).toString()
                                        : protocolFeeBN.toString(),
                                    gasPrice: gasPrice,
                                }, options));
                            }
                            catch (err) {
                                throw new Error("RariFundProxy.exchangeAndDeposit failed: " +
                                    (err.message ? err.message : err));
                            }
                            self.cache.clear("allBalances");
                            return [
                                makerAssetFilledAmountUsdBN,
                                protocolFeeBN,
                                approvalReceipt,
                                receipt,
                            ];
                        }
                    }
                });
            }
        };
        this.withdrawals = {
            getWithdrawalCurrencies: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var currencyCodes = self.allocations.CURRENCIES.slice();
                    currencyCodes.push("ETH");
                    var allTokens = yield self.getAllTokens();
                    for (const currencyCode of Object.keys(allTokens))
                        if (currencyCodes.indexOf(currencyCode) < 0)
                            currencyCodes.push(currencyCode);
                    return currencyCodes;
                });
            },
            getWithdrawalCurrenciesWithoutSlippage: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.allocations.getRawCurrencyAllocations();
                });
            },
            getMaxWithdrawalAmount: function (currencyCode, senderUsdBalance, sender) {
                return __awaiter(this, void 0, void 0, function* () {
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    if (!senderUsdBalance || senderUsdBalance.lte(constants.Zero))
                        return [constants.Zero];
                    // Get user fund balance
                    if (senderUsdBalance === undefined)
                        senderUsdBalance = BigNumber.from(yield self.contracts.RariFundManager.callStatic
                            .balanceOf(sender));
                    // Check balances to find withdrawal source
                    var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.methods.getRawFundBalancesAndPrices()
                        .call);
                    // See how much we can withdraw directly if token is supported by the fund
                    var i = allBalances["0"].indexOf(currencyCode);
                    var tokenRawFundBalanceBN = constants.Zero;
                    if (i >= 0) {
                        tokenRawFundBalanceBN = BigNumber.from(allBalances["1"][i]);
                        for (var j = 0; j < allBalances["3"][i].length; j++)
                            tokenRawFundBalanceBN = tokenRawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                    }
                    if (tokenRawFundBalanceBN.gt(constants.Zero)) {
                        var maxWithdrawalAmountBN = senderUsdBalance
                            .mul(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals)))
                            .div(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]));
                        if (maxWithdrawalAmountBN
                            .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals)))
                            .gt(senderUsdBalance))
                            maxWithdrawalAmountBN = maxWithdrawalAmountBN.sub(constants.One);
                        // If tokenRawFundBalanceBN >= maxWithdrawalAmountBN, return maxWithdrawalAmountBN
                        if (tokenRawFundBalanceBN.gte(maxWithdrawalAmountBN))
                            return [maxWithdrawalAmountBN];
                    }
                    // Otherwise, exchange as few currencies as possible (ideally those with the lowest balances)
                    var amountInputtedUsdBN = constants.Zero;
                    var amountWithdrawnBN = constants.Zero;
                    var totalProtocolFeeBN = constants.Zero;
                    // Withdraw as much as we can of the output token first
                    if (tokenRawFundBalanceBN.gt(constants.Zero)) {
                        amountInputtedUsdBN = amountInputtedUsdBN.add(tokenRawFundBalanceBN
                            .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals))));
                        amountWithdrawnBN = amountWithdrawnBN.add(tokenRawFundBalanceBN);
                    }
                    // Get input candidates
                    let inputCandidates = [];
                    for (var i = 0; i < allBalances["0"].length; i++) {
                        var inputCurrencyCode = allBalances["0"][i];
                        if (inputCurrencyCode !== currencyCode) {
                            var rawFundBalanceBN = BigNumber.from(allBalances["1"][i]);
                            for (var j = 0; j < allBalances["3"][i].length; j++)
                                rawFundBalanceBN = rawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                            if (rawFundBalanceBN.gt(constants.Zero)) {
                                inputCandidates.push({
                                    currencyCode: inputCurrencyCode,
                                    rawFundBalanceBN,
                                });
                            }
                        }
                    }
                    // Calculate max inputs
                    function updateMaxInputs() {
                        let inputCandidates2 = [];
                        for (const inputCandidate of inputCandidates) {
                            // Calculate inputAmountBN as maximum of sender USD balance left and rawFundBalanceBN
                            var usdAmountLeft = senderUsdBalance.sub(amountInputtedUsdBN);
                            var maxInputAmountLeftBN = usdAmountLeft
                                .mul(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[inputCandidate.currencyCode].decimals)))
                                .div(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidate.currencyCode)]));
                            if (maxInputAmountLeftBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidate.currencyCode)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[inputCandidate.currencyCode]
                                .decimals)))
                                .gt(usdAmountLeft))
                                maxInputAmountLeftBN = maxInputAmountLeftBN.sub(constants.One);
                            var inputAmountBN = maxInputAmountLeftBN.lt(inputCandidate.rawFundBalanceBN) ? maxInputAmountLeftBN : inputCandidate.rawFundBalanceBN;
                            if (inputAmountBN.gt(constants.Zero))
                                inputCandidates2.push({
                                    currencyCode: inputCandidate.currencyCode,
                                    rawFundBalanceBN: inputCandidate.rawFundBalanceBN,
                                    inputAmountBN,
                                });
                        }
                        inputCandidates = inputCandidates2;
                    }
                    updateMaxInputs();
                    // TODO: Sort candidates from lowest to highest inputAmountUsdBN (or highest to lowest inputAmountUsdBN?)
                    /* inputCandidates.sort((a, b) =>
                      a.inputAmountUsdBN.gt(b.inputAmountUsdBN) ? 1 : -1
                    ); */
                    // mStable
                    if (currencyCode === "mUSD" ||
                        MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(currencyCode) >=
                            0) {
                        var mStableSwapFeeBN = null;
                        for (var i = 0; i < inputCandidates.length; i++) {
                            if (inputCandidates[i].currencyCode !== "mUSD" &&
                                MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(inputCandidates[i].currencyCode) < 0)
                                continue;
                            var mStableInputAmountBN = inputCandidates[i].inputAmountBN;
                            var mStableOutputAmountAfterFeesBN = constants.Zero;
                            // Check max swap/redeem validity
                            if (inputCandidates[i].currencyCode === "mUSD") {
                                try {
                                    var redeemValidity = yield self.pools["mStable"].externalContracts.MassetValidationHelper
                                        .getRedeemValidity("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", mStableInputAmountBN, self.internalTokens[currencyCode].address);
                                }
                                catch (err) {
                                    console.error("Failed to check mUSD redeem validity:", err);
                                    continue;
                                }
                                if (!redeemValidity || !redeemValidity["0"])
                                    continue;
                                mStableOutputAmountAfterFeesBN = BigNumber.from(redeemValidity["2"]);
                            }
                            else {
                                try {
                                    var maxSwap = yield self.pools["mStable"].externalContracts.MassetValidationHelper
                                        .getMaxSwap("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", self.internalTokens[inputCandidates[i].currencyCode]
                                        .address, self.internalTokens[currencyCode].address);
                                }
                                catch (err) {
                                    console.error("Failed to check mUSD max swap:", err);
                                    continue;
                                }
                                if (!maxSwap ||
                                    !maxSwap["0"] ||
                                    BigNumber.from(maxSwap["2"]).lte(constants.Zero))
                                    continue;
                                mStableInputAmountBN =
                                    mStableInputAmountBN.lt(BigNumber.from(maxSwap["2"])) ? mStableInputAmountBN : BigNumber.from(maxSwap["2"]);
                                var outputAmountBeforeFeesBN = mStableInputAmountBN
                                    .mul(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[currencyCode].decimals)))
                                    .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode].decimals)));
                                if (currencyCode === "mUSD")
                                    mStableOutputAmountAfterFeesBN = outputAmountBeforeFeesBN;
                                else {
                                    if (mStableSwapFeeBN === null)
                                        mStableSwapFeeBN = yield self.pools["mStable"].getMUsdSwapFeeBN();
                                    mStableOutputAmountAfterFeesBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                        .mul(mStableSwapFeeBN)
                                        .div(constants.WeiPerEther));
                                }
                            }
                            amountInputtedUsdBN = amountInputtedUsdBN.add(mStableInputAmountBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                .decimals))));
                            amountWithdrawnBN = amountWithdrawnBN.add(mStableOutputAmountAfterFeesBN);
                            // Update inputCandidates
                            updateMaxInputs();
                            // Stop if we have filled the USD amount
                            if (amountInputtedUsdBN.gt(senderUsdBalance))
                                throw new Error("Amount inputted in USD greater than sender USD fund balance");
                            if (amountInputtedUsdBN.gte(senderUsdBalance.sub(BigNumber.from(10).mul(BigNumber.from(16)))))
                                break;
                        }
                    }
                    // Use 0x if necessary
                    // Deal with amountInputtedUsdBN.lt(senderUsdBalance) not being accurate better than 1 cent margin of error
                    if (amountInputtedUsdBN.lt(senderUsdBalance.sub(BigNumber.from(10).mul(BigNumber.from(16)))) &&
                        inputCandidates.length > 0) {
                        // Get orders from 0x swap API for each input currency candidate
                        for (var i = 0; i < inputCandidates.length; i++) {
                            try {
                                var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(self.internalTokens[inputCandidates[i].currencyCode].address, currencyCode === "ETH"
                                    ? "WETH"
                                    : allTokens[currencyCode].address, inputCandidates[i].inputAmountBN);
                            }
                            catch (err) {
                                if (err === "Insufficient liquidity") {
                                    inputCandidates.splice(i, 1);
                                    i--;
                                    continue;
                                }
                                throw new Error("Failed to get swap orders from 0x API: " + err);
                            }
                            inputCandidates[i].inputFillAmountBN = inputFilledAmountBN;
                            inputCandidates[i].protocolFeeBN = BigNumber.from(protocolFee).mul(BigNumber.from(15)).div(BigNumber.from(10)); // Multiply protocol fee by 1.5 to account for user upping the gas price
                            inputCandidates[i].takerAssetFillAmountBN = takerAssetFilledAmountBN;
                            inputCandidates[i].makerAssetFillAmountBN = makerAssetFilledAmountBN;
                            inputCandidates[i].takerAssetFillAmountUsdBN = takerAssetFilledAmountBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                .decimals)));
                        }
                        // Sort candidates from highest to lowest output per USD burned
                        inputCandidates.sort((a, b) => b.makerAssetFillAmountBN
                            .mul(constants.WeiPerEther)
                            .div(b.takerAssetFillAmountUsdBN)
                            .gt(a.makerAssetFillAmountBN
                            .mul(constants.WeiPerEther)
                            .div(a.takerAssetFillAmountUsdBN))
                            ? 1
                            : -1);
                        // Loop through input currency candidates until we fill the withdrawal
                        for (var i = 0; i < inputCandidates.length; i++) {
                            // Is this order enough to cover the rest of the withdrawal?
                            var usdAmountLeft = senderUsdBalance.sub(amountInputtedUsdBN);
                            var inputFillAmountUsdBN = inputCandidates[i].inputFillAmountBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                .decimals)));
                            if (inputFillAmountUsdBN.gte(usdAmountLeft.sub(BigNumber.from(10).mul(BigNumber.from(16))))) {
                                // If order is enough to cover the rest of the withdrawal, cover it and stop looping through input candidates
                                var thisInputAmountBN = inputCandidates[i].inputFillAmountBN
                                    .mul(usdAmountLeft)
                                    .div(inputFillAmountUsdBN);
                                var thisOutputAmountBN = inputCandidates[i].makerAssetFillAmountBN
                                    .mul(usdAmountLeft)
                                    .div(inputFillAmountUsdBN);
                                amountInputtedUsdBN = amountInputtedUsdBN.add(thisInputAmountBN
                                    .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                    .div(BigNumber.from(10)
                                    .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals))));
                                amountWithdrawnBN = amountWithdrawnBN.add(thisOutputAmountBN);
                                totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                                break;
                            }
                            else {
                                // Otherwise, add the whole order and keep looping through input candidates
                                amountInputtedUsdBN = amountInputtedUsdBN.add(inputCandidates[i].inputFillAmountBN
                                    .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                    .div(BigNumber.from(10)
                                    .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals))));
                                amountWithdrawnBN = amountWithdrawnBN.add(inputCandidates[i].makerAssetFillAmountBN);
                                totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                            }
                            // Stop if we have filled the USD amount
                            if (amountInputtedUsdBN.gt(senderUsdBalance))
                                throw new Error("Amount inputted in USD greater than sender USD fund balance");
                            if (amountInputtedUsdBN.gte(senderUsdBalance.sub(BigNumber.from(10).mul(BigNumber.from(16)))))
                                break;
                        }
                        // Make sure input amount is completely filled
                        if (amountInputtedUsdBN.lt(senderUsdBalance.sub(BigNumber.from(10).mul(BigNumber.from(16)))))
                            throw new Error("Unable to find enough liquidity to exchange withdrawn tokens to " +
                                currencyCode +
                                ".");
                    }
                    // Return amountWithdrawnBN and totalProtocolFeeBN
                    return [amountWithdrawnBN, totalProtocolFeeBN];
                });
            },
            validateWithdrawal: function (currencyCode, amount, sender, getSlippage) {
                return __awaiter(this, void 0, void 0, function* () {
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    if (!amount || amount.lte(constants.Zero))
                        throw new Error("Withdrawal amount must be greater than 0!");
                    // Check balances to find withdrawal source
                    var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                    // See how much we can withdraw directly if token is supported by the fund
                    var i = allBalances["0"].indexOf(currencyCode);
                    var tokenRawFundBalanceBN = constants.Zero;
                    if (i >= 0) {
                        tokenRawFundBalanceBN = BigNumber.from(allBalances["1"][i]);
                        for (var j = 0; j < allBalances["3"][i].length; j++)
                            tokenRawFundBalanceBN = tokenRawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                    }
                    if (tokenRawFundBalanceBN.gte(amount)) {
                        var amountUsdBN = amount
                            .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[currencyCode].decimals)));
                        // Check amountUsdBN against user fund balance
                        var senderUsdBalance = BigNumber.from(yield self.contracts.RariFundManager.callStatic
                            .balanceOf(sender));
                        if (amountUsdBN.gt(senderUsdBalance))
                            throw new Error("Requested withdrawal amount is greater than the sender's " +
                                self.POOL_NAME +
                                " balance. Please click the max button and try again (or reload and try again later if the issue persists).");
                        // Return amountUsdBN
                        return [amountUsdBN, null, constants.Zero];
                    }
                    else {
                        // Otherwise, exchange as few currencies as possible (ideally those with the lowest balances)
                        var amountInputtedUsdBN = constants.Zero;
                        var amountWithdrawnBN = constants.Zero;
                        var totalProtocolFeeBN = constants.Zero;
                        // Withdraw as much as we can of the output token first
                        if (tokenRawFundBalanceBN.gt(constants.Zero)) {
                            amountInputtedUsdBN = amountInputtedUsdBN.add(tokenRawFundBalanceBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                                .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[currencyCode].decimals))));
                            amountWithdrawnBN = amountWithdrawnBN.add(tokenRawFundBalanceBN);
                        }
                        // Get input candidates
                        let inputCandidates = [];
                        for (var i = 0; i < allBalances["0"].length; i++) {
                            if (allBalances["0"][i] !== currencyCode) {
                                var rawFundBalanceBN = constants.Zero;
                                for (var j = 0; j < allBalances["3"][i].length; j++)
                                    rawFundBalanceBN = rawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                                if (rawFundBalanceBN.gt(constants.Zero))
                                    inputCandidates.push({
                                        currencyCode: allBalances["0"][i],
                                        rawFundBalanceBN,
                                    });
                            }
                        }
                        // mStable
                        if (currencyCode === "mUSD" ||
                            MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(currencyCode) >= 0) {
                            let mStableSwapFeeBN;
                            for (var i = 0; i < inputCandidates.length; i++) {
                                if (inputCandidates[i].currencyCode !== "mUSD" &&
                                    MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(inputCandidates[i].currencyCode) < 0)
                                    continue;
                                // Get swap fee and calculate input amount needed to fill output amount
                                if (currencyCode !== "mUSD" && mStableSwapFeeBN === null) {
                                    mStableSwapFeeBN = yield self.pools["mStable"].getMUsdSwapFeeBN();
                                    var inputAmountBN = amount
                                        .sub(amountWithdrawnBN)
                                        .mul(constants.WeiPerEther)
                                        .div(constants.WeiPerEther.sub(mStableSwapFeeBN))
                                        .mul(self.internalTokens[inputCandidates[i].currencyCode].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, self.internalTokens[inputCandidates[i].currencyCode].decimals))).div(allTokens[currencyCode].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, allTokens[currencyCode].decimals)));
                                    var outputAmountBeforeFeesBN = inputAmountBN
                                        .mul(allTokens[currencyCode].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, allTokens[currencyCode].decimals)))
                                        .div(self.internalTokens[inputCandidates[i].currencyCode].decimals === 18
                                        ? constants.WeiPerEther
                                        : BigNumber.from(Math.pow(10, self.internalTokens[inputCandidates[i].currencyCode].decimals)));
                                    var outputAmountBN = currencyCode === "mUSD"
                                        ? outputAmountBeforeFeesBN
                                        : outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                            .mul(mStableSwapFeeBN)
                                            .div(constants.WeiPerEther));
                                    var tries = 0;
                                    while (outputAmountBN.lt(amount.sub(amountWithdrawnBN))) {
                                        if (tries >= 1000)
                                            throw new Error("Failed to get increment order input amount to achieve desired output amount.");
                                        inputAmountBN = inputAmountBN.add(constants.One); // Make sure we have enough input amount to receive amount.sub(amountWithdrawnBN)
                                        outputAmountBeforeFeesBN = inputAmountBN
                                            .mul(BigNumber.from(10).pow(BigNumber.from(allTokens[currencyCode].decimals)))
                                            .div(BigNumber.from(10).pow(self.internalTokens[inputCandidates[i].currencyCode].decimals));
                                        outputAmountBN =
                                            currencyCode === "mUSD"
                                                ? outputAmountBeforeFeesBN
                                                : outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                                    .mul(mStableSwapFeeBN)
                                                    .div(constants.WeiPerEther));
                                        tries++;
                                    }
                                    if (inputAmountBN.gt(inputCandidates[i].rawFundBalanceBN)) {
                                        inputAmountBN = inputCandidates[i].rawFundBalanceBN;
                                        outputAmountBeforeFeesBN = inputAmountBN
                                            .mul(BigNumber.from(10).pow(allTokens[currencyCode].decimals))
                                            .div(BigNumber.from(10).pow(self.internalTokens[inputCandidates[i].currencyCode].decimals));
                                        outputAmountBN =
                                            currencyCode === "mUSD"
                                                ? outputAmountBeforeFeesBN
                                                : outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                                    .mul(mStableSwapFeeBN)
                                                    .div(constants.WeiPerEther));
                                    }
                                    // Check max swap/redeem validity
                                    if (inputCandidates[i].currencyCode === "mUSD") {
                                        try {
                                            var redeemValidity = yield self.pools["mStable"].externalContracts.MassetValidationHelper
                                                .getRedeemValidity("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", inputAmountBN, self.internalTokens[currencyCode].address);
                                        }
                                        catch (err) {
                                            console.error("Failed to check mUSD redeem validity:", err);
                                        }
                                        //if (!redeemValidity || !redeemValidity["0"]) break;
                                        if (!outputAmountBN.eq(BigNumber.from(redeemValidity["2"])))
                                            throw new Error("Predicted mStable output amount and output amount returned by getRedeemValidity not equal.");
                                    }
                                    else {
                                        try {
                                            var maxSwap = yield self.pools["mStable"].externalContracts.MassetValidationHelper
                                                .getMaxSwap("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", self.internalTokens[inputCandidates[i].currencyCode]
                                                .address, self.internalTokens[currencyCode].address);
                                        }
                                        catch (err) {
                                            console.error("Failed to check mUSD max swap:", err);
                                            continue;
                                        }
                                        if (!maxSwap ||
                                            !maxSwap["0"] ||
                                            BigNumber.from(maxSwap["2"]).lt(inputAmountBN))
                                            continue;
                                    }
                                    amountInputtedUsdBN = amountInputtedUsdBN.add(inputAmountBN
                                        .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)])).div(BigNumber.from(10)
                                        .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals))));
                                    amountWithdrawnBN = amountWithdrawnBN.add(outputAmountBN);
                                    inputCandidates[i].rawFundBalanceBN = inputCandidates[i].rawFundBalanceBN.sub(inputAmountBN);
                                    if (inputCandidates[i].rawFundBalanceBN.isZero()) {
                                        inputCandidates.splice(i, 1);
                                        i--;
                                    }
                                    // Stop if we have filled the withdrawal
                                    if (amountWithdrawnBN.gte(amount))
                                        break;
                                }
                            }
                        }
                        // Use 0x if necessary
                        if (amountWithdrawnBN.lt(amount)) {
                            // Get orders from 0x swap API for each input currency candidate
                            for (var i = 0; i < inputCandidates.length; i++) {
                                try {
                                    var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(self.internalTokens[inputCandidates[i].currencyCode].address, currencyCode === "ETH"
                                        ? "WETH"
                                        : allTokens[currencyCode].address, inputCandidates[i].rawFundBalanceBN, amount.sub(amountWithdrawnBN));
                                }
                                catch (err) {
                                    if (err === "Insufficient liquidity") {
                                        inputCandidates.splice(i, 1);
                                        i--;
                                        continue;
                                    }
                                    throw new Error("Failed to get swap orders from 0x API: " + err);
                                }
                                inputCandidates[i].inputFillAmountBN = inputFilledAmountBN;
                                inputCandidates[i].protocolFeeBN = BigNumber.from(protocolFee)
                                    .mul(BigNumber.from(15))
                                    .div(BigNumber.from(10)); // Multiply protocol fee by 1.5 to account for user upping the gas price
                                inputCandidates[i].takerAssetFillAmountBN = takerAssetFilledAmountBN;
                                inputCandidates[i].makerAssetFillAmountBN = makerAssetFilledAmountBN;
                                inputCandidates[i].takerAssetFillAmountUsdBN = takerAssetFilledAmountBN
                                    .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                    .div(BigNumber.from(10)
                                    .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals)));
                            }
                            // Sort candidates from highest to lowest output per USD burned
                            inputCandidates.sort((a, b) => b.makerAssetFillAmountBN
                                .mul(constants.WeiPerEther)
                                .div(b.takerAssetFillAmountUsdBN)
                                .gt(a.makerAssetFillAmountBN
                                .mul(constants.WeiPerEther)
                                .div(a.takerAssetFillAmountUsdBN))
                                ? 1
                                : -1);
                            // Loop through input currency candidates until we fill the withdrawal
                            for (var i = 0; i < inputCandidates.length; i++) {
                                if (inputCandidates[i].makerAssetFillAmountBN.gte(amount.sub(amountWithdrawnBN))) {
                                    // If order is enough to cover the rest of the withdrawal, cover it and stop looping through input candidates
                                    var thisOutputAmountBN = amount.sub(amountWithdrawnBN);
                                    var thisInputAmountBN = inputCandidates[i].inputFillAmountBN
                                        .mul(thisOutputAmountBN)
                                        .div(inputCandidates[i].makerAssetFillAmountBN);
                                    var tries = 0;
                                    while (inputCandidates[i].makerAssetFillAmountBN
                                        .mul(thisInputAmountBN)
                                        .div(inputCandidates[i].inputFillAmountBN)
                                        .lt(thisOutputAmountBN)) {
                                        if (tries >= 1000)
                                            throw new Error("Failed to get increment order input amount to achieve desired output amount.");
                                        thisInputAmountBN.iadd(constants.One); // Make sure we have enough input fill amount to achieve this maker asset fill amount
                                        tries++;
                                    }
                                    amountInputtedUsdBN = amountInputtedUsdBN.add(thisInputAmountBN
                                        .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                        .div(BigNumber.from(10)
                                        .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals))));
                                    amountWithdrawnBN = amountWithdrawnBN.add(thisOutputAmountBN);
                                    totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                                    break;
                                }
                                else {
                                    // Otherwise, add the whole order and keep looping through input candidates
                                    amountInputtedUsdBN = amountInputtedUsdBN.add(inputCandidates[i].inputFillAmountBN
                                        .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                        .div(BigNumber.from(10)
                                        .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals))));
                                    amountWithdrawnBN = amountWithdrawnBN.add(inputCandidates[i].makerAssetFillAmountBN);
                                    totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                                }
                                // Stop if we have filled the withdrawal
                                if (amountWithdrawnBN.gte(amount))
                                    break;
                            }
                            // Make sure input amount is completely filled
                            if (amountWithdrawnBN.lt(amount))
                                throw new Error("Unable to find enough liquidity to exchange withdrawn tokens to " + currencyCode + ".");
                        }
                        // Check amountInputtedUsdBN against user fund balance
                        var senderUsdBalance = BigNumber.from(yield self.contracts.RariFundManager.calStatic.balanceOf(sender));
                        if (amountInputtedUsdBN.gt(senderUsdBalance))
                            throw new Error("Requested withdrawal amount is greater than the sender's " +
                                self.POOL_NAME +
                                " balance. Please click the max button and try again (or reload and try again later if the issue persists).");
                        // Return amountInputtedUsdBN
                        return [
                            amountInputtedUsdBN,
                            totalProtocolFeeBN,
                            getSlippage
                                ? yield self.withdrawals.getWithdrawalSlippage(currencyCode, amount, amountInputtedUsdBN)
                                : null,
                        ];
                    }
                });
            },
            getWithdrawalSlippage: function (currencyCode, amount, usdAmount) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (self.POOL_TOKEN_SYMBOL === "RYPT") {
                        var directlyDepositableCurrencyCodes = yield self.cache.getOrUpdate("acceptedCurrencies", self.contracts.RariFundManager.callStatic.getAcceptedCurrencies);
                        if (directlyDepositableCurrencyCodes &&
                            directlyDepositableCurrencyCodes.length > 0 &&
                            directlyDepositableCurrencyCodes.indexOf(currencyCode) >= 0) {
                            var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                            return constants.WeiPerEther.sub(amount
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                                .div(constants.WeiPerEther)
                                .mul(BigNumber.from(10)
                                .pow(BigNumber.from(36 - self.internalTokens[currencyCode].decimals)))
                                .div(usdAmount));
                        }
                    }
                    else if (self.POOL_TOKEN_SYMBOL === "RSPT") {
                        if (currencyCode === "USDC")
                            return constants.WeiPerEther
                                .sub(amount
                                .mul(BigNumber.from(10).pow(BigNumber.from(36 - 6)))
                                .div(usdAmount))
                                .toString();
                        if (currencyCode === "mUSD")
                            return constants.WeiPerEther
                                .sub(amount.mul(constants.WeiPerEther).div(usdAmount))
                                .toString();
                    }
                    else if (self.POOL_TOKEN_SYMBOL === "RDPT") {
                        if (currencyCode === "DAI")
                            return constants.WeiPerEther
                                .sub(amount.mul(constants.WeiPerEther).div(usdAmount))
                                .toString();
                    }
                    else {
                        throw "Not implemented for " + self.POOL_TOKEN_SYMBOL;
                    }
                    // Get tokens
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    // Try cache
                    if (self.cache._raw.coinGeckoUsdPrices &&
                        self.cache._raw.coinGeckoUsdPrices.value &&
                        self.cache._raw.coinGeckoUsdPrices.value["USDC"] &&
                        self.cache._raw.coinGeckoUsdPrices.value[currencyCode] &&
                        new Date().getTime() / 1000 <=
                            self.cache._raw.coinGeckoUsdPrices.lastUpdated +
                                self.cache._raw.coinGeckoUsdPrices.timeout) {
                        if (self.POOL_TOKEN_SYMBOL === "RSPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["USDC"];
                        else if (self.POOL_TOKEN_SYMBOL === "RDPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["DAI"];
                        else
                            usdAmount = parseFloat(usdAmount.toString());
                        return constants.WeiPerEther
                            .sub(BigNumber.from(Math.trunc((parseFloat(amount.toString()) *
                            self.cache._raw.coinGeckoUsdPrices.value[currencyCode] *
                            Math.pow(10, (currencyCode === "ETH"
                                ? 18
                                : 36 - allTokens[currencyCode].decimals)) /
                            usdAmount))));
                    }
                    // Build currency code array
                    var currencyCodes = [...self.allocations.CURRENCIES];
                    currencyCodes.push(currencyCode);
                    // Get CoinGecko IDs
                    var decoded = yield self.cache.getOrUpdate("coinGeckoList", function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            return (yield axios.get("https://api.coingecko.com/api/v3/coins/list")).data;
                        });
                    });
                    if (!decoded)
                        throw new Error("Failed to decode coins list from CoinGecko");
                    var currencyCodesByCoinGeckoIds = {};
                    for (const currencyCode of currencyCodes) {
                        var filtered = decoded.filter((coin) => coin.symbol.toLowerCase() === currencyCode.toLowerCase());
                        if (!filtered)
                            throw new Error("Failed to get currency IDs from CoinGecko");
                        for (const coin of filtered)
                            currencyCodesByCoinGeckoIds[coin.id] = currencyCode;
                    }
                    // Get prices
                    var decoded = (yield axios.get("https://api.coingecko.com/api/v3/simple/price", {
                        params: {
                            vs_currencies: "usd",
                            ids: Object.keys(currencyCodesByCoinGeckoIds).join(","),
                            include_market_cap: true,
                        },
                    })).data;
                    if (!decoded)
                        throw new Error("Failed to decode USD exchange rates from CoinGecko");
                    var prices = {};
                    var maxMarketCaps = {};
                    for (const key of Object.keys(decoded))
                        if (prices[currencyCodesByCoinGeckoIds[key]] === undefined ||
                            decoded[key].usd_market_cap >
                                maxMarketCaps[currencyCodesByCoinGeckoIds[key]]) {
                            maxMarketCaps[currencyCodesByCoinGeckoIds[key]] =
                                decoded[key].usd_market_cap;
                            prices[currencyCodesByCoinGeckoIds[key]] = decoded[key].usd;
                        }
                    // Update cache
                    self.cache.update("coinGeckoUsdPrices", prices);
                    // Return slippage
                    if (self.cache._raw.coinGeckoUsdPrices.value["USDC"] &&
                        self.cache._raw.coinGeckoUsdPrices.value[currencyCode]) {
                        if (self.POOL_TOKEN_SYMBOL === "RSPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["USDC"];
                        else if (self.POOL_TOKEN_SYMBOL === "RDPT")
                            usdAmount =
                                parseFloat(usdAmount.toString()) *
                                    self.cache._raw.coinGeckoUsdPrices.value["DAI"];
                        else
                            usdAmount = parseFloat(usdAmount.toString());
                        return constants.WeiPerEther
                            .sub(BigNumber.from(Math.trunc((parseFloat(amount.toString()) *
                            self.cache._raw.coinGeckoUsdPrices.value[currencyCode] *
                            Math.pow(10, (currencyCode === "ETH"
                                ? 18
                                : 36 - allTokens[currencyCode].decimals)) /
                            usdAmount))));
                    }
                    else
                        throw new Error("Failed to get currency prices from CoinGecko");
                });
            },
            withdraw: function (currencyCode, amount, maxUsdAmount, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!options || !options.from)
                        throw new Error("Options parameter not set or from address not set.");
                    var allTokens = yield self.getAllTokens();
                    if (currencyCode !== "ETH" && !allTokens[currencyCode])
                        throw new Error("Invalid currency code!");
                    if (!amount || amount.lte(constants.Zero))
                        throw new Error("Withdrawal amount must be greater than 0!");
                    // Check balances to find withdrawal source
                    var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundProxy.callStatic.getRawFundBalancesAndPrices);
                    // See how much we can withdraw directly if token is supported by the fund
                    var i = allBalances["0"].indexOf(currencyCode);
                    var tokenRawFundBalanceBN = constants.Zero;
                    if (i >= 0) {
                        tokenRawFundBalanceBN = BigNumber.from(allBalances["1"][i]);
                        for (var j = 0; j < allBalances["3"][i].length; j++)
                            tokenRawFundBalanceBN = tokenRawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                    }
                    if (tokenRawFundBalanceBN.gte(amount)) {
                        // Check maxUsdAmount
                        var amountUsdBN = amount
                            .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                            .div(BigNumber.from(10)
                            .pow(BigNumber.from(self.internalTokens[currencyCode].decimals)));
                        if (typeof maxUsdAmount !== "undefined" &&
                            maxUsdAmount !== null &&
                            amountUsdBN.gt(maxUsdAmount))
                            return [amountUsdBN];
                        // If we can withdraw everything directly, do so
                        try {
                            var receipt = yield self.contracts.RariFundManager
                                .withdraw(currencyCode, amount, options);
                        }
                        catch (err) {
                            throw new Error("RariFundManager.withdraw failed: " +
                                (err.message ? err.message : err));
                        }
                        self.cache.clear("allBalances");
                        return [amountUsdBN, null, receipt];
                    }
                    else {
                        // Otherwise, exchange as few currencies as possible (ideally those with the lowest balances)
                        let inputCurrencyCodes = [];
                        let inputAmountBNs = [];
                        let allOrders = [];
                        let allSignatures = [];
                        let makerAssetFillAmountBNs = [];
                        let protocolFeeBNs = [];
                        let amountInputtedUsdBN = constants.Zero;
                        let amountWithdrawnBN = constants.Zero;
                        let totalProtocolFeeBN = constants.Zero;
                        // Withdraw as much as we can of the output token first
                        if (tokenRawFundBalanceBN.gt(constants.Zero)) {
                            inputCurrencyCodes.push(currencyCode);
                            inputAmountBNs.push(tokenRawFundBalanceBN);
                            allOrders.push([]);
                            allSignatures.push([]);
                            makerAssetFillAmountBNs.push(constants.Zero);
                            protocolFeeBNs.push(constants.Zero);
                            amountInputtedUsdBN = amountInputtedUsdBN.add(tokenRawFundBalanceBN
                                .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(currencyCode)]))
                                .div(BigNumber.from(10)
                                .pow(BigNumber.from(self.internalTokens[currencyCode].decimals))));
                            amountWithdrawnBN = amountWithdrawnBN.add(tokenRawFundBalanceBN);
                        }
                        // Get input candidates
                        let inputCandidates = [];
                        for (var i = 0; i < allBalances["0"].length; i++)
                            if (allBalances["0"][i] !== currencyCode) {
                                var rawFundBalanceBN = constants.Zero;
                                for (var j = 0; j < allBalances["3"][i].length; j++)
                                    rawFundBalanceBN = rawFundBalanceBN.add(BigNumber.from(allBalances["3"][i][j]));
                                if (rawFundBalanceBN.gt(constants.Zero))
                                    inputCandidates.push({
                                        currencyCode: allBalances["0"][i],
                                        rawFundBalanceBN,
                                    });
                            }
                        // TODO: Sort candidates from lowest to highest rawFundBalanceUsdBN (or highest to lowest?)
                        /* inputCandidates.sort((a, b) =>
                          a.rawFundBalanceUsdBN.gt(b.rawFundBalanceUsdBN) ? 1 : -1
                        ); */
                        // mStable
                        if (currencyCode === "mUSD" ||
                            MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(currencyCode) >= 0) {
                            let mStableSwapFeeBN = null;
                            for (var i = 0; i < inputCandidates.length; i++) {
                                if (inputCandidates[i].currencyCode !== "mUSD" &&
                                    MStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES.indexOf(inputCandidates[i].currencyCode) < 0)
                                    continue;
                                // Get swap fee and calculate input amount needed to fill output amount
                                if (mStableSwapFeeBN === null)
                                    mStableSwapFeeBN = yield self.pools["mStable"].getMUsdSwapFeeBN();
                                var inputAmountBN = amount
                                    .sub(amountWithdrawnBN)
                                    .mul(constants.WeiPerEther)
                                    .div(constants.WeiPerEther.sub(mStableSwapFeeBN))
                                    .mul(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals)))
                                    .div(BigNumber.from(10).pow(BigNumber.from(allTokens[currencyCode].decimals)));
                                var outputAmountBeforeFeesBN = inputAmountBN
                                    .mul(BigNumber.from(10).pow(BigNumber.from(allTokens[currencyCode].decimals)))
                                    .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals)));
                                var outputAmountBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                    .mul(mStableSwapFeeBN)
                                    .div(constants.WeiPerEther));
                                var tries = 0;
                                while (outputAmountBN.lt(amount.sub(amountWithdrawnBN))) {
                                    if (tries >= 1000)
                                        throw new Error("Failed to get increment order input amount to achieve desired output amount.");
                                    inputAmountBN = inputAmountBN.add(constants.One); // Make sure we have enough input amount to receive amount.sub(amountWithdrawnBN)
                                    outputAmountBeforeFeesBN = inputAmountBN
                                        .mul(BigNumber.from(10).pow(BigNumber.from(allTokens[currencyCode].decimals)))
                                        .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode].decimals)));
                                    outputAmountBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                        .mul(mStableSwapFeeBN)
                                        .div(constants.WeiPerEther));
                                    tries++;
                                }
                                if (inputAmountBN.gt(inputCandidates[i].rawFundBalanceBN)) {
                                    inputAmountBN = inputCandidates[i].rawFundBalanceBN;
                                    outputAmountBeforeFeesBN = inputAmountBN
                                        .mul(BigNumber.from(10).pow(BigNumber.from(allTokens[currencyCode].decimals)))
                                        .div(BigNumber.from(10).pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals)));
                                    outputAmountBN = outputAmountBeforeFeesBN.sub(outputAmountBeforeFeesBN
                                        .mul(mStableSwapFeeBN)
                                        .div(constants.WeiPerEther));
                                }
                                // Check max swap/redeem validity
                                if (inputCandidates[i].currencyCode === "mUSD") {
                                    try {
                                        var redeemValidity = yield self.pools["mStable"].externalContracts.MassetValidationHelper.callStatis
                                            .getRedeemValidity("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", inputAmountBN, self.internalTokens[currencyCode].address);
                                    }
                                    catch (err) {
                                        console.error("Failed to check mUSD redeem validity:", err);
                                        continue;
                                    }
                                    if (!redeemValidity || !redeemValidity["0"])
                                        continue;
                                    if (!outputAmountBN.eq(BigNumber.from(redeemValidity["2"])))
                                        throw new Error("Predicted mStable output amount and output amount returned by getRedeemValidity not equal.");
                                }
                                else {
                                    try {
                                        var maxSwap = yield self.pools["mStable"].externalContracts.MassetValidationHelper.callStatic
                                            .getMaxSwap("0xe2f2a5c287993345a840db3b0845fbc70f5935a5", self.internalTokens[inputCandidates[i].currencyCode]
                                            .address, self.internalTokens[currencyCode].address);
                                    }
                                    catch (err) {
                                        console.error("Failed to check mUSD max swap:", err);
                                        continue;
                                    }
                                    if (!maxSwap ||
                                        !maxSwap["0"] ||
                                        BigNumber.from(maxSwap["2"]).lt(inputAmountBN))
                                        continue;
                                }
                                inputCurrencyCodes.push(inputCandidates[i].currencyCode);
                                inputAmountBNs.push(inputAmountBN);
                                allOrders.push([]);
                                allSignatures.push([]);
                                makerAssetFillAmountBNs.push(constants.Zero);
                                protocolFeeBNs.push(constants.Zero);
                                amountInputtedUsdBN = amountInputtedUsdBN.add(inputAmountBN
                                    .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                    .div(BigNumber.from(10)
                                    .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals))));
                                amountWithdrawnBN = amountWithdrawnBN.add(outputAmountBN);
                                inputCandidates[i].rawFundBalanceBN = inputCandidates[i].rawFundBalanceBN.sub(inputAmountBN);
                                if (inputCandidates[i].rawFundBalanceBN.isZero()) {
                                    inputCandidates.splice(i, 1);
                                    i--;
                                }
                                // Stop if we have filled the withdrawal
                                if (amountWithdrawnBN.gte(amount))
                                    break;
                            }
                        }
                        // Use 0x if necessary
                        if (amountWithdrawnBN.lt(amount)) {
                            // Get orders from 0x swap API for each input currency candidate
                            for (var i = 0; i < inputCandidates.length; i++) {
                                try {
                                    var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(self.internalTokens[inputCandidates[i].currencyCode].address, currencyCode === "ETH"
                                        ? "WETH"
                                        : allTokens[currencyCode].address, inputCandidates[i].rawFundBalanceBN, amount.sub(amountWithdrawnBN));
                                }
                                catch (err) {
                                    if (err === "Insufficient liquidity") {
                                        inputCandidates.splice(i, 1);
                                        i--;
                                        continue;
                                    }
                                    throw new Error("Failed to get swap orders from 0x API: " + err);
                                }
                                // Build array of orders and signatures
                                let signatures = [];
                                for (var j = 0; j < orders.length; j++) {
                                    signatures[j] = orders[j].signature;
                                    orders[j] = {
                                        makerAddress: orders[j].makerAddress,
                                        takerAddress: orders[j].takerAddress,
                                        feeRecipientAddress: orders[j].feeRecipientAddress,
                                        senderAddress: orders[j].senderAddress,
                                        makerAssetAmount: orders[j].makerAssetAmount,
                                        takerAssetAmount: orders[j].takerAssetAmount,
                                        makerFee: orders[j].makerFee,
                                        takerFee: orders[j].takerFee,
                                        expirationTimeSeconds: orders[j].expirationTimeSeconds,
                                        salt: orders[j].salt,
                                        makerAssetData: orders[j].makerAssetData,
                                        takerAssetData: orders[j].takerAssetData,
                                        makerFeeAssetData: orders[j].makerFeeAssetData,
                                        takerFeeAssetData: orders[j].takerFeeAssetData,
                                    };
                                }
                                inputCandidates[i].orders = orders;
                                inputCandidates[i].signatures = signatures;
                                inputCandidates[i].inputFillAmountBN = inputFilledAmountBN;
                                inputCandidates[i].protocolFeeBN = BigNumber.from(protocolFee)
                                    .mul(BigNumber.from(15))
                                    .div(BigNumber.from(10)); // Multiply protocol fee by 1.5 to account for user upping the gas price
                                inputCandidates[i].takerAssetFillAmountBN = takerAssetFilledAmountBN;
                                inputCandidates[i].makerAssetFillAmountBN = makerAssetFilledAmountBN;
                                inputCandidates[i].takerAssetFillAmountUsdBN = takerAssetFilledAmountBN
                                    .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                    .div(BigNumber.from(10)
                                    .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                    .decimals)));
                            }
                            // Sort candidates from highest to lowest output per USD burned
                            inputCandidates.sort((a, b) => b.makerAssetFillAmountBN
                                .mul(constants.WeiPerEther)
                                .div(b.takerAssetFillAmountUsdBN)
                                .gt(a.makerAssetFillAmountBN
                                .mul(constants.WeiPerEther)
                                .div(a.takerAssetFillAmountUsdBN))
                                ? 1
                                : -1);
                            // Loop through input currency candidates until we fill the withdrawal
                            for (var i = 0; i < inputCandidates.length; i++) {
                                // Is this order enough to cover the rest of the withdrawal?
                                if (inputCandidates[i].makerAssetFillAmountBN.gte(amount.sub(amountWithdrawnBN))) {
                                    // If order is enough to cover the rest of the withdrawal, cover it and stop looping through input candidates
                                    var thisOutputAmountBN = amount.sub(amountWithdrawnBN);
                                    var thisInputAmountBN = inputCandidates[i].inputFillAmountBN
                                        .mul(thisOutputAmountBN)
                                        .div(inputCandidates[i].makerAssetFillAmountBN);
                                    var tries = 0;
                                    while (inputCandidates[i].makerAssetFillAmountBN
                                        .mul(thisInputAmountBN)
                                        .div(inputCandidates[i].inputFillAmountBN)
                                        .lt(thisOutputAmountBN)) {
                                        if (tries >= 1000)
                                            throw new Error("Failed to get increment order input amount to achieve desired output amount.");
                                        thisInputAmountBN = thisInputAmountBN.add(constants.One); // Make sure we have enough input fill amount to achieve this maker asset fill amount
                                        tries++;
                                    }
                                    inputCurrencyCodes.push(inputCandidates[i].currencyCode);
                                    inputAmountBNs.push(thisInputAmountBN);
                                    allOrders.push(inputCandidates[i].orders);
                                    allSignatures.push(inputCandidates[i].signatures);
                                    makerAssetFillAmountBNs.push(thisOutputAmountBN);
                                    protocolFeeBNs.push(inputCandidates[i].protocolFeeBN);
                                    amountInputtedUsdBN = amountInputtedUsdBN.add(thisInputAmountBN
                                        .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                        .div(BigNumber.from(10)
                                        .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals))));
                                    amountWithdrawnBN = amountWithdrawnBN.add(thisOutputAmountBN);
                                    totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                                    break;
                                }
                                else {
                                    // Otherwise, add the whole order and keep looping through input candidates
                                    inputCurrencyCodes.push(inputCandidates[i].currencyCode);
                                    inputAmountBNs.push(inputCandidates[i].inputFillAmountBN);
                                    allOrders.push(inputCandidates[i].orders);
                                    allSignatures.push(inputCandidates[i].signatures);
                                    makerAssetFillAmountBNs.push(inputCandidates[i].makerAssetFillAmountBN);
                                    protocolFeeBNs.push(inputCandidates[i].protocolFeeBN);
                                    amountInputtedUsdBN = amountInputtedUsdBN.add(inputCandidates[i].inputFillAmountBN
                                        .mul(BigNumber.from(allBalances["4"][self.allocations.CURRENCIES.indexOf(inputCandidates[i].currencyCode)]))
                                        .div(BigNumber.from(10)
                                        .pow(BigNumber.from(self.internalTokens[inputCandidates[i].currencyCode]
                                        .decimals))));
                                    amountWithdrawnBN = amountWithdrawnBN.add(inputCandidates[i].makerAssetFillAmountBN);
                                    totalProtocolFeeBN = totalProtocolFeeBN.add(inputCandidates[i].protocolFeeBN);
                                }
                                // Stop if we have filled the withdrawal
                                if (amountWithdrawnBN.gte(amount))
                                    break;
                            }
                            // Make sure input amount is completely filled
                            if (amountWithdrawnBN.lt(amount))
                                throw new Error("Unable to find enough liquidity to exchange withdrawn tokens to " +
                                    currencyCode +
                                    ".");
                        }
                        // Check maxUsdAmount
                        if (typeof maxUsdAmount !== "undefined" &&
                            maxUsdAmount !== null &&
                            amountInputtedUsdBN.gt(maxUsdAmount))
                            return [amountInputtedUsdBN];
                        // Withdraw and exchange tokens via RariFundProxy
                        try {
                            let inputAmountStrings = [];
                            for (var i = 0; i < inputAmountBNs.length; i++)
                                inputAmountStrings[i] = inputAmountBNs[i].toString();
                            let makerAssetFillAmountStrings = [];
                            for (var i = 0; i < makerAssetFillAmountBNs.length; i++)
                                makerAssetFillAmountStrings[i] = makerAssetFillAmountBNs[i].toString();
                            let protocolFeeStrings = [];
                            for (var i = 0; i < protocolFeeBNs.length; i++)
                                protocolFeeStrings[i] = protocolFeeBNs[i].toString();
                            var receipt = yield self.contracts.RariFundProxy
                                .withdrawAndExchange(inputCurrencyCodes, inputAmountStrings, currencyCode === "ETH"
                                ? "0x0000000000000000000000000000000000000000"
                                : allTokens[currencyCode].address, allOrders, allSignatures, makerAssetFillAmountStrings, protocolFeeStrings, {
                                from: options.from,
                                value: totalProtocolFeeBN,
                                gasPrice: gasPrice,
                                nonce: yield self.provider.getTransactionCount(options.from),
                            });
                        }
                        catch (err) {
                            throw new Error("RariFundProxy.withdrawAndExchange failed: " +
                                (err.message ? err.message : err));
                        }
                        self.cache.clear("allBalances");
                        return [amountInputtedUsdBN, totalProtocolFeeBN, receipt];
                    }
                });
            },
        };
    }
}
StablePool.CONTRACT_ADDRESSES = contractAddressesStable;
StablePool.CONTRACT_ABIS = abisStable;
