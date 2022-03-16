import { providers } from "@0xsequence/multicall";
import { useRari } from "context/RariContext";
import { useQuery } from "react-query";

import BaseRewardPoolABI from "contracts/abi/ConvexBaseRewardPool.json"
import { CONVEX_CTOKEN_INFO } from "constants/convex";
import { Contract } from "ethers";
import { BigNumber } from "ethers";

export type StakedConvexBalancesMap = {
    [cToken: string]: {
        balance: BigNumber,
        baseRewardsPool: string
    }
}

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

                console.log({map})

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


