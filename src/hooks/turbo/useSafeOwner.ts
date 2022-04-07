import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { createTurboSafe } from "lib/turbo/utils/turboContracts";

// Trusted Strategies will be independent of any Safe and whitelisted by TRIBE Governance
export const useSafeOwner = (safeAddress: string): string => {
    const { provider, chainId } = useRari();

    const { data: safeOwner } = useQuery(
        `Safe owner for safe ${safeAddress}`,
        async () => {
            if (!provider || !chainId) return;
            const safe = createTurboSafe(provider, safeAddress)
            return await safe.callStatic.owner()
        }
    );

    return safeOwner
};

export const useUserIsSafeOwner = (safeAddress: string): boolean => {
    const { address } = useRari();
    const owner = useSafeOwner(safeAddress)
    return !!address && address === owner
}