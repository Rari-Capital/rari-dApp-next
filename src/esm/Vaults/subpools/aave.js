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
import Caches from "../cache";
import axios from "axios";
import { BigNumber } from "ethers";
export default class AaveSubpool {
  constructor(ethers) {
    this.ethers = ethers;
    this.cache = new Caches({
      aaveCurrencyApys: 300,
    });
  }
  getCurrencyApys() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.cache.getOrUpdate("aaveCurrencyApys", function () {
        return __awaiter(this, void 0, void 0, function* () {
          let currencyCodes = [
            "DAI",
            "USDC",
            "USDT",
            "TUSD",
            "BUSD",
            "SUSD",
            "mUSD",
            "ETH",
          ];
          const data = (yield axios.post(
            "https://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw",
            {
              query:
                `{
                                reserves(where: {
                                    symbol_in: ` +
                JSON.stringify(currencyCodes) +
                ` }) {
                                    id
                                    symbol
                                    liquidityRate
                                }
                            }`,
            }
          )).data;
          let apyBNs = {};
          for (let i = 0; i < data.data.reserves.length; i++) {
            if (
              data.data.reserves[i].symbol === "ETH" &&
              data.data.reserves[i].id !==
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0x24a42fd28c976a61df5d00d0599c34c4f90748c8"
            )
              continue;
            apyBNs[
              data.data.reserves[i].symbol == "SUSD"
                ? "sUSD"
                : data.data.reserves[i].symbol
            ] = BigNumber.from(data.data.reserves[i].liquidityRate).div(
              BigNumber.from(1e9)
            );
          }
          return apyBNs;
        });
      });
    });
  }
}
