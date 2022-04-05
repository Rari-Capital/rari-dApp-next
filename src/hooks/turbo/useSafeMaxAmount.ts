import { useRari } from "context/RariContext"
import { constants } from "ethers"
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo"
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount"
import { useQuery } from "react-query"
import { SafeInteractionMode } from "./useUpdatedSafeInfo"

const useSafeMaxAmount = (
    safe: SafeInfo | undefined,
    mode: SafeInteractionMode,
    strategyIndex?: number //only used for LESS
) => {
    const { provider, address, chainId } = useRari();

    const { data: maxAmount } = useQuery(
        `Safe ${safe?.safeAddress} Max ${mode} amount ${!!strategyIndex ? 'Strategy ' + strategyIndex : null}`,
        async () => {
            if (!chainId) return

            fetchMaxSafeAmount(
                provider, 
                mode, 
                address, 
                safe, 
                chainId,
                strategyIndex
            )
        } 
            
    )

    return maxAmount ?? constants.Zero
}

export default useSafeMaxAmount