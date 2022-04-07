import { getEthUsdPriceBN } from 'esm/utils/getUSDPriceBN';
import { BigNumber, constants } from 'ethers'
import { formatEther } from 'ethers/lib/utils';
import { SafeInfo } from 'lib/turbo/fetchers/safes/getSafeInfo';
import { filterUsedStrategies } from 'lib/turbo/fetchers/strategies/formatStrategyInfo';
import { getUserFeiOwed } from 'lib/turbo/utils/getUserFeiOwed';
import { calculateETHValueUSD, calculateFEIValueUSD } from 'lib/turbo/utils/usdUtils';
import { useQuery } from 'react-query';
import { convertMantissaToAPY } from 'utils/apyUtils';
import { getStrategiesAvgAPY } from './useSafeAvgAPY';
import { StrategyInfosMap } from './useStrategyInfo';

type AggregateSafeData = {
    totalBoosted: BigNumber;
    totalClaimable: BigNumber;
    totalClaimableUSD: number;
    netAPY: number;
}

const EMPTY_SAFE_DATA = {
    totalBoosted: constants.Zero,
    totalClaimable: constants.Zero,
    totalClaimableUSD: 0,
    netAPY: 0
}

const useAggregateSafeData = (
    safes: SafeInfo[],
    getERC4626StrategyData: StrategyInfosMap
): AggregateSafeData => {


    const { data } = useQuery<AggregateSafeData>(
        `user aggregate safes ${safes.map(safe => safe.safeAddress).join(', ')}`,
        async () => {
            const ethUSD = await getEthUsdPriceBN()
            const feiPrice = await safes[0]?.feiPrice ?? constants.WeiPerEther

            const numActiveSafes = safes.reduce((acc, safe) => {
                return safe.boostedAmount.isZero() ? acc : acc + 1
            }, 0)

            // TODO(sharad-s) I think `boostedAmount` is in the native token -- needs to
            // be a USD value
            const totalBoosted = safes.reduce((acc, safe) => {
                return acc.add(safe.boostedAmount);
            }, constants.Zero)

            let totalClaimable = safes.reduce((acc, safe) => {
                return acc.add(getUserFeiOwed(safe));
            }, constants.Zero)

            let totalClaimableUSD = calculateFEIValueUSD(totalClaimable, feiPrice, ethUSD)

            let netAPY = safes.reduce((acc, safe) => {
                const apy = getStrategiesAvgAPY(
                    filterUsedStrategies(safe.strategies),
                    getERC4626StrategyData,
                    parseFloat(formatEther(safe?.tribeDAOFee ?? 0))
                )
                return (acc + apy) / numActiveSafes;
            }, 0)

            const obj: AggregateSafeData = {
                totalBoosted,
                totalClaimable,
                totalClaimableUSD,
                netAPY
            }

            console.log({ obj })

            return obj

        })

    return data ?? EMPTY_SAFE_DATA
}

export default useAggregateSafeData