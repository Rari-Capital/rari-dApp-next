import { BigNumber, BigNumberish } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
export default class JumpRateModelV2 {
  static RUNTIME_BYTECODE_HASH: string;
  initialized: boolean | undefined;
  baseRatePerBlock: BigNumber | undefined;
  multiplierPerBlock: BigNumber | undefined;
  jumpMultiplierPerBlock: BigNumber | undefined;
  kink: BigNumber | undefined;
  reserveFactorMantissa: BigNumber | undefined;
  init(
    interestRateModelAddress: string,
    assetAddress: string,
    provider: any
  ): Promise<void>;
  _init(
    provider: Web3Provider,
    interestRateModelAddress: string,
    reserveFactorMantissa: BigNumberish,
    adminFeeMantissa: BigNumberish,
    fuseFeeMantissa: BigNumberish
  ): Promise<void>;
  __init(
    baseRatePerBlock: BigNumberish,
    multiplierPerBlock: BigNumberish,
    jumpMultiplierPerBlock: BigNumberish,
    kink: BigNumberish,
    reserveFactorMantissa: BigNumberish,
    adminFeeMantissa: BigNumberish,
    fuseFeeMantissa: BigNumberish
  ): Promise<void>;
  getBorrowRate(utilizationRate: BigNumber): BigNumber;
  getSupplyRate(utilizationRate: BigNumber): BigNumber;
}
