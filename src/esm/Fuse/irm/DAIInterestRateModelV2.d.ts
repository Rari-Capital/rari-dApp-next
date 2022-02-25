import JumpRateModel from "./JumpRateModel.js";
import { BigNumber } from "@ethersproject/bignumber";
import { BigNumberish } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
export default class DAIInterestRateModelV2 extends JumpRateModel {
  static RUNTIME_BYTECODE_HASH: string;
  initialized: boolean | undefined;
  dsrPerBlock: BigNumber | undefined;
  cash: BigNumber | undefined;
  borrows: BigNumber | undefined;
  reserves: BigNumber | undefined;
  reserveFactorMantissa: BigNumber | undefined;
  init(
    interestRateModelAddress: string,
    assetAddress: string,
    provider: any
  ): Promise<void>;
  _init(
    interestRateModelAddress: string,
    reserveFactorMantissa: BigNumberish,
    adminFeeMantissa: BigNumberish,
    fuseFeeMantissa: BigNumberish,
    provider: Web3Provider
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
  getSupplyRate(utilizationRate: BigNumber): BigNumber;
}
