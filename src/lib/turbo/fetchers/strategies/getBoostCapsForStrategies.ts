import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { TurboAddresses } from "lib/turbo/utils/constants"
import { createTurboBooster, createTurboMaster, ITurboBooster } from "lib/turbo/utils/turboContracts"
import { callStaticWithMultiCall, encodeCall, EncodedCall } from "utils/multicall"
import { providers } from "@0xsequence/multicall";

type BoostCapForStrategyMap = {
    [strategy: string]: BigNumber
}


// Multicall Boost Caps for all strategies passed in
// Return a map of strategy Address to boost cap
export const getBoostCapForStrategy = async (
    provider: JsonRpcProvider | Web3Provider,
    strategy: string
): Promise<[boostCap: BigNumber, totalBoosted: BigNumber]> => {
    const multicallProvider = new providers.MulticallProvider(provider)
    const booster = createTurboBooster(multicallProvider, 1)
    const master = createTurboMaster(multicallProvider, 1)
    const cap = await booster.callStatic.getBoostCapForVault(strategy)
    const totalBoosted = await master.callStatic.getTotalBoostedForVault(strategy)
    return [cap, totalBoosted]
}

// Multicall Boost Caps for all strategies passed in
// Return a map of strategy Address to boost cap
export const getBoostCapsForStrategies = async (
    provider: JsonRpcProvider | Web3Provider,
    strategies: string[]
): Promise<BoostCapForStrategyMap> => {


    const encodedCalls: EncodedCall[] = strategies.map(
        strategyAddr => encodeCall(
            ITurboBooster,
            TurboAddresses[1].BOOSTER,
            "getBoostCapForVault",
            [strategyAddr]
        )
    )

    const { returnData } = await callStaticWithMultiCall(provider, encodedCalls)

    return strategies.reduce((acc: BoostCapForStrategyMap, curr, i) => ({
        ...acc,
        [curr]: BigNumber.from(returnData[i])
    }), {})
}