import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { BigNumber, constants } from "ethers";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { calculateETHValueUSD } from "lib/turbo/utils/usdUtils";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { calculateSafeUtilization } from "lib/turbo/fetchers/safes/getSafeInfo";

export enum SafeInteractionMode {
    DEPOSIT = "Deposit",
    WITHDRAW = "Withdraw",
    BOOST = "Boost",
    LESS = "Less",
}


// Preivews a safe position based on action taken and amount
export const useUpdatedSafeInfo = ({
    mode,
    safe,
    amount
}: {
    mode: SafeInteractionMode,
    safe: USDPricedTurboSafe | undefined,
    amount: BigNumber
}): USDPricedTurboSafe | undefined => {
    const { provider, chainId } = useRari();

    // TODO(@nathanhleung): Possibly find ways to optimize this query
    const { data: updatedSafeInfo } = useQuery(
        `Updated safe info for ${safe?.safeAddress} for mode ${mode} and amount ${amount.toString()}`,
        async () => {

            console.log(`Updated safe info for ${safe?.safeAddress} for mode ${mode} and amount ${amount.toString()}`)

            if (!provider || !chainId || !safe) return;

            const ethUSDBN = await getEthUsdPriceBN()

            let updatedSafe: USDPricedTurboSafe;
            if (mode === SafeInteractionMode.DEPOSIT) {

                const collateralAmount = safe.collateralAmount.add(amount)
                const collateralValue = collateralAmount
                    .mul(safe.collateralPrice)
                    .div(constants.WeiPerEther)
                const collateralUSD = calculateETHValueUSD(collateralValue, ethUSDBN)
                const safeUtilization = calculateSafeUtilization(safe.debtValue, collateralValue)

                updatedSafe = {
                    ...safe,
                    collateralAmount,
                    collateralValue,
                    collateralUSD,
                    safeUtilization
                }

                console.log({ collateralAmount, safe, updatedSafe, ethUSDBN, amount })

                return updatedSafe
            }

        }
    );

    return updatedSafeInfo
};
