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
import axios from "axios";
import { utils } from "ethers";
export default class CompoundSubpool {
    constructor(provider) {
        this.provider = provider;
        this.cache = new Caches({
            compoundCurrencySupplierAndCompApys: 300,
        });
    }
    getCurrencySupplierAndCompApys() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cache.getOrUpdate("compoundCurrencySupplierAndCompApys", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = (yield axios.get("https://api.compound.finance/api/v2/ctoken")).data;
                    let apyBNs = {};
                    for (let i = 0; i < data.cToken.length; i++) {
                        const supplyApy = utils.parseUnits(data.cToken[i].supply_rate.value, 28);
                        const compApy = utils.parseUnits(data.cToken[i].comp_supply_apy.value, data.cToken[i].comp_supply_apy.value.length - 1);
                        apyBNs[data.cToken[i].underlying_symbol] = [supplyApy, compApy];
                    }
                    return apyBNs;
                });
            });
        });
    }
    getCurrencyApys() {
        return __awaiter(this, void 0, void 0, function* () {
            const compoundApyBNs = yield this.getCurrencySupplierAndCompApys();
            let compoundCombinedApyBNs = {};
            for (const currencyCode of Object.keys(compoundApyBNs)) {
                compoundCombinedApyBNs[currencyCode] = compoundApyBNs[currencyCode][0].add(compoundApyBNs[currencyCode][1]);
            }
            return compoundCombinedApyBNs;
        });
    }
}
