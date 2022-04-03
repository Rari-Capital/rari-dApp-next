

import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { balanceOf } from "utils/erc20Utils";
import { SafeInfo } from "../fetchers/safes/getSafeInfo";

export async function fetchMaxSafeAmount(
    provider: any,
    mode: SafeInteractionMode,
    userAddress: string,
    safe: SafeInfo | undefined,
    strategyIndex?: number,
) {
    if (!safe) return constants.Zero

    if (mode === SafeInteractionMode.DEPOSIT) {
        const balance = await balanceOf(
            userAddress,
            safe.collateralAsset,
            provider
        );
        return balance
    }

    // TODO(@sharad-s) implement after Lens func is in-place: https://github.com/fei-protocol/tribe-turbo/issues/86
    if (mode === SafeInteractionMode.WITHDRAW) {
        return parseEther("1")
    }
    // TODO(@sharad-s) implement after Lens func is in-place: https://github.com/fei-protocol/tribe-turbo/issues/86
    if (mode === SafeInteractionMode.BOOST) {
        const maxBoost = parseEther("1")
        return maxBoost
    }

    // This one is unique as it is applied to a specific strategy
    if (mode === SafeInteractionMode.LESS) {
        if (strategyIndex === undefined || !safe.strategies) return constants.Zero;
        const strategy = safe.strategies[strategyIndex]
        if (!strategy) return constants.Zero;
        const maxLess = strategy.boostedAmount
        return maxLess
    }

    return constants.Zero
}