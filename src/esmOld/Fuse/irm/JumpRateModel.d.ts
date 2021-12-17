import { BigNumberish, BigNumber } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
export interface JumpRateModelInterface {
    JumpRateModel: any;
}
export default class JumpRateModel {
    static RUNTIME_BYTECODE_HASHES: string[];
    initialized: boolean | undefined;
    baseRatePerBlock: BigNumber | undefined;
    multiplierPerBlock: BigNumber | undefined;
    jumpMultiplierPerBlock: BigNumber | undefined;
    kink: BigNumber | undefined;
    reserveFactorMantissa: BigNumber | undefined;
    RUNTIME_BYTECODE_HASHES: any;
    init(interestRateModelAddress: string, assetAddress: string, provider: any): Promise<void>;
    _init(interestRateModelAddress: string, reserveFactorMantissa: BigNumberish, adminFeeMantissa: BigNumberish, fuseFeeMantissa: BigNumberish, provider: Web3Provider): Promise<void>;
    __init(baseRatePerBlock: BigNumberish, multiplierPerBlock: BigNumberish, jumpMultiplierPerBlock: BigNumberish, kink: BigNumberish, reserveFactorMantissa: BigNumberish, adminFeeMantissa: BigNumberish, fuseFeeMantissa: BigNumberish): Promise<void>;
    getBorrowRate(utilizationRate: BigNumber): BigNumber;
    getSupplyRate(utilizationRate: BigNumber): BigNumber;
}
