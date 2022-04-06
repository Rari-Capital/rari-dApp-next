import { BigNumber } from "ethers";
import { EMPTY_ADDRESS } from "lib/turbo/utils/constants";


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
};


export const formatStrategiesInfo = (
    strategies: LensStrategyInfo[],
    shouldFilterStrategies: boolean = false
): StrategyInfo[] | [] => {

    const formattedStrategies = strategies.map((strategy) => {
        return {
            strategy: strategy[0],
            boostedAmount: strategy[1],
            feiAmount: strategy[2],
            feiEarned: strategy[1].sub(strategy[2])
        };
    });

    return shouldFilterStrategies ? filterUsedStrategies(formattedStrategies) : formattedStrategies;
};

export const filterUsedStrategies = (strats: StrategyInfo[] = []) =>
    strats.filter((s) => s.boostedAmount._hex !== "0x00");
