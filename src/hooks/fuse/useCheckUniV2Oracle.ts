import { Contract } from "@ethersproject/contracts"
import { useRari } from "context/RariContext"
import { ChainID } from "esm/utils/networks"
import { useQuery } from "react-query"
import UniswapV2OracleAbi  from '../../esm/Fuse/contracts/abi/UniswapTwapPriceOracleV2Root.json'

const useCheckUniV2Oracle = (underlying: string, baseToken: string) => {
    const { fuse, chainId } = useRari()

    const { data: isItReady, error } = useQuery(`Checking Twap Oracle for ${underlying} ${baseToken} ${fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS} `, async () => {
        
        // Its interpreted as sushiswap on arbitrum. 
        const OracleContract = new Contract(
            fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS,
            UniswapV2OracleAbi,
            fuse.provider
        )
            console.log('before')
        const isItReady = await OracleContract.callStatic.price(
            underlying, // will be underlying
            baseToken, // will be base token
            fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS
        )

        console.log({isItReady})

        return !!isItReady
    }, {
        // Refetch the data every second
        refetchInterval: 1000,
      })

    console.log({isItReady})

    return isItReady

}

export default useCheckUniV2Oracle