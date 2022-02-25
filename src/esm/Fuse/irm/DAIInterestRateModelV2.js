var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { createContract, toBN } from "../../utils/web3";
import JumpRateModel from "./JumpRateModel.js";
import { contracts } from "../contracts/compound-protocol.min.json";
export default class DAIInterestRateModelV2 extends JumpRateModel {
  init(interestRateModelAddress, assetAddress, provider) {
    const _super = Object.create(null, {
      init: { get: () => super.init },
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super.init.call(
        this,
        interestRateModelAddress,
        assetAddress,
        provider
      );
      const interestRateContract = createContract(
        interestRateModelAddress,
        contracts["contracts/DAIInterestRateModelV2.sol:DAIInterestRateModelV2"]
          .abi,
        provider
      );
      this.dsrPerBlock = toBN(
        yield interestRateContract.callStatic.dsrPerBlock()
      );
      const cTokenContract = createContract(
        assetAddress,
        contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi,
        provider
      );
      this.cash = toBN(yield cTokenContract.callStatic.getCash());
      this.borrows = toBN(
        yield cTokenContract.callStatic.totalBorrowsCurrent()
      );
      this.reserves = toBN(yield cTokenContract.callStatic.totalReserves());
    });
  }
  _init(
    interestRateModelAddress,
    reserveFactorMantissa,
    adminFeeMantissa,
    fuseFeeMantissa,
    provider
  ) {
    const _super = Object.create(null, {
      _init: { get: () => super._init },
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super._init.call(
        this,
        interestRateModelAddress,
        reserveFactorMantissa,
        adminFeeMantissa,
        fuseFeeMantissa,
        provider
      );
      const interestRateContract = createContract(
        interestRateModelAddress,
        contracts["contracts/DAIInterestRateModelV2.sol:DAIInterestRateModelV2"]
          .abi,
        provider
      );
      this.dsrPerBlock = toBN(
        yield interestRateContract.callStatic.dsrPerBlock()
      );
      this.cash = toBN(0);
      this.borrows = toBN(0);
      this.reserves = toBN(0);
    });
  }
  __init(
    baseRatePerBlock,
    multiplierPerBlock,
    jumpMultiplierPerBlock,
    kink,
    reserveFactorMantissa,
    adminFeeMantissa,
    fuseFeeMantissa
  ) {
    const _super = Object.create(null, {
      __init: { get: () => super.__init },
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super.__init.call(
        this,
        baseRatePerBlock,
        multiplierPerBlock,
        jumpMultiplierPerBlock,
        kink,
        reserveFactorMantissa,
        adminFeeMantissa,
        fuseFeeMantissa
      );
      this.dsrPerBlock = toBN(0); // TODO: Make this work if DSR ever goes positive again
      this.cash = toBN(0);
      this.borrows = toBN(0);
      this.reserves = toBN(0);
    });
  }
  getSupplyRate(utilizationRate) {
    if (
      !this.initialized ||
      !this.cash ||
      !this.borrows ||
      !this.reserves ||
      !this.dsrPerBlock
    )
      throw new Error("Interest rate model class not initialized.");
    // const protocolRate = super.getSupplyRate(utilizationRate, this.reserveFactorMantissa); //todo - do we need this
    const protocolRate = super.getSupplyRate(utilizationRate);
    const underlying = this.cash.add(this.borrows).sub(this.reserves);
    if (underlying.isZero()) {
      return protocolRate;
    } else {
      const cashRate = this.cash.mul(this.dsrPerBlock).div(underlying);
      return cashRate.add(protocolRate);
    }
  }
}
DAIInterestRateModelV2.RUNTIME_BYTECODE_HASH =
  "0x4b4c4f6386fd72d3f041a03e9eee3945189457fcf4299e99098d360a9f619539";
