import { useRari } from "context/RariContext"
import { getBoostCapsForStrategies } from "lib/turbo/fetchers/strategies/getBoostCapsForStrategies"
import { useQuery } from "react-query"

const useBoostCapsForStrategies = (strategies: string[]) => {
    const { provider } = useRari();

    const { data } = useQuery(
        `Boost caps for strategies ${strategies.join(', ')}`,
        async () => await getBoostCapsForStrategies(provider, strategies)

    )

    return data
}

export default useBoostCapsForStrategies