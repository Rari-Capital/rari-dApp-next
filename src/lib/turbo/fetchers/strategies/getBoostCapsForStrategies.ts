import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { TurboAddresses } from "lib/turbo/utils/constants"
import { ITurboBooster } from "lib/turbo/utils/turboContracts"
import { callStaticWithMultiCall, encodeCall, EncodedCall } from "utils/multicall"

type BoostCapForStrategyMap = {
    [strategy: string]: BigNumber
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