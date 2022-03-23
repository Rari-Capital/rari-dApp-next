import { useQuery } from "react-query"
import { useAccount, useNetwork, useProvider } from "wagmi"
import { isUserAuthorizedToCreateSafes } from 'lib/turbo/fetchers/getIsUserAuthorizedToCreateSafes';
import { TurboAddresses } from "lib/turbo/utils/constants";

export const useIsUserAuthorizedToCreateSafes = () => {
    const provider = useProvider()
    const [{data: userData}] = useAccount()
    const [{ data: network }] = useNetwork()

    const {data: isAuthorized} = useQuery(`Is ${userData?.address} authorized to create safes`, 
        async () => {
            if(!userData?.address || !network.chain || !provider) return

            const isAuthorized = await isUserAuthorizedToCreateSafes(
                provider, 
                TurboAddresses[network.chain.id].TURBO_AUTHORITY, 
                userData.address, 
                TurboAddresses[network.chain.id].MASTER    
            )

            return isAuthorized
    })

    return isAuthorized
}