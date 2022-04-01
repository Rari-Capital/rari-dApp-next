import { BigNumber, constants } from "ethers"
import { formatEther } from "ethers/lib/utils"


export const calculateETHValueUSD = (ethValueBN: BigNumber, ethUSDBN: BigNumber) => parseFloat(
    formatEther(ethValueBN
        .mul(ethUSDBN)
        .div(constants.WeiPerEther))
)

export const calculateFEIValueUSD = (
    feiAmountBN: BigNumber,
    feiPriceBN: BigNumber,
    ethUSDBN: BigNumber) => parseFloat(
        formatEther(
            feiAmountBN
                .mul(feiPriceBN)
                .mul(ethUSDBN)
                .div(constants.WeiPerEther)
                .div(constants.WeiPerEther)
        )
    )



