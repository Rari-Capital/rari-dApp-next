import { useQueries, useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { ICERC20Delegate, IFuseERC4626 } from "lib/turbo/utils/turboContracts";
import { callInterfaceWithMulticall } from "utils/multicall";

export interface FuseERC4626Strategy {
    underlying: string;
    name: string;
    symbol: string;
    fToken: string;
    comptroller: string;
    supplyRatePerBlock: number;
}

// Data Required to render FuseERC4626 strategies
export type StrategyInfosMap = {
    [strategyAddress: string]: FuseERC4626Strategy | undefined
}

// Gets ERC4626 strategy data
export const useERC4626StrategyData = (strategy: string) => {
    const { provider } = useRari()

    const { data: strategyInfo } = useQuery(
        `Strategy info for: ${strategy}`,
        async () => {
            if (!strategy) return
            return await fetchStrategyData(provider, strategy)
        }
    );
    return strategyInfo;
};


// Gets ERC4626 strategy info for multiple strategies
export const useERC4626StrategiesDataAsMap = (strategies: string[]) => {
    const { provider } = useRari()

    const strategiesQueryResult = useQueries(
        strategies.map((strategy: string, i) => {
            return {
                queryKey: `Strategy info for: ${strategy}`,
                queryFn: () => {
                    return fetchStrategyData(provider, strategy);
                },
            };
        })
    );

    const result: StrategyInfosMap = strategiesQueryResult
        .reduce((obj: StrategyInfosMap, result, i) => {
            obj[strategies[i]] = result.data
            return { ...obj }
        }, {})

    return result ?? {}
};



const fetchStrategyData = async (provider: any, strategy: string): Promise<FuseERC4626Strategy> => {
    const [
        [name],
        [symbol],
        [fToken],
        [underlying],
        [comptroller],
    ] = await callInterfaceWithMulticall(
        provider,
        IFuseERC4626,
        strategy,
        ["name", "symbol", "cToken", "cTokenUnderlying", "unitroller"],
        [[], [], [], [], []]
    )

    const [
        [supplyRatePerBlock]
    ] = await callInterfaceWithMulticall(
        provider,
        ICERC20Delegate,
        fToken,
        ["supplyRatePerBlock"],
        [[]]
    )

    let result: FuseERC4626Strategy = {
        name,
        symbol,
        fToken,
        underlying,
        comptroller,
        supplyRatePerBlock: supplyRatePerBlock.toNumber()
    }
    return result
}