import { BigNumber, constants } from "ethers";
import { createTurboLens } from "../../utils/turboContracts";
import { formatStrategiesInfo, LensStrategyInfo, StrategyInfo } from "../strategies/formatStrategyInfo";

// Data directly from the TurboLens
export type LensSafeInfo = [
  safeAddress: string,
  collateral: string,
  collateralAmount: BigNumber,
  collateralValue: BigNumber,
  collateralPrice: BigNumber,
  debtAmount: BigNumber,
  debtValue: BigNumber,
  boostedAmount: BigNumber,
  feiPrice: BigNumber,
  feiAmount: BigNumber,
  tribeDAOFee: BigNumber,
  strategyInfo: LensStrategyInfo[],
];

// Formatted Safe Data
export type SafeInfo = {
  safeAddress: string;
  collateralAsset: string;
  collateralAmount: BigNumber;
  collateralValue: BigNumber;
  collateralPrice: BigNumber;
  debtAmount: BigNumber;
  debtValue: BigNumber;
  boostedAmount: BigNumber;
  feiPrice: BigNumber;
  feiAmount: BigNumber;
  tribeDAOFee: BigNumber;
  strategies: StrategyInfo[];
  safeUtilization: BigNumber
};


export const formatSafeInfo = (safe: LensSafeInfo): SafeInfo => ({
  safeAddress: safe[0],
  collateralAsset: safe[1],
  collateralAmount: safe[2],
  collateralValue: safe[3],
  collateralPrice: safe[4],
  debtAmount: safe[5],
  debtValue: safe[6],
  boostedAmount: safe[7],
  feiPrice: safe[8],
  feiAmount: safe[9],
  tribeDAOFee: safe[10],
  strategies: formatStrategiesInfo(safe[11]),
  safeUtilization: safe[3].isZero() ? constants.Zero : safe[6].mul(100).div(safe[3]) // debtValue / collateralValue
})

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
    console.log(err);
    throw err
  }
};
