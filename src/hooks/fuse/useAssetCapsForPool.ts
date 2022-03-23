import { useRari } from "context/RariContext"
import { Interface } from "ethers/lib/utils";
import { useQuery } from "react-query"

const useAssetCaps = (marketAddresses: string[]) => {
    const { fuse } = useRari();

    const IComptroller = new Interface(JSON.parse(
        fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
    ))

    const params = marketAddresses.map(address => {
        const x = [[address], [address]]
        console.log({ x })
        return x
    })

    console.log({ params })


    const { data } = useQuery(`asset caps for ${marketAddresses.join(', ')}`, async () => {

        // asset.supplyCap = constants.Zero
        // asset.borrowCap = constants.Zero
        // try {
        //   let [[supplyCap], [borrowCap]] = await callInterfaceWithMulticall(fuse.provider, IComptroller, comptroller, ["supplyCaps", "borrowCaps"], [[asset.cToken], [asset.cToken]])
        //   asset.supplyCap = supplyCap
        //   asset.borrowCap = borrowCap
        // } catch (err) {
        //   console.error(`${asset.cToken} error with supply/borrow caps`)
        // }

    })

}

export default useAssetCaps