import { providers } from "@0xsequence/multicall";
import { useRari } from "context/RariContext";
import { useQuery } from "react-query";

import BaseRewardPoolABI from "contracts/abi/ConvexBaseRewardPool.json"
import { CONVEX_CTOKEN_INFO } from "constants/convex";
import { Contract } from "ethers";
import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils";

export type StakedConvexBalancesMap = {
    [cToken: string]: {
        balance: BigNumber,
        baseRewardsPool: string
    }
}


/* For Staked CVX positions - there's no ERC20 to query balance for */
export const useStakedConvexBalances = (): StakedConvexBalancesMap => {
    const { fuse, address, isAuthed } = useRari();
    const multiCallProvider = new providers.MulticallProvider(fuse.provider)
    const { data: stakedConvexBalances } = useQuery<StakedConvexBalancesMap | undefined>(
        ' staked convex balances for ' + address,
        async () => {
            if (!isAuthed) return undefined

            let map: StakedConvexBalancesMap = {}

            await Promise.all(Object.values(CONVEX_CTOKEN_INFO)
                .map(c => ({ baseRewardsPool: c.rewardsContract, cToken: c.cToken }))
                .map(({ baseRewardsPool, cToken }) => {
                    let contract = new Contract(baseRewardsPool, BaseRewardPoolABI as any, multiCallProvider)
                    return contract.balanceOf(address)
                        .then((balance: BigNumber) => {
                            if (!balance.isZero()) {
                                map[cToken] = {
                                    balance,
                                    baseRewardsPool,
                                }
                            }
                        })
                        .catch((_err: any) => { })
                }
                ))

            console.log({ map })

            return map
        },
        {
            enabled: !!address ? true : false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    )

    // const hasBalances = 

    return stakedConvexBalances ?? {}

}


type BalancesMap = {
    [token: string]: BigNumber
}

const IERC20 =  new Interface([
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function balanceOf(address _owner) public view returns (uint256 balance)',
]) 

export const useCurveLPBalances = (): BalancesMap => {
    

    const { fuse, address, isAuthed } = useRari();
    const multiCallProvider = new providers.MulticallProvider(fuse.provider)

    const { data: curveLPBalances } = useQuery<BalancesMap | undefined>(
        ' curve convex balances for ' + address,
        async () => {

            if (!isAuthed) return undefined

            let map: BalancesMap = {}

            await Promise.all(
                Object.values(CONVEX_CTOKEN_INFO)
                    .map(c => ({ curveLPToken: c.lpToken }))
                    .map(({ curveLPToken }) => {
                        let contract = new Contract(curveLPToken, IERC20, multiCallProvider)
                        return contract.balanceOf(address)
                            .then((balance: BigNumber) => {
                                if (!balance.isZero()) {
                                    map[curveLPToken] = balance
                                }
                            })
                            .catch((_err: any) => { })
                    }
                    ))
            return map
        },
        {
            enabled: !!address ? true : false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    )


    console.log({curveLPBalances})
    // const hasBalances = 

    return curveLPBalances ?? {}

}


