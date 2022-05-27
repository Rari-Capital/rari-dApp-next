var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createContract, toBN } from "../../utils/web3";
import { contracts } from "../contracts/compound-protocol.min.json";
export default class JumpRateModel {
    init(interestRateModelAddress, assetAddress, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const jumpRateModelContract = createContract(interestRateModelAddress, contracts["contracts/JumpRateModel.sol:JumpRateModel"].abi, provider.getSigner());
            this.baseRatePerBlock = toBN(yield jumpRateModelContract.callStatic.baseRatePerBlock());
            this.multiplierPerBlock = toBN(yield jumpRateModelContract.callStatic.multiplierPerBlock());
            this.jumpMultiplierPerBlock = toBN(yield jumpRateModelContract.callStatic.jumpMultiplierPerBlock());
            this.kink = toBN(yield jumpRateModelContract.callStatic.kink());
            const cTokenContract = createContract(assetAddress, JSON.parse(contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi), provider);
            this.reserveFactorMantissa = toBN(yield cTokenContract.callStatic.reserveFactorMantissa());
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(yield cTokenContract.callStatic.adminFeeMantissa()));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(yield cTokenContract.callStatic.fuseFeeMantissa()));
            this.initialized = true;
        });
    }
    _init(interestRateModelAddress, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const jumpRateModelContract = createContract(interestRateModelAddress, contracts["contracts/JumpRateModel.sol:JumpRateModel"].abi, provider);
            this.baseRatePerBlock = toBN(yield jumpRateModelContract.callStatic.baseRatePerBlock());
            this.multiplierPerBlock = toBN(yield jumpRateModelContract.callStatic.multiplierPerBlock());
            this.jumpMultiplierPerBlock = toBN(yield jumpRateModelContract.callStatic.jumpMultiplierPerBlock());
            this.kink = toBN(yield jumpRateModelContract.callStatic.kink());
            this.reserveFactorMantissa = toBN(reserveFactorMantissa);
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(adminFeeMantissa));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(fuseFeeMantissa));
            this.initialized = true;
        });
    }
    __init(baseRatePerBlock, multiplierPerBlock, jumpMultiplierPerBlock, kink, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseRatePerBlock = toBN(baseRatePerBlock);
            this.multiplierPerBlock = toBN(multiplierPerBlock);
            this.jumpMultiplierPerBlock = toBN(jumpMultiplierPerBlock);
            this.kink = toBN(kink);
            this.reserveFactorMantissa = toBN(reserveFactorMantissa);
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(adminFeeMantissa));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(fuseFeeMantissa));
            this.initialized = true;
        });
    }
    getBorrowRate(utilizationRate) {
        if (!this.initialized || !this.kink || !this.multiplierPerBlock || !this.baseRatePerBlock || !this.jumpMultiplierPerBlock)
            throw new Error("Interest rate model class not initialized.");
        if (utilizationRate.lte(this.kink)) {
            return utilizationRate.mul(this.multiplierPerBlock).div(toBN(1e18)).add(this.baseRatePerBlock);
        }
        else {
            const normalRate = this.kink.mul(this.multiplierPerBlock).div(toBN(1e18)).add(this.baseRatePerBlock);
            const excessUtil = utilizationRate.sub(this.kink);
            return excessUtil.mul(this.jumpMultiplierPerBlock).div(toBN(1e18)).add(normalRate);
        }
    }
    getSupplyRate(utilizationRate) {
        if (!this.initialized || !this.reserveFactorMantissa)
            throw new Error("Interest rate model class not initialized.");
        const oneMinusReserveFactor = toBN(1e18).sub(this.reserveFactorMantissa);
        const borrowRate = this.getBorrowRate(utilizationRate);
        const rateToPool = borrowRate.mul(oneMinusReserveFactor).div(toBN(1e18));
        return utilizationRate.mul(rateToPool).div(toBN(1e18));
    }
}
JumpRateModel.RUNTIME_BYTECODE_HASHES = [
    "0x00f083d6c0022358b6b3565c026e815cfd6fc9dcd6c3ad1125e72cbb81f41b2a",
    "0x47d7a0e70c9e049792bb96abf3c7527c7543154450c6267f31b52e2c379badc7"
];
