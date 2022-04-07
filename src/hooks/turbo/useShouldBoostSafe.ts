import { SafeInfo } from 'lib/turbo/fetchers/safes/getSafeInfo'
import { constants } from "ethers";

const useShouldBoostSafe = (safe: SafeInfo | undefined) => {
    if (!safe) return false
    const boostMe = safe.maxBoost.gt(constants.WeiPerEther.mul(3)) && safe.safeUtilization.lt(10)
    return boostMe

}

export default useShouldBoostSafe