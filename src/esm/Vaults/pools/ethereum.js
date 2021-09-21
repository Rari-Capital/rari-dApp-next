var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable */
import StablePool from "./stable.js";
import { get0xSwapOrders } from "../0x.js";
import { Contract } from "@ethersproject/contracts";
import { constants, BigNumber } from "ethers";
// ABIs
import RariFundController from './ethereum/abi/RariFundController.json';
import RariFundManager from './ethereum/abi/RariFundManager.json';
import RariFundToken from './ethereum/abi/RariFundToken.json';
import RariFundProxy from './ethereum/abi/RariFundProxy.json';
// Legacy ABIs
import RariFundControllerLegacy from './ethereum/abi/legacy/v1.0.0/RariFundController.json';
const contractAddresses = {
    RariFundController: "0x3f4931a8e9d4cdf8f56e7e8a8cfe3bede0e43657",
    RariFundManager: "0xD6e194aF3d9674b62D1b30Ec676030C23961275e",
    RariFundToken: "0xcda4770d65b42000000000000000000000000000",
    RariFundProxy: "0xa3cc9e4B9784c80a05B3Af215C32ff223C3ebE5c",
};
var abis = {
    "RariFundController": RariFundController,
    "RariFundManager": RariFundManager,
    "RariFundToken": RariFundToken,
    "RariFundProxy": RariFundProxy
};
const legacyContractAddresses = {
    "v1.0.0": {
        RariFundController: "0xD9F223A36C2e398B0886F945a7e556B41EF91A3C",
    },
    "v1.2.0": {
        RariFundController: "0xa422890cbBE5EAa8f1c88590fBab7F319D7e24B6",
    },
};
const legacyAbis = {
    "v1.0.0": {
        "RariFundController": RariFundControllerLegacy
    },
    "v1.2.0": {
        "RariFundController": RariFundController
    }
};
export default class EthereumPool extends StablePool {
    constructor(web3, subpools, getAllTokens) {
        super(web3, subpools, getAllTokens);
        this.API_BASE_URL = "https://api.rari.capital/pools/ethereum/";
        this.POOL_TOKEN_SYMBOL = "REPT";
        this.contracts = {};
        for (const contractName of Object.keys(contractAddresses))
            this.contracts[contractName] = new Contract(contractAddresses[contractName], abis[contractName], this.provider);
        // this.gsnContracts = { RariFundProxy: new web3Gsn.eth.Contract(abis.RariFundProxy, contractAddresses.RariFundProxy) };
        this.legacyContracts = {};
        for (const version of Object.keys(legacyContractAddresses)) {
            if (!this.legacyContracts[version])
                this.legacyContracts[version] = {};
            for (const contractName of Object.keys(legacyContractAddresses[version]))
                this.legacyContracts[version][contractName] = new Contract(legacyContractAddresses[version][contractName], legacyAbis[version][contractName], this.provider);
        }
        this.rept = this.rspt;
        delete this.rspt;
        delete this.allocations.CURRENCIES;
        this.allocations.POOLS = [
            "dYdX",
            "Compound",
            "KeeperDAO",
            "Aave",
            "Alpha",
            "Enzyme",
        ];
        delete this.allocations.POOLS_BY_CURRENCY;
        this.allocations.CURRENCIES_BY_POOL = {
            dYdX: ["ETH"],
            Compound: ["ETH"],
            KeeperDAO: ["ETH"],
            Aave: ["ETH"],
            Alpha: ["ETH"],
            Enzyme: ["ETH"],
        };
        delete this.allocations.getAllocationsByCurrency;
        delete this.allocations.getRawAllocations;
        delete this.allocations.getCurrencyUsdPrices;
        var self = this;
        this.allocations.getRawPoolAllocations = function () {
            return __awaiter(this, void 0, void 0, function* () {
                var allocationsByPool = {
                    _cash: constants.Zero,
                };
                for (const poolName of self.allocations.POOLS)
                    allocationsByPool[poolName] = constants.Zero;
                var allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundController.methods.getRawFundBalances().call);
                allocationsByPool._cash = BigNumber.from(allBalances["0"]);
                var pools = allBalances["1"];
                var poolBalances = allBalances["2"];
                for (var i = 0; i < pools.length; i++) {
                    var pool = pools[i];
                    var poolBalanceBN = BigNumber.from(poolBalances[i]);
                    allocationsByPool[self.allocations.POOLS[pool]] = poolBalanceBN;
                }
                return allocationsByPool;
            });
        };
        this.apy.getCurrentRawApy = function () {
            return __awaiter(this, void 0, void 0, function* () {
                let factors = [];
                let totalBalanceBN = constants.Zero;
                // Get pool APYs
                const poolApyBNs = [];
                for (var i = 0; i < self.allocations.POOLS.length; i++)
                    poolApyBNs[i] = yield self.pools[self.allocations.POOLS[i]].getCurrencyApys();
                // Get all raw balances
                let allBalances = yield self.cache.getOrUpdate("allBalances", self.contracts.RariFundController.callStatic.getRawFundBalances);
                // Get array of APY factors
                let contractBalanceBN = BigNumber.from(allBalances["0"]);
                factors.push([contractBalanceBN, constants.Zero]);
                totalBalanceBN = totalBalanceBN.add(contractBalanceBN);
                let pools = allBalances["1"];
                let poolBalances = allBalances["2"];
                for (let i = 0; i < pools.length; i++) {
                    const pool = pools[i];
                    const poolBalanceBN = BigNumber.from(poolBalances[i]);
                    factors.push([poolBalanceBN, poolApyBNs[pool]["ETH"]]);
                    totalBalanceBN = totalBalanceBN.add(poolBalanceBN);
                }
                // If balance = 0, choose the maximum
                if (totalBalanceBN.isZero()) {
                    let maxApyBN = constants.Zero;
                    for (let i = 0; i < factors.length; i++)
                        if (factors[i][1].gt(maxApyBN))
                            maxApyBN = factors[i][1];
                    return maxApyBN;
                }
                // If balance > 0, calculate the APY using the factors
                let apyBN = constants.Zero;
                for (let i = 0; i < factors.length; i++)
                    apyBN = apyBN.add(factors[i][0].mul(factors[i][1]).div(totalBalanceBN));
                return apyBN;
            });
        };
        delete this.deposits.getDirectDepositCurrencies;
        this.deposits.validateDeposit = function (currencyCode, amount, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                // Input validation
                if (!sender)
                    throw new Error("Sender parameter not set.");
                let allTokens = yield self.getAllTokens();
                if (currencyCode !== "ETH" && !allTokens[currencyCode])
                    throw new Error("Invalid currency code!");
                if (!amount || amount.lte(constants.Zero))
                    throw new Error("Deposit amount must be greater than 0!");
                let accountBalanceBN = yield (currencyCode == "ETH"
                    ? self.provider.getBalance(sender)
                    : allTokens[currencyCode].contract.balanceOf(sender));
                if (amount.gt(accountBalanceBN))
                    throw new Error("Not enough balance in your account to make a deposit of this amount.");
                // Check if currency is ETH
                if (currencyCode === "ETH") {
                    // Return amountUsdBN
                    return [amount];
                }
                else {
                    // Get orders from 0x swap API
                    try {
                        var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(allTokens[currencyCode].address, "WETH", amount);
                    }
                    catch (err) {
                        throw new Error("Failed to get swap orders from 0x API: " + err);
                    }
                    // Make sure input amount is completely filled
                    if (inputFilledAmountBN.lt(amount))
                        throw new Error("Unable to find enough liquidity to exchange " +
                            currencyCode +
                            " to ETH before depositing.");
                    // Make sure we have enough ETH for the protocol fee
                    let ethBalanceBN = yield web3.provider.getBalance(sender);
                    if (BigNumber.from(protocolFee).gt(ethBalanceBN))
                        throw new Error("ETH balance too low to cover 0x exchange protocol fee.");
                    // Return makerAssetFilledAmountBN and protocolFee
                    return [makerAssetFilledAmountBN, BigNumber.from(protocolFee)];
                }
            });
        };
        this.deposits.deposit = function (currencyCode, amount, minEthAmount, options) {
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
                    : allTokens[currencyCode].contract.balanceOf(options.from)));
                if (amount.gt(accountBalanceBN))
                    throw new Error("Not enough balance in your account to make a deposit of this amount.");
                // Check if currency is ETH
                if (currencyCode === "ETH") {
                    // Input validation
                    if (options.value && options.value.toString() !== amount.toString())
                        throw new Error("Value set in options paramater but not equal to amount parameter.");
                    // Check amountUsdBN against minEthAmount
                    if (typeof minEthAmount !== "undefined" &&
                        minEthAmount !== null &&
                        amount.lt(minEthAmount))
                        return [amount];
                    // Deposit tokens to RariFundManager
                    options.value = amount;
                    var receipt = yield self.contracts.RariFundManager.deposit();
                    return [amount, null, null, receipt];
                }
                else {
                    // Get orders from 0x swap API
                    try {
                        var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders(allTokens[currencyCode].address, "WETH", amount);
                    }
                    catch (err) {
                        throw new Error("Failed to get swap orders from 0x API: " + err);
                    }
                    // Make sure input amount is completely filled
                    if (inputFilledAmountBN.lt(amount))
                        throw new Error("Unable to find enough liquidity to exchange " +
                            currencyCode +
                            " before depositing.");
                    // Make sure we have enough ETH for the protocol fee
                    var ethBalanceBN = BigNumber.from(yield web3.eth.getBalance(options.from));
                    if (BigNumber.from(protocolFee).gt(ethBalanceBN))
                        throw new Error("ETH balance too low to cover 0x exchange protocol fee.");
                    // Check makerAssetFilledAmountUsdBN against minUsdAmount
                    if (typeof minEthAmount !== "undefined" &&
                        minEthAmount !== null &&
                        makerAssetFilledAmountBN.lt(minEthAmount))
                        return [makerAssetFilledAmountBN];
                    // Approve tokens to RariFundProxy
                    try {
                        var allowanceBN = BigNumber.from(yield allTokens[currencyCode].contract.methods
                            .allowance(options.from, self.contracts.RariFundProxy.options.address)
                            .call());
                        if (allowanceBN.lt(amount))
                            var approvalReceipt = yield allTokens[currencyCode].contract.methods
                                .approve(self.contracts.RariFundProxy.options.address, amount)
                                .send(options);
                    }
                    catch (err) {
                        throw new Error("Failed to approve tokens to RariFundProxy: " +
                            (err.message ? err.message : err));
                    }
                    // Build array of orders and signatures
                    var signatures = [];
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
                            .exchangeAndDeposit(allTokens[currencyCode].address, amount, orders, signatures, takerAssetFilledAmountBN)
                            .send(Object.assign({ value: protocolFee, gasPrice: gasPrice }, options));
                    }
                    catch (err) {
                        throw new Error("RariFundProxy.exchangeAndDeposit failed: " +
                            (err.message ? err.message : err));
                    }
                    self.cache.clear("allBalances");
                    return [
                        makerAssetFilledAmountBN,
                        BigNumber.from(protocolFee),
                        approvalReceipt,
                        receipt,
                    ];
                }
            });
        };
        this.withdrawals.getMaxWithdrawalAmount = function (currencyCode, senderEthBalance, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                var allTokens = yield self.getAllTokens();
                if (currencyCode !== "ETH" && !allTokens[currencyCode])
                    throw new Error("Invalid currency code!");
                if (!senderEthBalance || senderEthBalance.lte(constants.Zero))
                    return [constants.Zero];
                // Get user fund balance
                if (senderEthBalance === undefined)
                    senderEthBalance = BigNumber.from(yield self.contracts.RariFundManager.balanceOf(sender));
                // If currency is ETH, return account balance
                if (currencyCode === "ETH")
                    return [senderEthBalance];
                // Otherwise, get orders from 0x swap API
                try {
                    var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders("WETH", allTokens[currencyCode].address, senderEthBalance);
                }
                catch (err) {
                    throw new Error("Failed to get swap orders from 0x API: " + err);
                }
                // If there are enough 0x orders to fulfill the rest of the withdrawal amount, withdraw and exchange
                if (inputFilledAmountBN.lt(senderEthBalance))
                    throw new Error("Unable to find enough liquidity to exchange withdrawn tokens to " +
                        currencyCode +
                        ".");
                // Return amountWithdrawnBN and totalProtocolFeeBN
                var amountWithdrawnBN = makerAssetFilledAmountBN
                    .mul(senderEthBalance)
                    .div(inputFilledAmountBN);
                return [amountWithdrawnBN, BigNumber.from(protocolFee)];
            });
        };
        this.withdrawals.validateWithdrawal = function (currencyCode, amount, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                var allTokens = yield self.getAllTokens();
                if (currencyCode !== "ETH" && !allTokens[currencyCode])
                    throw new Error("Invalid currency code!");
                if (!amount || amount.lte(constants.Zero))
                    throw new Error("Withdrawal amount must be greater than 0!");
                // Get user fund balance
                var accountBalance = BigNumber.from(yield self.contracts.RariFundManager.methods.balanceOf(sender).call());
                // Check if withdrawal currency is ETH
                if (currencyCode === "ETH") {
                    // Check account balance
                    if (amount.gt(accountBalance))
                        throw new Error("Requested withdrawal amount is greater than the sender's Rari Ethereum Pool balance. Please click the max button and try again (or reload and try again later if the issue persists).");
                    // Return amount
                    return [amount];
                }
                else {
                    // Get orders from 0x swap API
                    try {
                        var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders("WETH", allTokens[currencyCode].address, amount);
                    }
                    catch (err) {
                        throw new Error("Failed to get swap orders from 0x API: " + err);
                    }
                    // Check account balance
                    if (takerAssetFilledAmountBN.gt(accountBalance))
                        throw new Error("Requested withdrawal amount is greater than the sender's Rari Ethereum Pool balance. Please click the max button and try again (or reload and try again later if the issue persists).");
                    // Make sure input amount is completely filled
                    if (makerAssetFilledAmountBN.lt(amount))
                        throw new Error("Unable to find enough liquidity to exchange withdrawn ETH to " +
                            currencyCode +
                            ".");
                    // Return inputFilledAmountBN
                    return [inputFilledAmountBN, BigNumber.from(protocolFee)];
                }
            });
        };
        this.withdrawals.withdraw = function (currencyCode, amount, maxEthAmount, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!options || !options.from)
                    throw new Error("Options parameter not set or from address not set.");
                var allTokens = yield self.getAllTokens();
                if (currencyCode !== "ETH" && !allTokens[currencyCode])
                    throw new Error("Invalid currency code!");
                if (!amount || amount.lte(constants.Zero))
                    throw new Error("Withdrawal amount must be greater than 0!");
                // Check if withdrawal currency is ETH
                if (currencyCode === "ETH") {
                    // Check maxEthAmount
                    if (typeof maxEthAmount !== "undefined" &&
                        maxEthAmount !== null &&
                        amount.gt(maxEthAmount))
                        return [amount];
                    // If we can withdraw everything directly, do so
                    try {
                        var receipt = yield self.contracts.RariFundManager.methods
                            .withdraw(amount)
                            .send(options);
                    }
                    catch (err) {
                        throw new Error("RariFundManager.withdraw failed: " +
                            (err.message ? err.message : err));
                    }
                    return [amount, null, receipt];
                }
                else {
                    // Get orders from 0x swap API
                    try {
                        var [orders, inputFilledAmountBN, protocolFee, takerAssetFilledAmountBN, makerAssetFilledAmountBN, gasPrice,] = yield get0xSwapOrders("WETH", allTokens[currencyCode].address, amount);
                    }
                    catch (err) {
                        throw new Error("Failed to get swap orders from 0x API: " + err);
                    }
                    // Build array of orders and signatures
                    var signatures = [];
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
                    // Make sure input amount is completely filled
                    if (makerAssetFilledAmountBN.lt(amount))
                        throw new Error("Unable to find enough liquidity to exchange withdrawn tokens to " +
                            currencyCode +
                            ".");
                    // Check maxEthAmount
                    if (typeof maxEthAmount !== "undefined" &&
                        maxEthAmount !== null &&
                        inputFilledAmountBN.gt(maxEthAmount))
                        return [inputFilledAmountBN];
                    // Withdraw and exchange tokens via RariFundProxy
                    try {
                        var receipt = yield self.contracts.RariFundProxy.methods
                            .withdrawAndExchange(inputFilledAmountBN, allTokens[currencyCode].address, orders, signatures, makerAssetFilledAmountBN)
                            .send({
                            from: options.from,
                            value: protocolFee,
                            gasPrice: gasPrice,
                            nonce: yield web3.eth.getTransactionCount(options.from),
                        });
                    }
                    catch (err) {
                        throw new Error("RariFundProxy.withdrawAndExchange failed: " +
                            (err.message ? err.message : err));
                    }
                    return [inputFilledAmountBN, BigNumber.from(protocolFee), receipt];
                }
            });
        };
        delete this.history.getRsptExchangeRateHistory;
        this.history.getReptExchangeRateHistory = this.history.getPoolTokenExchangeRateHistory;
        this.history.getPoolAllocationHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                var events = [];
                if (toBlock >= 11085000 && fromBlock <= 11819251)
                    events = yield self.legacyContracts["v1.0.0"].RariFundController.getPastEvents("PoolAllocation", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock: Math.min(toBlock, 11819251),
                        filter,
                    });
                if (toBlock >= 11819251 && fromBlock <= 12904645)
                    events = events.concat(yield self.legacyContracts["v1.2.0"].RariFundController.getPastEvents("PoolAllocation", {
                        fromBlock: Math.max(fromBlock, 11819251),
                        toBlock: Math.min(toBlock, 12904645),
                        filter,
                    }));
                if (toBlock >= 12904645)
                    events = events.concat(yield self.contracts.RariFundController.getPastEvents("PoolAllocation", {
                        fromBlock: Math.max(fromBlock, 12904645),
                        toBlock,
                        filter,
                    }));
                return events;
            });
        };
        this.history.getCurrencyExchangeHistory = function (fromBlock, toBlock, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                var events = [];
                if (toBlock >= 11085000 && fromBlock <= 11819251)
                    events = yield self.legacyContracts["v1.0.0"].RariFundController.getPastEvents("CompToEthTrade", {
                        fromBlock: Math.max(fromBlock, 11085000),
                        toBlock: Math.min(toBlock, 11819251),
                        filter,
                    });
                if (toBlock >= 11819251 && fromBlock <= 12904645)
                    events = events.concat(yield self.legacyContracts["v1.2.0"].RariFundController.getPastEvents("CompToEthTrade", {
                        fromBlock: Math.max(fromBlock, 11819251),
                        toBlock: Math.min(toBlock, 12904645),
                        filter,
                    }));
                if (toBlock >= 12904645)
                    events = events.concat(yield self.contracts.RariFundController.getPastEvents("CurrencyTrade", {
                        fromBlock: Math.max(fromBlock, 12904645),
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
        this.history.getReptTransferHistory = this.history.getPoolTokenTransferHistory;
    }
}
EthereumPool.CONTRACT_ADDRESSES = contractAddresses;
EthereumPool.CONTRACT_ABIS = abis;
EthereumPool.LEGACY_CONTRACT_ADDRESSES = legacyContractAddresses;
EthereumPool.LEGACY_CONTRACT_ABIS = legacyAbis;
