import { BigNumber } from "ethers";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";

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
  strategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
    },
  ],
  safeUtilization: BigNumber.from(50),
  collateralUSD: 100,
  debtUSD: 50,
  boostedUSD: 50,
  feiAmountUSD: 50,
  feiPriceUSD: 1,
  usdPricedStrategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
      boostAmountUSD: 50,
      feiAmountUSD: 50,
      feiEarnedUSD: 10,
    },
  ],
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
  strategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
    },
  ],
  safeUtilization: BigNumber.from(50),
  collateralUSD: 100,
  debtUSD: 50,
  boostedUSD: 50,
  feiAmountUSD: 50,
  feiPriceUSD: 1,
  usdPricedStrategies: [
    {
      strategy: "0xB6B4798361033d9BB64f5C8F638c4B7c25bAb7b6",
      boostedAmount: BigNumber.from("0x01a784379d99db42000000"),
      feiAmount: BigNumber.from("0x01a784384483c3a3ebd483"),
      feiEarned: BigNumber.from("0x0001a784384483c3a3ebd4"),
      boostAmountUSD: 50,
      feiAmountUSD: 50,
      feiEarnedUSD: 10,
    },
  ],
};

export { MOCK_SAFE_1, MOCK_SAFE_2 };
