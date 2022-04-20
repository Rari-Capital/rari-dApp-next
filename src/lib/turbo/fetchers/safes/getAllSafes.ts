import { providers } from "ethers"
import { createTurboMaster } from "lib/turbo/utils/turboContracts"

export const getAllSafes = async (provider: providers.Provider, chainID: number) => {
    let master = createTurboMaster(provider, chainID)
    try {
       let result: any[] = await master.callStatic.getAllSafes()
       return result
    } catch (err) {
        console.log(err)
    }
}