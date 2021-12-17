var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Caches from "../cache";
import { Contract, BigNumber } from "ethers";
// ABIs
import cErc20DelegateAbi from "./fuse/abi/CErc20Delegate.json";
export default class FuseSubpool {
    constructor(provider, cTokens) {
        this.provider = provider;
        this.cTokens = cTokens;
        this.cache = new Caches({
            currencyApys: 300,
        });
    }
    getCurrencyApy(cTokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const cToken = new Contract(cTokenAddress, cErc20DelegateAbi, this.provider);
            const supplyRatePerBlock = yield cToken.supplyRatePerBlock();
            return BigNumber.from(((Math.pow((supplyRatePerBlock / 1e18) * (4 * 60 * 24) + 1, 365) - 1) * 1e18).toFixed(0));
        });
    }
    getCurrencyApys() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return yield self.cache.getOrUpdate("currencyApys", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let apyBNs = {};
                    for (const currencyCode of Object.keys(self.cTokens)) {
                        apyBNs[currencyCode] = yield self.getCurrencyApy(self.cTokens[currencyCode]);
                    }
                    return apyBNs;
                });
            });
        });
    }
}
