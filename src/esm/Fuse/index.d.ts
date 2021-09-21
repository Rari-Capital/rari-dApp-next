import { Contract, constants } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
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
    openOracleContracts: MinifiedContracts;
    oracleContracts: MinifiedContracts;
    getEthUsdPriceBN: any;
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
    static FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: string;
    static CERC20_DELEGATE_CONTRACT_ADDRESS: string;
    static CETHER_DELEGATE_CONTRACT_ADDRESS: string;
    static PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES: {
        WhitePaperInterestRateModel_Compound_ETH: string;
        WhitePaperInterestRateModel_Compound_WBTC: string;
        JumpRateModel_Compound_Stables: string;
        JumpRateModel_Compound_UNI: string;
        JumpRateModel_Cream_Stables_Majors: string;
        JumpRateModel_Cream_Gov_Seeds: string;
        JumpRateModel_Cream_SLP: string;
        JumpRateModel_ALCX: string;
        JumpRateModel_Fei_FEI: string;
        JumpRateModel_Fei_TRIBE: string;
        JumpRateModel_Fei_ETH: string;
        JumpRateModel_Fei_DAI: string;
        JumpRateModel_Olympus_Majors: string;
    };
    static PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES: {
        PreferredPriceOracle: string;
        ChainlinkPriceOracle: string;
        ChainlinkPriceOracleV2: string;
        UniswapView: string;
        Keep3rPriceOracle_Uniswap: string;
        Keep3rPriceOracle_SushiSwap: string;
        Keep3rV2PriceOracle_Uniswap: string;
        UniswapTwapPriceOracle_Uniswap: string;
        UniswapTwapPriceOracle_SushiSwap: string;
        UniswapLpTokenPriceOracle: string;
        RecursivePriceOracle: string;
        YVaultV1PriceOracle: string;
        YVaultV2PriceOracle: string;
        AlphaHomoraV1PriceOracle: string;
        AlphaHomoraV2PriceOracle: string;
        SynthetixPriceOracle: string;
        BalancerLpTokenPriceOracle: string;
        MasterPriceOracle: string;
        CurveLpTokenPriceOracle: string;
        CurveLiquidityGaugeV2PriceOracle: string;
    };
    static PRICE_ORACLE_RUNTIME_BYTECODE_HASHES: {
        [key: string]: string;
    };
    static UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS: string;
    static UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS: string;
    static COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS: string;
    static DAI_POT: string;
    static DAI_JUG: string;
    static UNISWAP_V2_FACTORY_ADDRESS: string;
    static UNISWAP_V2_PAIR_INIT_CODE_HASH: string;
    static WETH_ADDRESS: string;
    static ORACLES: string[];
    static FusePoolDirectoryAddress: string;
    static FuseSafeLiquidatorAddress: string;
    static FuseFeeDistributorAddress: string;
    static FusePoolLensAddress: string;
    constructor(web3Provider: JsonRpcProvider | Web3Provider);
}
export {};
