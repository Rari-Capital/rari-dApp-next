import { providers } from "ethers"
import { createTurboBooster } from "lib/turbo/utils/turboContracts"

export const getBoostableStrategies = async (provider: providers.Provider, chainID: number) => {
    const turboBoosterContract = await createTurboBooster(provider, chainID)
    const boostableStrategies = await turboBoosterContract.callStatic.getBoostableVaults()
    return boostableStrategies
}