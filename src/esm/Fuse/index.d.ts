import { Contract, constants } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { FuseAddresses } from "./addresses";
import { ChainID } from "../utils/networks";
declare type MinifiedContracts = {
    [key: string]: {
        abi?: any;
        bin?: any;
    };
};
export default class Fuse {
    provider: JsonRpcProvider;
    constants: typeof constants;
    contracts: {
        [key: string]: Contract;
    };
    compoundContracts: MinifiedContracts;
    oracleContracts: MinifiedContracts;
    identifyPriceOracle: any;
    deployPool: any;
    deployPriceOracle: any;
    deployComptroller: any;
    deployAsset: any;
    deployInterestRateModel: any;
    deployCToken: any;
    deployCEther: any;
    deployCErc20: any;
    identifyInterestRateModel: any;
    getInterestRateModel: any;
    checkForCErc20PriceFeed: any;
    getPriceOracle: any;
    deployRewardsDistributor: any;
    checkCardinality: any;
    primeUniswapV3Oracle: any;
    identifyInterestRateModelName: any;
    addresses: FuseAddresses;
    static COMPTROLLER_ERROR_CODES: string[];
    static CTOKEN_ERROR_CODES: string[];
    constructor(web3Provider: JsonRpcProvider | Web3Provider, chainId: ChainID);
}
export {};
