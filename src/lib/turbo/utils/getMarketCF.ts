import { JsonRpcProvider } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { createTurboComptroller } from "./turboContracts"

export async function getMarketCf(
    provider: JsonRpcProvider, 
    chainId: number, 
    underlyingAddress: string
): Promise<BigNumber> {
    const turboComptrollerContract = createTurboComptroller(provider, chainId)
    const marketAddress = await turboComptrollerContract.callStatic.cTokensByUnderlying(underlyingAddress)
    const market = await turboComptrollerContract.markets(marketAddress)
    return market.collateralFactorMantissa
}

