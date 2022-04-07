import { StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { useMemo } from "react";
import { convertMantissaToAPY } from "utils/apyUtils";
import { StrategyInfosMap } from "./useStrategyInfo";


// Returns avg Apy for a safe
const useSafeAvgAPY = (
    activeStrategies: StrategyInfo[],
    getERC4626StrategyData: StrategyInfosMap,
    tribeDaoFeeShare: number
) => {

    const apy = useMemo<number>(
        () => getStrategiesAvgAPY(
            activeStrategies,
            getERC4626StrategyData,
            tribeDaoFeeShare
        ),
        [activeStrategies, getERC4626StrategyData, tribeDaoFeeShare]
    )

    return apy
}

export const getStrategiesAvgAPY = (
    strategies: StrategyInfo[],
    getERC4626StrategyData: StrategyInfosMap,
    tribeDaoFeeShare: number
) => {
    return strategies.reduce((num, { strategy }) => {
        const erc4626Strategy = getERC4626StrategyData[strategy];
        if (
            erc4626Strategy
            && erc4626Strategy.supplyRatePerBlock
        ) {
            num += convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365) * (1 - tribeDaoFeeShare);
        }
        return num / strategies.length;
    }, 0)
}

export default useSafeAvgAPY