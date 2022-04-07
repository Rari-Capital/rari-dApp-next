import { getEthUsdPriceBN } from 'esm/utils/getUSDPriceBN';
import { BigNumber, constants } from 'ethers'
import { formatEther } from 'ethers/lib/utils';
import { useBalancesOfMultipleAddresses } from 'hooks/useBalanceOf';
import { SafeInfo } from 'lib/turbo/fetchers/safes/getSafeInfo';
import { filterUsedStrategies } from 'lib/turbo/fetchers/strategies/formatStrategyInfo';
import { FEI } from 'lib/turbo/utils/constants';
import { getUserFeiOwed, getUserFeiOwedWithBalance } from 'lib/turbo/utils/getUserFeiOwed';
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

    const balancesFEI = useBalancesOfMultipleAddresses(safes.map(safe => safe.safeAddress), FEI)
    console.log({ balancesFEI })

    const { data } = useQuery<AggregateSafeData>(
        `user aggregate safes ${safes.map(safe => safe.safeAddress).join(', ')}`,
        async () => {
            const ethUSD = await getEthUsdPriceBN()
            const feiPrice = await safes[0]?.feiPrice ?? constants.WeiPerEther

            const numActiveSafes = safes.reduce((acc, safe) => {
                return safe.boostedAmount.isZero() ? acc : acc + 1
            }, 0)

            const totalBoosted = safes.reduce((acc, safe) => {
                return acc.add(safe.boostedAmount);
            }, constants.Zero)

            let totalClaimable = safes.reduce((acc, safe) => {
                return acc.add(getUserFeiOwedWithBalance(safe, balancesFEI[safe.safeAddress]));
            }, constants.Zero)

            let totalClaimableUSD = calculateFEIValueUSD(totalClaimable, feiPrice, ethUSD)

            let netAPY = !numActiveSafes ? 0 : safes.reduce((acc, safe) => {
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