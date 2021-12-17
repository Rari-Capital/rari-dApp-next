var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createContract, toBN } from "../utils/web3";
import { contracts } from "../contracts/compound-protocol.min.json";
export default class WhitePaperInterestRateModel {
    init(interestRateModelAddress, assetAddress, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const whitePaperModelContract = createContract(interestRateModelAddress, contracts["contracts/WhitePaperInterestRateModel.sol:WhitePaperInterestRateModel"].abi, provider);
            this.baseRatePerBlock = toBN(yield whitePaperModelContract.callStatic.baseRatePerBlock());
            this.multiplierPerBlock = toBN(yield whitePaperModelContract.callStatic.multiplierPerBlock());
            const cTokenContract = createContract(assetAddress, JSON.parse(contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi), provider);
            this.reserveFactorMantissa = toBN(yield cTokenContract.callStatic.reserveFactorMantissa());
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(yield cTokenContract.callStatic.adminFeeMantissa()));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(yield cTokenContract.callStatic.fuseFeeMantissa()));
            this.initialized = true;
        });
    }
    _init(interestRateModelAddress, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const whitePaperModelContract = createContract(interestRateModelAddress, contracts["contracts/WhitePaperInterestRateModel.sol:WhitePaperInterestRateModel"].abi, provider);
            this.baseRatePerBlock = toBN(yield whitePaperModelContract.callStatic.baseRatePerBlock());
            this.multiplierPerBlock = toBN(yield whitePaperModelContract.callStatic.multiplierPerBlock());
            this.reserveFactorMantissa = toBN(reserveFactorMantissa);
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(adminFeeMantissa));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(fuseFeeMantissa));
            this.initialized = true;
        });
    }
    __init(baseRatePerBlock, multiplierPerBlock, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseRatePerBlock = toBN(baseRatePerBlock);
            this.multiplierPerBlock = toBN(multiplierPerBlock);
            this.reserveFactorMantissa = toBN(reserveFactorMantissa);
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(adminFeeMantissa));
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(toBN(fuseFeeMantissa));
            this.initialized = true;
        });
    }
    getBorrowRate(utilizationRate) {
        if (!this.initialized || !this.multiplierPerBlock || !this.baseRatePerBlock)
            throw new Error("Interest rate model class not initialized.");
        return utilizationRate.mul(this.multiplierPerBlock).div(toBN(1e18)).add(this.baseRatePerBlock);
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
WhitePaperInterestRateModel.RUNTIME_BYTECODE_HASH = "0xe3164248fb86cce0eb8037c9a5c8d05aac2b2ebdb46741939be466a7b17d0b83";
