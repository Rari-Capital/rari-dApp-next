import { BigNumber, constants } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { createTurboLens } from "../../utils/turboContracts";
import {
  formatStrategiesInfo,
  LensStrategyInfo,
  StrategyInfo,
} from "../strategies/formatStrategyInfo";

// Data directly from the TurboLens
export type LensSafeInfo = [
  safeAddress: string,
  collateralAsset: string,
  collateralAmount: BigNumber,
  collateralPrice: BigNumber,
  collateralFactor: BigNumber,
  feiPrice: BigNumber,
  collateralValue: BigNumber,
  debtAmount: BigNumber,
  debtValue: BigNumber,
  boostedAmount: BigNumber,
  feiAmount: BigNumber,
  tribeDAOFee: BigNumber,
  strategyInfo: LensStrategyInfo[]
];

// Formatted Safe Data
export type SafeInfo = {
  safeAddress: string;
  collateralAsset: string;
  collateralAmount: BigNumber;
  collateralPrice: BigNumber;
  collateralFactor: BigNumber;
  feiPrice: BigNumber;
  collateralValue: BigNumber;
  debtAmount: BigNumber;
  debtValue: BigNumber;
  boostedAmount: BigNumber;
  feiAmount: BigNumber;
  tribeDAOFee: BigNumber;
  strategies: StrategyInfo[];
  safeUtilization: BigNumber;
  maxBoost: BigNumber;
  liquidationPrice: number;
};

export const formatSafeInfo = (safe: LensSafeInfo): SafeInfo => ({
  safeAddress: safe[0],
  collateralAsset: safe[1],
  collateralAmount: safe[2],
  collateralPrice: safe[3],
  collateralFactor: safe[4],
  feiPrice: safe[5],
  collateralValue: safe[6],
  debtAmount: safe[7],
  debtValue: safe[8],
  boostedAmount: safe[9],
  feiAmount: safe[10],
  tribeDAOFee: safe[11],
  strategies: formatStrategiesInfo(safe[12], safe[11]),
  safeUtilization: calculateSafeUtilization(safe[8], safe[6], safe[4]),
  maxBoost: calculateMaxBoost(safe[6], safe[4]),
  liquidationPrice: calcuateLiquidationPrice(
    safe[8],
    safe[6],
    safe[4],
    safe[3]
  ),
});

// debtValue * 100 / collateralValue
export const calculateSafeUtilization = (
  debtValue: BigNumber,
  collateralValue: BigNumber,
  collateralFactor: BigNumber
) => {
  return collateralValue.isZero()
    ? constants.Zero
    : debtValue
        .mul(100)
        .div(collateralValue.mul(collateralFactor).div(constants.WeiPerEther));
};

export const calculateMaxBoost = (
  collateralValue: BigNumber,
  collateralFactor: BigNumber
) => {
  const maxBoost = collateralValue
    .mul(collateralFactor)
    .div(constants.WeiPerEther);
  return maxBoost;
};

export const calcuateLiquidationPrice = (
  debtValue: BigNumber,
  collateralValue: BigNumber,
  collateralFactor: BigNumber,
  collateralPrice: BigNumber
): number => {
  const util = calculateSafeUtilization(
    debtValue,
    collateralValue,
    collateralFactor
  ).toNumber();
  const liqPriceETH = parseFloat(formatUnits(collateralPrice.mul(util), 20));
  console.log({ liqPriceETH });
  return liqPriceETH;
};

export const getSafeInfo = async (
  provider: any,
  safe: string,
  chainID: number
) => {
  let lens = createTurboLens(provider, chainID);

  try {
    const result: SafeInfo = formatSafeInfo(
      await lens.callStatic.getSafeInfo(safe, { gasLimit: 12000000 })
    );

    return result;
  } catch (err) {
    console.log("LENS ERR", { err, lens });
    throw err;
  }
};
