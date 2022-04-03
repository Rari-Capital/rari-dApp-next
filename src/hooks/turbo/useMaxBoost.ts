import { useRari } from "context/RariContext"
import { formatEther } from "ethers/lib/utils"
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo"
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount"
import { useEffect, useState } from "react"
import { SafeInteractionMode } from "./useUpdatedSafeInfo"

const useMaxBoost = (safe: SafeInfo | undefined): string => {
    const { provider, address } = useRari();
    const [maxBoost, setMaxBoost] = useState<string>("0");

    useEffect(() => {
        fetchMaxSafeAmount(provider, SafeInteractionMode.BOOST, address, safe)
            .then((maxBoostAmount) => setMaxBoost(formatEther(maxBoostAmount)))
    })

    return maxBoost
}

export default useMaxBoost