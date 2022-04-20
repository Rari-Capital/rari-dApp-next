import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { createTurboSafe } from "lib/turbo/utils/turboContracts";
import { getAllSafes } from "lib/turbo/fetchers/safes/getAllSafes";

// Trusted Strategies will be independent of any Safe and whitelisted by TRIBE Governance
export const useAllSafes = (): any => {
    const { provider, chainId } = useRari();

    const { data: safeOwner } = useQuery(
        `All safes`,
        async () => {
            if (!provider || !chainId) return;
            const answer = await getAllSafes(provider, chainId)
            console.log(answer)
            return answer
        }
    );

    return safeOwner
};