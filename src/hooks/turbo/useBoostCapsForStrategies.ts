import { useRari } from "context/RariContext"
import { getBoostCapForStrategy, getBoostCapsForStrategies } from "lib/turbo/fetchers/strategies/getBoostCapsForStrategies"
import { useQuery } from "react-query"

const useBoostCapsForStrategies = (strategies: string[]) => {
    const { provider } = useRari();

    const { data } = useQuery(
        `Boost caps for strategies ${strategies.join(', ')}`,
        async () => await getBoostCapsForStrategies(provider, strategies)

    )

    return data
}

export const useBoostCapForStrategy = (strategy: string | undefined) => {
    const { provider } = useRari();

    const { data } = useQuery(
        `Boost caps for strategy ${strategy}`,
        async () => {
            if (!strategy) return
            return await getBoostCapForStrategy(provider, strategy)
        }
    )

    return data
}

export default useBoostCapsForStrategies