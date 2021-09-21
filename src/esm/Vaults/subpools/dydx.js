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
export default class DydxSubpool {
    constructor(provider) {
        this.provider = provider;
        this.cache = new Caches({
            dydxCurrencyApys: 300,
        });
    }
    getCurrencyApys() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cache.getOrUpdate("dydxCurrencyApys", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = (yield axios.get("https://api.dydx.exchange/v1/markets")).data;
                    console.log(data);
                    let apyBNs = {};
                    for (let i = 0; i < data.markets.length; i++) {
                        apyBNs[data.markets[i].symbol] = utils.parseUnits(data.markets[i].totalSupplyAPR, 77);
                    }
                    return apyBNs;
                });
            });
        });
    }
}
