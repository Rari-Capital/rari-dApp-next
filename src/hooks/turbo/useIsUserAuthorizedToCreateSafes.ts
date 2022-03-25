import { useQuery } from "react-query"
import { isUserAuthorizedToCreateSafes } from 'lib/turbo/fetchers/getIsUserAuthorizedToCreateSafes';
import { TurboAddresses } from "lib/turbo/utils/constants";
import { useRari } from "context/RariContext";

export const useIsUserAuthorizedToCreateSafes = () => {
    const { address, provider, chainId } = useRari()

    const {data: isAuthorized} = useQuery(`Is ${address} authorized to create safes`, 
        async () => {
            if(!address || !chainId || !provider) return

            const isAuthorized = await isUserAuthorizedToCreateSafes(
                provider, 
                TurboAddresses[chainId].TURBO_AUTHORITY, 
                address, 
                TurboAddresses[chainId].MASTER    
            )

            return isAuthorized
    })

    return isAuthorized
}