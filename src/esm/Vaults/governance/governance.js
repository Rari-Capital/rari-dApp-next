var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
// ABIs
import ERC20ABI from '../abi/ERC20.json';
import RariGovernanceToken from './abi/RariGovernanceToken.json';
import RariGovernanceTokenDistributor from './abi/RariGovernanceTokenDistributor.json';
import RariGovernanceTokenVesting from './abi/RariGovernanceTokenVesting.json';
import RariGovernanceTokenUniswapDistributor from './abi/RariGovernanceTokenUniswapDistributor.json';
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber, constants } from "ethers";
// Cache
import Cache from "../cache";
export const contractAddresses = {
    RariGovernanceToken: "0xD291E7a03283640FDc51b121aC401383A46cC623",
    RariGovernanceTokenDistributor: "0x9C0CaEb986c003417D21A7Daaf30221d61FC1043",
    RariGovernanceTokenUniswapDistributor: "0x1FA69a416bCF8572577d3949b742fBB0a9CD98c7",
    RariGovernanceTokenVesting: "0xA54B473028f4ba881F1eD6B670af4103e8F9B98a",
};
export const abis = {
    RariGovernanceToken,
    RariGovernanceTokenDistributor,
    RariGovernanceTokenUniswapDistributor,
    RariGovernanceTokenVesting
};
export const LP_TOKEN_CONTRACT = "0x18a797c7c70c1bf22fdee1c09062aba709cacf04";
export default class Governance {
    constructor(provider) {
        this.API_BASE_URL = "https://api.rari.capital/governance/";
        this.provider = provider;
        this.cache = new Cache({ rgtUsdPrice: 900, lpTokenData: 900 });
        this.contracts = {};
        for (const contractName of Object.keys(contractAddresses)) {
            this.contracts[contractName] = new Contract(contractAddresses[contractName], abis[contractName], provider);
        }
        const self = this;
        const distributionStartBlock = 11094200;
        const distributionPeriod = 390000;
        const distributionEndBlock = distributionStartBlock - distributionPeriod;
        const finalRGTDistribution = BigNumber.from("8750000000000000000000000");
        this.rgt = {
            getExchangeRate: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.cache.getOrUpdate("rgtUsdPrice", function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            /* try {
                              return Web3.utils.toBN(Math.trunc((await axios.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=rgt")).data.rgt.usd * 1e18));
                            } catch (error) {
                              throw new Error("Error retrieving data from Coingecko API: " + error);
                            } */
                            try {
                                var data = (yield axios.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
                                    query: `{
                        ethRgtPair: pair(id: "0xdc2b82bc1106c9c5286e59344896fb0ceb932f53") {
                          token0Price
                        }
                        ethUsdtPair: pair(id: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852") {
                          token1Price
                        }
                      }
                      `,
                                })).data;
                                return utils.parseUnits((data.data.ethRgtPair.token0Price * data.data.ethUsdtPair.token1Price).toString());
                            }
                            catch (error) {
                                throw new Error("Error retrieving data from The Graph API: " + error);
                            }
                        });
                    });
                });
            },
            distributions: {
                getDistributedAtBlock: function (blockNumber) {
                    const startBlock = distributionStartBlock;
                    if (blockNumber <= startBlock)
                        return constants.Zero;
                    if (blockNumber >= startBlock + distributionPeriod)
                        return finalRGTDistribution;
                    const blocks = blockNumber - startBlock;
                    const blocksBN = BigNumber.from(blocks);
                    if (blocks < 6500 * 15)
                        return constants.WeiPerEther
                            .mul(blocksBN.pow(BigNumber.from(2)))
                            .div(BigNumber.from(2730))
                            .add(BigNumber.from("1450000000000000000000").mul(blocksBN).div(BigNumber.from(273)));
                    if (blocks < 6500 * 30)
                        return BigNumber.from("14600000000000000000000")
                            .mul(blocksBN)
                            .div(BigNumber.from(273))
                            .sub(BigNumber.from("2000000000000000000")
                            .mul(blocksBN.pow(BigNumber.from(2)))
                            .div(BigNumber.from(17745)))
                            .sub(BigNumber.from("1000000000000000000000000").div(BigNumber.from(7)));
                    if (blocks < 6500 * 45)
                        return constants.WeiPerEther
                            .mul(blocksBN.pow(BigNumber.from(2)))
                            .div(BigNumber.from(35490))
                            .add(BigNumber.from("39250000000000000000000000").div(BigNumber.from(7)))
                            .sub(BigNumber.from("950000000000000000000").mul(blocksBN).div(BigNumber.from(273)));
                    return constants.WeiPerEther
                        .mul(blocksBN.pow(BigNumber.from(2)))
                        .div(BigNumber.from(35490))
                        .add(BigNumber.from("34750000000000000000000000").div(BigNumber.from(7)))
                        .sub(BigNumber.from("50000000000000000000").mul(blocksBN).div(BigNumber.from(39)));
                },
                getCurrentApy: function (blockNumber, tvl) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (blockNumber === undefined && tvl === undefined) {
                            try {
                                return BigNumber.from((yield axios.get(self.API_BASE_URL + "rgt/apy")).data);
                            }
                            catch (error) {
                                throw new Error("Error retrieving data from Rari API: " + error);
                            }
                        }
                        else {
                            // Get APY from difference in distribution over last 270 blocks (estimating a 1 hour time difference)
                            var rgtDistributedPastHour = self.rgt.distributions
                                .getDistributedAtBlock(blockNumber)
                                .sub(self.rgt.distributions.getDistributedAtBlock(blockNumber - 270));
                            var rgtDistributedPastHourPerUsd = rgtDistributedPastHour
                                .mul(constants.WeiPerEther)
                                .div(tvl);
                            var rgtDistributedPastHourPerUsdInUsd = rgtDistributedPastHourPerUsd
                                .mul(yield self.rgt.getExchangeRate())
                                .div(constants.WeiPerEther);
                            return BigNumber.from(Math.trunc((Math.pow((1 + rgtDistributedPastHourPerUsdInUsd / 1e18), (24 * 365)) -
                                1) *
                                1e18));
                        }
                    });
                },
                getCurrentApr: function (blockNumber, tvl) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Get APR from difference in distribution over last 270 blocks (estimating a 1 hour time difference)
                        const rgtDistributedPastHour = self.rgt.distributions
                            .getDistributedAtBlock(blockNumber)
                            .sub(self.rgt.distributions.getDistributedAtBlock(blockNumber - 270));
                        const rgtDistributedPastHourPerUsd = rgtDistributedPastHour
                            .mul(constants.WeiPerEther)
                            .div(tvl);
                        const rgtDistributedPastHourPerUsdInUsd = rgtDistributedPastHourPerUsd
                            .mul(yield self.rgt.getExchangeRate())
                            .div(constants.WeiPerEther);
                        return rgtDistributedPastHourPerUsdInUsd.mul(BigNumber.from(24 * 365));
                    });
                },
                getUnclaimed: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenDistributor.getUnclaimedRgt(account);
                    });
                },
                claim: function (amount, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenDistributor.claimRgt(amount);
                    });
                },
                claimAll: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenDistributor.claimAllRgt();
                    });
                },
                getClaimFee: function (blockNumber) {
                    var initialClaimFee = utils.parseUnits("0.33");
                    if (blockNumber <= self.rgt.distributions.DISTRIBUTION_START_BLOCK)
                        return initialClaimFee;
                    var distributionEndBlock = self.rgt.distributions.DISTRIBUTION_START_BLOCK +
                        self.rgt.distributions.DISTRIBUTION_PERIOD;
                    if (blockNumber >= distributionEndBlock)
                        return constants.Zero;
                    return initialClaimFee
                        .mul(BigNumber.from(distributionEndBlock - blockNumber))
                        .div(BigNumber.from(distributionPeriod));
                },
                refreshDistributionSpeeds: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenDistributor.refreshDistributionSpeeds();
                    });
                },
                refreshDistributionSpeedsByPool: function (pool, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenDistributor.refreshDistributionSpeeds(pool);
                    });
                },
            },
            sushiSwapDistributions: {
                DISTRIBUTION_START_BLOCK: 11909000,
                DISTRIBUTION_PERIOD: 6500 * 365 * 3,
                //@ts-ignore
                DISTRIBUTION_PERIOD_END: this.DISTRIBUTION_PERIOD + this.DISTRIBUTION_START_BLOCK,
                FINAL_RGT_DISTRIBUTION: utils.parseUnits("568717819057309757517546")
                    .mul(BigNumber.from(80))
                    .div(BigNumber.from(100)),
                LP_TOKEN_CONTRACT,
                getDistributedAtBlock: function (blockNumber) {
                    const startBlock = self.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK;
                    if (blockNumber <= startBlock)
                        return constants.Zero;
                    if (blockNumber >= startBlock + self.rgt.sushiSwapDistributions.DISTRIBUTION_PERIOD)
                        return self.rgt.sushiSwapDistributions.FINAL_RGT_DISTRIBUTION;
                    const blocks = blockNumber - startBlock;
                    return self.rgt.sushiSwapDistributions.FINAL_RGT_DISTRIBUTION.mul(BigNumber.from(blocks)).div(BigNumber.from(self.rgt.sushiSwapDistributions.DISTRIBUTION_PERIOD));
                },
                getCurrentApy: function (blockNumber, totalStakedUsd) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (blockNumber === undefined && totalStakedUsd === undefined) {
                            try {
                                return BigNumber.from((yield axios.get(self.API_BASE_URL + "rgt/sushiswap/apy")).data);
                            }
                            catch (error) {
                                throw new Error("Error retrieving data from Rari API: " + error);
                            }
                        }
                        else {
                            // Predicted APY if we have't started the distribution period or we don't have enough data
                            if (blockNumber - 270 <
                                self.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK)
                                blockNumber =
                                    self.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK + 270;
                            // Get APY from difference in distribution over last 270 blocks (estimating a 1 hour time difference)
                            const rgtDistributedPastHour = self.rgt.sushiSwapDistributions
                                .getDistributedAtBlock(blockNumber)
                                .sub(self.rgt.sushiSwapDistributions.getDistributedAtBlock(blockNumber - 270));
                            const rgtDistributedPastHourPerUsd = rgtDistributedPastHour
                                .mul(constants.WeiPerEther)
                                .div(totalStakedUsd);
                            const rgtDistributedPastHourPerUsdInUsd = rgtDistributedPastHourPerUsd
                                .mul(yield self.rgt.getExchangeRate())
                                .div(constants.WeiPerEther);
                            return BigNumber.from(Math.trunc((Math.pow((1 + rgtDistributedPastHourPerUsdInUsd / 1e18), (24 * 365)) -
                                1) *
                                1e18));
                        }
                    });
                },
                getCurrentApr: function (blockNumber, totalStakedUsd) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Predicted APY if we have't started the distribution period or we don't have enough datac
                        if (blockNumber - 270 <
                            self.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK)
                            blockNumber =
                                self.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK + 270;
                        // Get APR from difference in distribution over last 270 blocks (estimating a 1 hour time difference)
                        const rgtDistributedPastHour = self.rgt.sushiSwapDistributions
                            .getDistributedAtBlock(blockNumber)
                            .sub(self.rgt.sushiSwapDistributions.getDistributedAtBlock(blockNumber - 270));
                        const rgtDistributedPastHourPerUsd = rgtDistributedPastHour
                            .mul(constants.WeiPerEther)
                            .div(totalStakedUsd);
                        const rgtDistributedPastHourPerUsdInUsd = rgtDistributedPastHourPerUsd
                            .mul(yield self.rgt.getExchangeRate())
                            .div(constants.WeiPerEther);
                        return rgtDistributedPastHourPerUsdInUsd.mul(BigNumber.from(24 * 365));
                    });
                },
                totalStaked: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenUniswapDistributor.totalStaked();
                    });
                },
                getLpTokenData: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        // TODO: RGT price getter function from Coingecko
                        return yield self.cache.getOrUpdate("lpTokenData", function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                try {
                                    return (yield axios.post("https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork", {
                                        query: `{
                                ethRgtPair: pair(id: "0x18a797c7c70c1bf22fdee1c09062aba709cacf04") {
                                reserveUSD
                                reserve0
                                                    reserve1
                                totalSupply
                                }
                            }`,
                                    })).data;
                                }
                                catch (error) {
                                    throw new Error("Error retrieving data from The Graph API: " + error);
                                }
                            });
                        });
                    });
                },
                getLpTokenUsdPrice: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        // TODO: RGT price getter function from Coingecko
                        const data = yield self.rgt.sushiSwapDistributions.getLpTokenData();
                        const div = (data.data.ethRgtPair.reserveUSD / data.data.ethRgtPair.totalSupply).toString();
                        return utils.parseUnits(div);
                    });
                },
                getReservesPerLpToken: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        // TODO: RGT price getter function from Coingecko
                        const data = yield self.rgt.sushiSwapDistributions.getLpTokenData();
                        const rgtReserves = (data.data.ethRgtPair.reserve1 / data.data.ethRgtPair.totalSupply).toString();
                        const ethReserves = (data.data.ethRgtPair.reserve0 / data.data.ethRgtPair.totalSupply).toString();
                        return {
                            rgt: utils.parseUnits(rgtReserves),
                            eth: utils.formatUnits(ethReserves),
                        };
                    });
                },
                totalStakedUsd: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return (yield self.rgt.sushiSwapDistributions.totalStaked())
                            .mul(yield self.rgt.sushiSwapDistributions.getLpTokenUsdPrice())
                            .div(constants.WeiPerEther);
                    });
                },
                stakingBalanceOf: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return BigNumber.from(yield self.contracts.RariGovernanceTokenUniswapDistributor.stakingBalances(account));
                    });
                },
                usdStakingBalanceOf: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return (yield self.rgt.sushiSwapDistributions.stakingBalanceOf(account))
                            .mul(yield self.rgt.sushiSwapDistributions.getLpTokenUsdPrice())
                            .div(constants.WeiPerEther);
                    });
                },
                stakedReservesOf: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const stakingBalance = yield self.rgt.sushiSwapDistributions.stakingBalanceOf(account);
                        const reservesPerLpToken = yield self.rgt.sushiSwapDistributions.getReservesPerLpToken();
                        return {
                            rgt: reservesPerLpToken.rgt
                                .mul(stakingBalance)
                                .div(constants.WeiPerEther),
                            eth: reservesPerLpToken.eth
                                .mul(stakingBalance)
                                .div(constants.WeiPerEther),
                        };
                    });
                },
                deposit: function (amount, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const slp = new Contract(self.rgt.sushiSwapDistributions.LP_TOKEN_CONTRACT, ERC20ABI, self.provider);
                        const allowance = yield slp.methods
                            .allowance(options.from, self.contracts.RariGovernanceTokenUniswapDistributor.options
                            .address);
                        amount = BigNumber.from(amount);
                        if (amount.gt(allowance))
                            yield slp.methods.approve(self.contracts.RariGovernanceTokenUniswapDistributor.options.address, amount);
                        yield self.contracts.RariGovernanceTokenUniswapDistributor.methods.deposit(amount);
                    });
                },
                withdraw: function (amount, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield self.contracts.RariGovernanceTokenUniswapDistributor.methods
                            .withdraw(amount)
                            .send(options);
                    });
                },
                getUnclaimed: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return BigNumber.from(yield self.contracts.RariGovernanceTokenUniswapDistributor.getUnclaimedRgt(account));
                    });
                },
                claim: function (amount, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenUniswapDistributor.claimRgt(amount);
                    });
                },
                claimAll: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenUniswapDistributor.claimAllRgt();
                    });
                },
            },
            vesting: {
                PRIVATE_VESTING_START_TIMESTAMP: 1603202400,
                PRIVATE_VESTING_PERIOD: 2 * 365 * 86400,
                getUnclaimed: function (account) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenVesting.getUnclaimedPrivateRgt(account);
                    });
                },
                claim: function (amount, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenVesting.claimPrivateRgt(amount);
                    });
                },
                claimAll: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield self.contracts.RariGovernanceTokenVesting.claimAllPrivateRgt();
                    });
                },
                getClaimFee: function (timestamp) {
                    var initialClaimFee = constants.WeiPerEther;
                    if (timestamp <= self.rgt.vesting.PRIVATE_VESTING_START_TIMESTAMP)
                        return initialClaimFee;
                    var privateVestingEndTimestamp = self.rgt.vesting.PRIVATE_VESTING_START_TIMESTAMP +
                        self.rgt.vesting.PRIVATE_VESTING_PERIOD;
                    if (timestamp >= privateVestingEndTimestamp)
                        return constants.Zero;
                    return initialClaimFee
                        .mul(BigNumber.from(privateVestingEndTimestamp - timestamp))
                        .div(BigNumber.from(self.rgt.vesting.PRIVATE_VESTING_PERIOD));
                },
            },
            balanceOf: function (account) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariGovernanceToken.balanceOf(account);
                });
            },
            transfer: function (recipient, amount, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield self.contracts.RariGovernanceToken.transfer(recipient, amount);
                });
            },
        };
    }
}
Governance.CONTRACT_ADDRESSES = contractAddresses;
Governance.CONTRACT_ABIS = abis;
