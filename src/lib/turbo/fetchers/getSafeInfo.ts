import { EMPTY_ADDRESS } from "../utils/constants";
import { BigNumber } from "ethers";
import { createTurboLens } from "../utils/turboContracts";

export type SafeInfo = {
  safeAddress: string,
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
};

export type StrategyInfo = {
  strategy: string;
  /// @notice the amount of fei boosted by the safe to this strategy
  boostedAmount: BigNumber;
  /// @notice the amount of fei held by the safe in this strategy
  feiAmount: BigNumber;
};

export type LensStrategyInfo = [string, BigNumber, BigNumber]

export type LensSafeInfo = [
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  LensStrategyInfo[]
]

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
});

export const formatStrategiesInfo = (strategy: LensStrategyInfo[]): StrategyInfo[] | [] => {
  const formattedInfo = strategy.map(strategy => { return  {
  strategy: strategy[0],
  boostedAmount: strategy[1],
  feiAmount: strategy[2],
  }}
  )

  const filteredFormattedInfo = filterUsedStrategies(formattedInfo)

  return filteredFormattedInfo
};

export const filterUsedStrategies = (strats: StrategyInfo[]) => strats?.filter(s => s.strategy !== EMPTY_ADDRESS)

export const getSafeInfo = async (provider: any, safe: string, chainID: number) => {
  let lens = createTurboLens(provider, chainID);

  try {
    const result: SafeInfo = formatSafeInfo(
      await lens.callStatic.getSafeInfo(safe, { gasLimit: 12000000 })
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};
