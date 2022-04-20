import { BigNumber, constants } from "ethers";
import { FuseERC4626Strategy } from "hooks/turbo/useStrategyInfo";
import { DELISTED_STRATEGIES, EMPTY_ADDRESS } from "lib/turbo/utils/constants";

// Data directly from the TurboLens
export type LensStrategyInfo = [
  strategy: string,
  boostedAmount: BigNumber,
  feiAmount: BigNumber
];

// Formatted strategy data
export type StrategyInfo = {
  strategy: string;
  /// @notice the amount of fei boosted by the safe to this strategy
  boostedAmount: BigNumber;
  /// @notice the amount of fei held by the safe in this strategy
  feiAmount: BigNumber;
  /// @notice the amount of fei earned by the strategy
  feiEarned: BigNumber;
  feiClaimable: BigNumber;
};

export const formatStrategiesInfo = (
  strategies: LensStrategyInfo[],
  tribeDAOFeeShare: BigNumber,
  shouldFilterStrategies: boolean = false
): StrategyInfo[] | [] => {
  const formattedStrategies = strategies
    .map((strategy) => {
      return {
        strategy: strategy[0],
        boostedAmount: strategy[1],
        feiAmount: strategy[2],
        feiEarned: strategy[2].sub(strategy[1]),
        feiClaimable: strategy[2]
          .sub(strategy[1])
          .mul(constants.WeiPerEther.sub(tribeDAOFeeShare))
          .div(constants.WeiPerEther),
      } as StrategyInfo;
    })
    .filter((s) => !DELISTED_STRATEGIES[s.strategy.toLowerCase()]);

  return shouldFilterStrategies
    ? filterUsedStrategies(formattedStrategies)
    : formattedStrategies;
};

export const filterUsedStrategies = (strats: StrategyInfo[] = []) =>
  strats.filter((s) => s.boostedAmount._hex !== "0x00");

//IE wfFEI-8
export const getStrategyFusePoolId = (fuseStrategyName: string | undefined) => {
  const arr = fuseStrategyName?.split("-") ?? [];
  return arr[arr.length - 1];
};
