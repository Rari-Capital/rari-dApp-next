import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { EMPTY_ADDRESS } from "lib/turbo/utils/constants";
import { calculateETHValueUSD, calculateFEIValueUSD } from "lib/turbo/utils/usdUtils";
import { StrategyInfo } from "../strategies/formatStrategyInfo";
import { getSafeInfo, SafeInfo } from "./getSafeInfo";

export interface USDPricedTurboSafe extends SafeInfo {
    collateralValueUSD: number,
    collateralPriceUSD: number,
    debtUSD: number,
    boostedUSD: number,
    feiAmountUSD: number,
    feiPriceUSD: number,
    usdPricedStrategies: USDPricedStrategy[],
    maxBoostUSD: number,
    liquidationPriceUSD: number,
}

export interface USDPricedStrategy extends StrategyInfo {
    boostAmountUSD: number,
    feiAmountUSD: number,
    feiEarnedUSD: number,
    feiClaimableUSD: number,
}

export const getUSDPricedSafeInfo = async (
    provider: any,
    safe: string,
    chainID: number
): Promise<USDPricedTurboSafe> => {
    try {
        const [ethUSDBN, safeInfo]: [BigNumber, SafeInfo] = await Promise.all(
            [
                getEthUsdPriceBN(),
                getSafeInfo(
                    provider,
                    safe,
                    chainID
                ),

            ]
        )

        const collateralValueUSD = calculateETHValueUSD(safeInfo.collateralValue, ethUSDBN)
        const collateralPriceUSD = calculateETHValueUSD(safeInfo.collateralPrice, ethUSDBN)
        const debtUSD = calculateETHValueUSD(safeInfo.debtValue, ethUSDBN)
        const boostedUSD = calculateFEIValueUSD(safeInfo.boostedAmount, safeInfo.feiPrice, ethUSDBN)
        const feiAmountUSD = calculateFEIValueUSD(safeInfo.feiAmount, safeInfo.feiPrice, ethUSDBN)
        const feiPriceUSD = calculateETHValueUSD(safeInfo.feiPrice, ethUSDBN)
        const maxBoostUSD = calculateETHValueUSD(safeInfo.maxBoost, ethUSDBN)
        const liquidationPriceUSD = calculateETHValueUSD(parseEther(safeInfo.liquidationPrice.toString()), ethUSDBN)

        // Add USD values to each strategyInfo
        const usdPricedStrategies = getUSDPricedStrategies(ethUSDBN, safeInfo.feiPrice, safeInfo.strategies)

        const usdPricedSafe: USDPricedTurboSafe = {
            ...safeInfo,
            collateralValueUSD,
            collateralPriceUSD,
            debtUSD,
            feiAmountUSD,
            boostedUSD,
            feiPriceUSD,
            usdPricedStrategies,
            maxBoostUSD,
            liquidationPriceUSD
        }

        return usdPricedSafe;
    } catch (err) {
        console.log(err);
        throw err
    }
};


export const getUSDPricedStrategies = (
    ethUSDBN: BigNumber,
    feiPriceBN: BigNumber,
    strategies: StrategyInfo[]
): USDPricedStrategy[] => {

    const usdPricedStrategies: USDPricedStrategy[] = []

    strategies.forEach(strategy => {
        let boostAmountUSD = strategy.strategy === EMPTY_ADDRESS
            ? 0
            : calculateFEIValueUSD(strategy.boostedAmount, feiPriceBN, ethUSDBN)

        let feiAmountUSD = strategy.strategy === EMPTY_ADDRESS
            ? 0
            : calculateFEIValueUSD(strategy.feiAmount, feiPriceBN, ethUSDBN)

        let feiEarnedUSD = feiAmountUSD - boostAmountUSD
        let feiClaimableUSD = strategy.strategy === EMPTY_ADDRESS
            ? 0
            : calculateFEIValueUSD(strategy.feiClaimable, feiPriceBN, ethUSDBN)


        let usdStrat: USDPricedStrategy = {
            ...strategy,
            boostAmountUSD,
            feiAmountUSD,
            feiEarnedUSD,
            feiClaimableUSD
        }

        usdPricedStrategies.push(usdStrat)
    })

    return usdPricedStrategies;
    /*
    const usdPricedStrategies = strategies
        .reduce((arr, strategy) => {

            const usdStrat: USDPricedStrategy = {
                ...strategy,
                boostAmountUSD: parseFloat(
                    formatEther(strategy.boostedAmount
                        .mul(ethUSDBN)
                        .div(constants.WeiPerEther))
                ),
                feiAmountUSD: parseFloat(
                    formatEther(strategy.boostedAmount
                        .mul(ethUSDBN)
                        .div(constants.WeiPerEther))
                )
            }

            return [...arr, usdStrat]
        }, [])
        */
}



