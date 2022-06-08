import { useQuery } from "react-query"
import { useCreateComptroller } from "utils/createComptroller"
import { useRari } from "context/RariContext"
import ComptrollerABI from "esm/Fuse/contracts/abi/Comptroller.json"
import { Contract } from "ethers";

export const useComptrollerData = (comptrollerAddress: string) => {
    const { fuse } = useRari()

    const {data} = useQuery('shouldUpdateComptroller' + comptrollerAddress, async () => {
        const comptrollerContract = useCreateComptroller(comptrollerAddress, fuse, false)
        const implementation = await comptrollerContract.comptrollerImplementation()

        const isLatestVersion = implementation === Object.keys(fuse.addresses.COMPTROLLER_VERSION).at(-1)

        let isGlobalPauseBorrowOverriden = null
        if (isLatestVersion) {
            const latestComptrollerContract = new Contract(
                comptrollerAddress,
                ComptrollerABI,
                fuse.provider.getSigner()
            )
            isGlobalPauseBorrowOverriden = await latestComptrollerContract._globalPauseBorrowOverride()
        }

        const data = {
            shouldUpdate: !isLatestVersion,
            version: fuse.addresses.COMPTROLLER_VERSION[implementation],
            implementation,
            isGlobalPauseBorrowOverriden
        }

        return data
    })

    return data
}