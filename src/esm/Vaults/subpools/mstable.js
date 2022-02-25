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
// Axios
import axios from "axios";
// Ethers
import { Contract, utils, BigNumber } from "ethers";
import Caches from "../cache";
// ABIs
import erc20Abi from "../abi/ERC20.json";
import MAsset from "./mstable/abi/Masset.json";
import MassetValidationHelper from "./mstable/abi/MassetValidationHelper.json";
const externalContractAddressesMStable = {
  Masset: "0xe2f2a5c287993345a840db3b0845fbc70f5935a5",
  MassetValidationHelper: "0xabcc93c3be238884cc3309c19afd128fafc16911",
};
const externalAbisMStable = {
  Masset: MAsset,
  MassetValidationHelper: MassetValidationHelper,
};
export default class mStableSubpool {
  constructor(provider) {
    this.provider = provider;
    this.cache = new Caches({
      mStableCurrencyApys: 300,
      mUsdSwapFee: 3600,
    });
    this.externalContracts = {};
    for (const contractName of Object.keys(externalContractAddressesMStable)) {
      this.externalContracts[contractName] = new Contract(
        externalContractAddressesMStable[contractName],
        externalAbisMStable[contractName]
      );
    }
  }
  getMUsdSavingsApy(includeIMUsdVaultApy) {
    return __awaiter(this, void 0, void 0, function* () {
      const data = (yield axios.post(
        "https://api.thegraph.com/subgraphs/name/mstable/mstable-protocol-staging",
        {
          operationName: "MUSD",
          query:
            'query MUSD {\n  masset(id: "0xe2f2a5c287993345a840db3b0845fbc70f5935a5") {\n    feeRate\n    savingsContractsV2: savingsContracts(where: {version: 2}) {\n      ...SavingsContractAll\n      token {\n        ...TokenAll\n        __typename\n      }\n      boostedSavingsVaults {\n        id\n        lastUpdateTime\n        lockupDuration\n        unlockPercentage\n        periodDuration\n        periodFinish\n        rewardPerTokenStored\n        rewardRate\n        stakingContract\n        totalStakingRewards\n        totalSupply\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment TokenAll on Token {\n  id\n  address\n  decimals\n  symbol\n  totalSupply {\n    ...MetricFields\n    __typename\n  }\n  __typename\n}\n\nfragment MetricFields on Metric {\n  exact\n  decimals\n  simple\n  __typename\n}\n\nfragment SavingsContractAll on SavingsContract {\n  id\n  totalSavings {\n    ...MetricFields\n    __typename\n  }\n  latestExchangeRate {\n    rate\n    timestamp\n    __typename\n  }\n  dailyAPY\n  version\n  active\n  __typename\n}\n',
        }
      )).data;
      if (!data || !data.data)
        return console.error(
          "Failed to decode exchange rates from The Graph when calculating mStable 24-hour APY"
        );
      this.cache.update(
        "mUsdSwapFee",
        BigNumber.from(data.data.masset.feeRate)
      );
      let apy = utils.parseUnits(
        data.data.masset.savingsContractsV2[0].dailyAPY,
        16
      );
      if (includeIMUsdVaultApy)
        apy = apy.add(
          yield this.getIMUsdVaultApy(
            data.data.masset.savingsContractsV2[0].boostedSavingsVaults[0]
              .totalStakingRewards,
            data.data.masset.savingsContractsV2[0].latestExchangeRate.rate
          )
        );
      return apy;
    });
  }
  getCurrencyApys() {
    return __awaiter(this, void 0, void 0, function* () {
      let self = this;
      return yield self.cache.getOrUpdate("mStableCurrencyApys", function () {
        return __awaiter(this, void 0, void 0, function* () {
          return { mUSD: yield self.getMUsdSavingsApy(true) };
        });
      });
    });
  }
  getMtaUsdPrice() {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield axios(
        "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2&vs_currencies=USD"
      )).data["0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2"].usd;
    });
  }
  getIMUsdVaultWeeklyRoi(totalStakingRewards, stakingTokenPrice) {
    return __awaiter(this, void 0, void 0, function* () {
      // Get Total Staked by our account
      const contract = new Contract(
        "0x30647a72dc82d7fbb1123ea74716ab8a317eac19",
        erc20Abi,
        this.provider
      );
      const totalStaked =
        (yield contract.balanceOf(
          "0x78befca7de27d07dc6e71da295cc2946681a6c7b"
        )) / 1e18;
      // https://github.com/mstable/mStable-app/blob/56055318f23b43479455cdf0a9521dfec493b01c/src/hooks/useVaultWeeklyROI.ts#L43
      const mtaPerWeekInUsd =
        totalStakingRewards * (yield this.getMtaUsdPrice());
      const totalStakedInUsd = stakingTokenPrice * totalStaked;
      return mtaPerWeekInUsd / totalStakedInUsd;
    });
  }
  getIMUsdVaultApy(totalStakingRewards, stakingTokenPrice) {
    return __awaiter(this, void 0, void 0, function* () {
      const weeklyROI = yield this.getIMUsdVaultWeeklyRoi(
        totalStakingRewards,
        stakingTokenPrice
      );
      const apyBN = utils.parseUnits(
        utils.formatUnits(
          ((Math.pow(weeklyROI + 1, 52) - 1) * 1e18).toFixed(0),
          18
        ),
        18
      );
      return apyBN;
    });
  }
}
mStableSubpool.EXTERNAL_CONTRACT_ADDRESSES = externalContractAddressesMStable;
mStableSubpool.EXTERNAL_CONTRACT_ABIS = externalAbisMStable;
mStableSubpool.SUPPORTED_EXCHANGE_CURRENCIES = ["USDC", "USDT", "TUSD"];
