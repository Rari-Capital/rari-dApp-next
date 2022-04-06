import { StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { useMemo } from "react";
import { convertMantissaToAPY } from "utils/apyUtils";
import { StrategyInfosMap } from "./useStrategyInfo";

const useSafeAvgAPY = (
    activeStrategies: StrategyInfo[],
    getERC4626StrategyData: StrategyInfosMap
) => {
    return useMemo(() => Object.keys(activeStrategies).reduce((num, strategyAddress) => {
        const erc4626Strategy = getERC4626StrategyData[strategyAddress];
        if (
            erc4626Strategy
            && erc4626Strategy.supplyRatePerBlock
        ) {
            num += convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365);
        }
        return num / activeStrategies.length;
    }, 0), [activeStrategies, getERC4626StrategyData])


}

export default useSafeAvgAPY