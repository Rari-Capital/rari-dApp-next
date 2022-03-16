import { useQuery } from "react-query"
import { useRari } from "context/RariContext"
import { BigNumber, Contract } from "ethers"
import { Interface, parseUnits } from "ethers/lib/utils"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData"
import { isAssetETH } from "utils/tokenUtils"


const useHasApproval = (market: USDPricedFuseAsset, amount: string) => {
    const { fuse, address } = useRari()
    const { provider } = fuse

    const { data } = useQuery(`${address} has approval for ${market?.underlyingSymbol}`, async () => {
        if (!address || !market) return false
        let _amount = parseUnits(amount, market.underlyingDecimals)
        return await checkAllowance(address, market.cToken, market.underlyingToken, _amount, provider)
    })
    return data ?? false
}

export default useHasApproval

export async function checkAllowance(
    userAddress: string,
    marketAddress: string,
    underlyingAddress: string,
    amount: BigNumber,
    provider: any
) {
    if (isAssetETH(underlyingAddress)) return

    const erc20Interface = new Interface([
        'function allowance(address owner, address spender) public view returns (uint256 remaining)',
        'function approve(address spender, uint256 value) public returns (bool success)',
    ])

    const erc20Contract = new Contract(
        underlyingAddress,
        erc20Interface,
        provider.getSigner(userAddress)
    )

    const hasApproval = (
        await erc20Contract.callStatic.allowance(userAddress, marketAddress)
    ).gte(amount);

    return hasApproval

}