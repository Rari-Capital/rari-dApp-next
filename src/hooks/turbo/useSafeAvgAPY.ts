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


    const numActiveStrategies = strategies.reduce((acc, strategy) => {
        return strategy.boostedAmount.isZero() ? acc : acc + 1
    }, 0)

    return strategies.reduce((num, { strategy }) => {
        const erc4626Strategy = getERC4626StrategyData[strategy];
        if (
            erc4626Strategy
            && erc4626Strategy.supplyRatePerBlock
        ) {
            let apy = convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365)
            let userShare = (1 - tribeDaoFeeShare);
            let userAPY = apy * userShare;
            num += userAPY / numActiveStrategies
        }

        return num
    }, 0)
}

export default useSafeAvgAPY