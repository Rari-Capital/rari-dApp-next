import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { useBalanceOf } from "hooks/useBalanceOf";
import { FEI } from "lib/turbo/utils/constants";
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";

// Safe Balance of FEI is external to SafeInfo right now. Need to use this hook to add the safeFeiBalance
export const useUserFeiOwed = (safe: SafeInfo | undefined) => {
    const safeBalance = useBalanceOf(safe?.safeAddress, FEI)
    const claimableFromStrategies = getUserFeiOwed(safe)
    const total = claimableFromStrategies.add(safeBalance)
    return [total, claimableFromStrategies, safeBalance]
};


