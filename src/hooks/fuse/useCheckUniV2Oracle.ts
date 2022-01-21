import { Contract } from "@ethersproject/contracts"
import { useRari } from "context/RariContext"
import { useQuery } from "react-query"
import UniswapV2OracleAbi  from '../../esm/Fuse/contracts/abi/UniswapTwapPriceOracleV2Root.json'

const useCheckUniV2Oracle = (address: string) => {
    const { fuse } = useRari()

    const { data: isItReady, error } = useQuery("", async () => {
        const OracleContract = new Contract(
            address,
            UniswapV2OracleAbi,
            fuse.provider
        )

        const isItReady = await OracleContract.price(
            '0x6b175474e89094c44da98b954eedeac495271d0f', // will be underlying
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // will be base token
            fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS
        )
    })

    console.log(isItReady)


}

export default useCheckUniV2Oracle