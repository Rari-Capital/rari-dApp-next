import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { createTurboMaster } from "../utils/turboContracts"

export const getTurboApprovedCollateral =
    async (provider: JsonRpcProvider | Web3Provider): Promise<string[]> => {
        const TurboMaster = createTurboMaster(provider)
        const TurboPool = await TurboMaster.callStatic.pool()

        return []
    }