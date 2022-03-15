import { tokenInfo } from 'constants/convex';
import { useRari } from 'context/RariContext'
import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useQuery } from 'react-query';
import { filterOnlyObjectProperties } from 'utils/fetchFusePoolData';
import { callStaticWithMultiCall, decodeCall, encodeCall } from 'utils/multicall';

export const useConvexPoolSuppliedCTokens = (comptrollerAddress: string) => {
    const { address, fuse } = useRari();

    const { data: suppliedMarkets } = useQuery(`Pool ${comptrollerAddress}  CTokens User ${address}`, async () => {

        const markets = Object.values(tokenInfo).map((value => value.cToken))

        const IComptroller = new Interface(JSON.parse(
            fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"].abi
        ))

        const encodedCalls = markets.map(
            (market) => encodeCall(IComptroller, market, "balanceOfUnderlying", [address])
        )


        const { returnData } = filterOnlyObjectProperties(await callStaticWithMultiCall(fuse.provider, encodedCalls))


        const suppliedMarkets = markets.filter(
            (_, i) => {
                let [balance]: [BigNumber] = decodeCall(IComptroller, "balanceOfUnderlying", returnData[i])
                return !balance.isZero()
            }
        )

        const stethIndex = suppliedMarkets.indexOf('0xe71b4Cb8A99839042C45CC4cAca31C85C994E79f')

        if (stethIndex !== -1) {
            suppliedMarkets.push(suppliedMarkets.splice(stethIndex, 1)[0]);
        }

        // const result = await fuse.contracts.FusePoolLens.callStatic.getPoolUserSummary(comptroller, address)
        return suppliedMarkets
    })


    return suppliedMarkets
}