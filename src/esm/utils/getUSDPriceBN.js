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
import axios from "axios";
import { parseUnits } from "ethers/lib/utils";
export const getEthUsdPriceBN = function () {
  return __awaiter(this, void 0, void 0, function* () {
    // Returns a USD price. Which means its a floating point of at least 2 decimal numbers.
    const usdPrice = (yield axios.get(
      "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum"
    )).data.ethereum.usd;
    // Now we turn it into a big number
    const usdPriceBN = parseUnits(usdPrice.toString(), 18);
    // To parse this back into USD usdPriceBN.div(constants.WeiPerEther).toString()
    return usdPriceBN;
  });
};
