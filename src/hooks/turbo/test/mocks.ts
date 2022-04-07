import { BigNumber } from "ethers";
import {
  USDPricedStrategy,
  USDPricedTurboSafe,
} from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { FuseERC4626Strategy } from "../useStrategyInfo";

const MOCK_STRATEGY_1: StrategyInfo = {
  strategy: "0xaC4c093c777581DC9c4DC935394Ff11e6c58CD45",
  boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
  feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
  feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
};

const MOCK_STRATEGY_2: StrategyInfo = {
  // Randomly generated address
  strategy: "0x3E556610757D238c7c806bBE04536a05828f474b",
  boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
  feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
  feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
};

const MOCK_USD_PRICED_STRATEGY_1: USDPricedStrategy = {
  ...MOCK_STRATEGY_1,
  boostAmountUSD: 50,
  feiAmountUSD: 50,
  feiEarnedUSD: 10,
};

const MOCK_USD_PRICED_STRATEGY_2: USDPricedStrategy = {
  ...MOCK_STRATEGY_2,
  boostAmountUSD: 50,
  feiAmountUSD: 50,
  feiEarnedUSD: 10,
};

const MOCK_ERC4626_STRATEGY_1: FuseERC4626Strategy = {
  underlying: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  name: "Fei USD",
  symbol: "FEI",
  // Randomly generated address
  fToken: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  // Randomly generated address
  comptroller: "0x517F73a1329330c469BA1446BA248aEAa3b3a883",
  supplyRatePerBlock: 100,
};

const MOCK_SAFE_1: USDPricedTurboSafe = {
  safeAddress: "0xCd6442eB75f676671FBFe003A6A6F022CbbB8d38",
  collateralAsset: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  collateralAmount: BigNumber.from("5000001000000000000000000"),
  collateralValue: BigNumber.from("1158926336594045961765"),
  collateralPrice: BigNumber.from("231785220961765"),
  debtAmount: BigNumber.from("2000000000000000000000000"),
  debtValue: BigNumber.from("651700000000000000000"),
  boostedAmount: BigNumber.from("2000000000000000000000000"),
  feiPrice: BigNumber.from("325850000000000"),
  feiAmount: BigNumber.from("2000000046982030418498691"),
  tribeDAOFee: BigNumber.from("750000000000000000"),
  strategies: [MOCK_STRATEGY_1, MOCK_STRATEGY_2],
  safeUtilization: BigNumber.from(50),
  collateralValueUSD: 100,
  collateralPriceUSD: 1,
  debtUSD: 50,
  boostedUSD: 50,
  feiAmountUSD: 50,
  feiPriceUSD: 1,
  usdPricedStrategies: [MOCK_USD_PRICED_STRATEGY_1, MOCK_USD_PRICED_STRATEGY_2],
  maxBoost: BigNumber.from("20000000000000000000000000"),
  maxBoostUSD: 20000000000000000000000000,
  collateralFactor: BigNumber.from("100"),
  liquidationPrice: .01,
  liquidationPriceUSD: .32
};

const MOCK_SAFE_2: USDPricedTurboSafe = {
  // Randomly generated address
  safeAddress: "0x87F5A53A5FBB4085AA4111B531044B4350788E2F",
  collateralAsset: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  collateralAmount: BigNumber.from("5000001000000000000000000"),
  collateralValue: BigNumber.from("1158926336594045961765"),
  collateralPrice: BigNumber.from("231785220961765"),
  debtAmount: BigNumber.from("2000000000000000000000000"),
  debtValue: BigNumber.from("651700000000000000000"),
  boostedAmount: BigNumber.from("2000000000000000000000000"),
  feiPrice: BigNumber.from("325850000000000"),
  feiAmount: BigNumber.from("2000000046982030418498691"),
  tribeDAOFee: BigNumber.from("750000000000000000"),
  strategies: [MOCK_STRATEGY_1],
  safeUtilization: BigNumber.from(50),
  collateralValueUSD: 100,
  collateralPriceUSD: 1,
  debtUSD: 50,
  boostedUSD: 50,
  feiAmountUSD: 50,
  feiPriceUSD: 1,
  usdPricedStrategies: [
    {
      strategy: "0xaC4c093c777581DC9c4DC935394Ff11e6c58CD45",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
      boostAmountUSD: 50,
      feiAmountUSD: 50,
      feiEarnedUSD: 10,
    },
  ],
  maxBoost: BigNumber.from("20000000000000000000000000"),
  maxBoostUSD: 20000000000000000000000000,
  collateralFactor: BigNumber.from("100"),
  liquidationPrice: .01,
  liquidationPriceUSD: .32
};

export { MOCK_SAFE_1, MOCK_SAFE_2, MOCK_ERC4626_STRATEGY_1 };
