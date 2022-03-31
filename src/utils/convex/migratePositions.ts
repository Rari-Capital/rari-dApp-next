import { testForCTokenErrorAndSend } from "components/pages/Fuse/Modals/PoolModal/AmountSelect";
import BaseRewardPoolABI from "contracts/abi/ConvexBaseRewardPool.json"
import { Contract } from "ethers";
import { constants } from "ethers";
import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { callStaticWithMultiCall, encodeCall, estimateGasWithMultiCall, sendWithMultiCall } from "utils/multicall"
import { Fuse } from "../../esm";


export const unstakeAndWithdrawCVXPool = async (fuse: Fuse, baseRewardPool: string) => {
    const IBaseRewardPool = new Interface(JSON.stringify(BaseRewardPoolABI))

    const BaseRewardPool = new Contract(baseRewardPool, IBaseRewardPool, fuse.provider.getSigner())

    try {
        let estimatedGas = await BaseRewardPool.estimateGas.withdrawAllAndUnwrap(true)
        console.log({ estimatedGas })

        let result = await BaseRewardPool.callStatic.withdrawAllAndUnwrap(true)
        console.log({ result })

        let tx = await BaseRewardPool.withdrawAllAndUnwrap(true)
        console.log({ tx })

        const txConfirmed = await tx.wait(1)
        return txConfirmed;

    } catch (err) {
        console.error("Could not unstake and claim CVX Rewards")
        throw err
    }
}


/**
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
export async function checkAllowanceAndApprove(
    fuse: Fuse,
    userAddress: string,
    marketAddress: string,
    underlyingAddress: string,
    amount: BigNumber,
) {
    const erc20Interface = new Interface([
        'function allowance(address owner, address spender) public view returns (uint256 remaining)',
        'function approve(address spender, uint256 value) public returns (bool success)',
    ])

    const erc20Contract = new Contract(
        underlyingAddress,
        erc20Interface,
        fuse.provider.getSigner(userAddress)
    )

    const hasApprovedEnough = (
        await erc20Contract.callStatic.allowance(userAddress, marketAddress)
    ).gte(amount);

    if (!hasApprovedEnough) {
        const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #
        let tx = await erc20Contract.approve(marketAddress, max);
        const txConfirmed = await tx.wait(1)
        return txConfirmed;
    }
}

// Todo - remove. Will be replaced by SDK
export const deposit = async (fuse: Fuse, marketAddress: string, amount: BigNumber) => {
    const market = new Contract(
        marketAddress,
        JSON.parse(
            fuse.compoundContracts[
                "contracts/CErc20Delegate.sol:CErc20Delegate"
            ].abi),
        fuse.provider.getSigner()
    );

    let tx = await testForCTokenErrorAndSend(
        market.callStatic.mint,
        amount,
        market.mint,
        "Cannot deposit this amount right now!"
    );

    const txConfirmed = await tx.wait(1)
    console.log({txConfirmed})

    return txConfirmed
}

export const collateralize = async (fuse: Fuse, comptrollerAddress: string, marketAddresses: string[]) => {
    const comptroller = new Contract(
        comptrollerAddress,
        JSON.parse(
            fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
        ),
        fuse.provider.getSigner()
    );

    let tx = await comptroller.enterMarkets(marketAddresses);
    const txConfirmed = await tx.wait(1)
    return txConfirmed;
}

/*
Can't Multicall these :/

export const unstakeAndWithdrawStakedCVXMulti = async (fuse: Fuse, baseRewardPools: string[]) => {
    const IBaseRewardPool = new Interface(JSON.stringify(BaseRewardPoolABI))

    const encodedCalls = baseRewardPools.map(baseRewardPool => encodeCall(IBaseRewardPool, baseRewardPool, "withdrawAllAndUnwrap", [true]))
    try {
        let estimatedGas = await estimateGasWithMultiCall(fuse.provider, encodedCalls)
        console.log({ estimatedGas })

        let result = await callStaticWithMultiCall(fuse.provider, encodedCalls)
        console.log({ result })

        result = await sendWithMultiCall(fuse, encodedCalls)
        console.log({ result })

        return result

    } catch (err) {
        console.error("Could not unstake and claim CVX Rewards")
    }
}

// Todo - move elswhere
export const approveAllMarketsMulti = async (fuse: Fuse, assets: USDPricedFuseAsset[]) => {
    const MAX_APPROVAL = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #

    const IERC20 = new Interface(JSON.parse(
        fuse.compoundContracts[
            "contracts/EIP20Interface.sol:EIP20Interface"
        ].abi
    ))

    const encodedCalls = assets.map(asset => encodeCall(IERC20, asset.underlyingToken, "approve", [asset.cToken, MAX_APPROVAL]))
    try {
        let estimatedGas = await estimateGasWithMultiCall(fuse.provider, encodedCalls)
        console.log({ estimatedGas })

        let result = await callStaticWithMultiCall(fuse.provider, encodedCalls)
        console.log({ result })

        result = await sendWithMultiCall(fuse, encodedCalls)
        console.log({ result })

        return result

    } catch (err) {
        console.error("Could not unstake and claim CVX Rewards")
    }

}


export const unstakeAndWithdrawStakedCVXAndApproveCtokens = async (fuse: Fuse, baseRewardPools: string[], assets: USDPricedFuseAsset[]) => {
    const IBaseRewardPool = new Interface(JSON.stringify(BaseRewardPoolABI))
    const IERC20 = new Interface(JSON.parse(
        fuse.compoundContracts[
            "contracts/EIP20Interface.sol:EIP20Interface"
        ].abi
    ))
    const MAX_APPROVAL = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #

    let cvxEncodedCalls = baseRewardPools.map(baseRewardPool => encodeCall(IBaseRewardPool, baseRewardPool, "withdrawAllAndUnwrap", [true]))
    let approvalEncodedCalls = assets.map(asset => encodeCall(IERC20, asset.underlyingToken, "approve", [asset.cToken, MAX_APPROVAL]))
    const encodedCalls = [...cvxEncodedCalls, ...approvalEncodedCalls]

    try {
        let estimatedGas = await estimateGasWithMultiCall(fuse.provider, encodedCalls)
        console.log({ estimatedGas })

        let result = await callStaticWithMultiCall(fuse.provider, encodedCalls)
        console.log({ result })

        result = await sendWithMultiCall(fuse, encodedCalls)
        console.log({ result })

        return result

    } catch (err) {
        console.error("Could not unstake and claim CVX Rewards and Approve CTokens :( :(")
    }
}
*/