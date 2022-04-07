import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { BigNumber, constants } from "ethers";
import { USDPricedStrategy, USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { calculateETHValueUSD, calculateFEIValueUSD } from "lib/turbo/utils/usdUtils";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { calculateMaxBoost, calculateSafeUtilization } from "lib/turbo/fetchers/safes/getSafeInfo";

export enum SafeInteractionMode {
    DEPOSIT = "Deposit",
    WITHDRAW = "Withdraw",
    BOOST = "Boost",
    LESS = "Less",
}

// Preivews a safe position based on action taken and amount
// TODO(@nathanhleung): Possibly find ways to optimize this query
export const useUpdatedSafeInfo = ({
    mode,
    safe,
    amount,
    strategyIndex
}: {
    mode: SafeInteractionMode,
    safe: USDPricedTurboSafe | undefined,
    amount: BigNumber,
    strategyIndex?: number
}): USDPricedTurboSafe | undefined => {
    const { provider, chainId } = useRari();

    const { data: updatedSafeInfo } = useQuery(
        `Updated safe info for ${safe?.safeAddress} for mode ${mode} and amount ${amount.toString()}`,
        async () => {
            if (!provider || !chainId || !safe) return;
            const ethUSDBN = await getEthUsdPriceBN()

            let updatedSafe: USDPricedTurboSafe;


            /** DEPOSIT **/
            if (mode === SafeInteractionMode.DEPOSIT) {

                const collateralAmount = safe.collateralAmount.add(amount)
                const collateralValue = collateralAmount
                    .mul(safe.collateralPrice)
                    .div(constants.WeiPerEther)
                const collateralValueUSD = calculateETHValueUSD(collateralValue, ethUSDBN)
                const safeUtilization = calculateSafeUtilization(safe.debtValue, collateralValue, safe.collateralFactor)
                const maxBoost = calculateMaxBoost(collateralValue, safe.collateralFactor)
                const maxBoostUSD = calculateETHValueUSD(maxBoost, ethUSDBN)

                updatedSafe = {
                    ...safe,
                    collateralAmount,
                    collateralValue,
                    collateralValueUSD,
                    safeUtilization,
                    maxBoost,
                    maxBoostUSD
                }

                return updatedSafe
            }

            /** WITHDRAW **/
            if (mode === SafeInteractionMode.WITHDRAW) {

                const collateralAmount = safe.collateralAmount.sub(amount)
                const collateralValue = collateralAmount
                    .mul(safe.collateralPrice)
                    .div(constants.WeiPerEther)
                const collateralValueUSD = calculateETHValueUSD(collateralValue, ethUSDBN)
                const safeUtilization = calculateSafeUtilization(safe.debtValue, collateralValue, safe.collateralFactor)

                updatedSafe = {
                    ...safe,
                    collateralAmount,
                    collateralValue,
                    collateralValueUSD,
                    safeUtilization
                }

                return updatedSafe
            }


            /** BOOST **/
            if (mode === SafeInteractionMode.BOOST) {
                console.log({ strategyIndex })

                if (strategyIndex === undefined || strategyIndex < 0) return undefined

                const boostedAmount = safe.boostedAmount.add(amount) // boosted FEI 
                const boostedUSD = calculateFEIValueUSD(boostedAmount, safe.feiPrice, ethUSDBN)
                const debtAmount = safe.debtAmount.add(amount)
                const debtValue = debtAmount
                    .mul(safe.feiPrice)
                    .div(constants.WeiPerEther)

                const safeUtilization = calculateSafeUtilization(debtValue, safe.collateralValue, safe.collateralFactor)

                const strategyToUpdate = safe.usdPricedStrategies[strategyIndex]

                const stratBoostedAmount = strategyToUpdate.boostedAmount.add(amount)
                const stratBoostedUSD = calculateFEIValueUSD(stratBoostedAmount, safe.feiPrice, ethUSDBN)
                const stratFeiAmount = strategyToUpdate.feiAmount.add(amount)
                const stratFeiUSD = calculateFEIValueUSD(stratFeiAmount, safe.feiPrice, ethUSDBN)

                const updatedStrategy: USDPricedStrategy = {
                    ...strategyToUpdate,
                    boostedAmount: stratBoostedAmount,
                    boostAmountUSD: stratBoostedUSD,
                    feiAmount: stratFeiAmount,
                    feiAmountUSD: stratFeiUSD,
                }

                const strategies = safe.usdPricedStrategies
                strategies[strategyIndex] = updatedStrategy

                updatedSafe = {
                    ...safe,
                    boostedAmount,
                    boostedUSD,
                    debtAmount,
                    debtValue,
                    safeUtilization,
                    strategies
                }

                return updatedSafe
            }

            /** LESS **/
            if (mode === SafeInteractionMode.LESS) {

                if (strategyIndex === undefined || strategyIndex < 0) return undefined

                const boostedAmount = safe.boostedAmount.sub(amount) // boosted FEI 
                const boostedUSD = calculateFEIValueUSD(boostedAmount, safe.feiPrice, ethUSDBN)
                const debtAmount = safe.debtAmount.sub(amount)
                const debtValue = debtAmount
                    .mul(safe.feiPrice)
                    .div(constants.WeiPerEther)

                const safeUtilization = calculateSafeUtilization(debtValue, safe.collateralValue, safe.collateralFactor)

                const strategyToUpdate = safe.usdPricedStrategies[strategyIndex]

                const stratBoostedAmount = strategyToUpdate.boostedAmount.sub(amount)
                const stratBoostedUSD = calculateFEIValueUSD(stratBoostedAmount, safe.feiPrice, ethUSDBN)
                const stratFeiAmount = strategyToUpdate.feiAmount.sub(amount)
                const stratFeiUSD = calculateFEIValueUSD(stratFeiAmount, safe.feiPrice, ethUSDBN)

                const updatedStrategy: USDPricedStrategy = {
                    ...strategyToUpdate,
                    boostedAmount: stratBoostedAmount,
                    boostAmountUSD: stratBoostedUSD,
                    feiAmount: stratFeiAmount,
                    feiAmountUSD: stratFeiUSD,
                }

                const strategies = safe.usdPricedStrategies
                strategies[strategyIndex] = updatedStrategy

                updatedSafe = {
                    ...safe,
                    boostedAmount,
                    boostedUSD,
                    debtAmount,
                    debtValue,
                    safeUtilization,
                    strategies
                }

                return updatedSafe
            }

        }
    );

    return updatedSafeInfo
};
