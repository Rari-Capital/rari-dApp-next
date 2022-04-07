import { BigNumber } from "ethers";
import { StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { useMemo } from "react";
import { convertMantissaToAPY } from "utils/apyUtils";
import { StrategyInfosMap } from "./useStrategyInfo";

const useSafeAvgAPY = (
    activeStrategies: StrategyInfo[],
    getERC4626StrategyData: StrategyInfosMap,
    tribeDaoFeeShare: number
) => {

    const apy = useMemo<number>(() => activeStrategies.reduce((num, { strategy }) => {
        const erc4626Strategy = getERC4626StrategyData[strategy];
        console.log({ erc4626Strategy, getERC4626StrategyData })
        if (
            erc4626Strategy
            && erc4626Strategy.supplyRatePerBlock
        ) {
            num += convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365);
        }
        return num / activeStrategies.length;
    }, 0), [activeStrategies, getERC4626StrategyData])

    console.log({ tribeDaoFeeShare, apy })

    return apy * (1 - tribeDaoFeeShare)
}

export default useSafeAvgAPY