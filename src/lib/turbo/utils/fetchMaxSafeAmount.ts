import { constants } from "ethers";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { balanceOf } from "utils/erc20Utils";
import { SafeInfo } from "../fetchers/safes/getSafeInfo";
import { FEI } from "./constants";
import {
  createFusePoolLensSecondary,
  createTurboComptroller,
  createTurboSafe,
} from "./turboContracts";

export async function fetchMaxSafeAmount(
  provider: any,
  mode: SafeInteractionMode,
  userAddress: string,
  safe: SafeInfo | undefined,
  chainId: number,
  strategyIndex?: number,
  limitBorrow?: boolean
) {
  if (!safe) return constants.Zero;

  if (mode === SafeInteractionMode.DEPOSIT) {
    const balance = await balanceOf(
      userAddress,
      safe.collateralAsset,
      provider
    );
    return balance;
  }

  // TODO(@sharad-s) implement after Lens func is in-place: https://github.com/fei-protocol/tribe-turbo/issues/86
  if (mode === SafeInteractionMode.WITHDRAW) {
    const turboSafe = createTurboSafe(provider, safe.safeAddress);
    const maxWithdraw = await turboSafe.callStatic.maxWithdraw(userAddress);
    return maxWithdraw;
  }

  if (mode === SafeInteractionMode.BOOST) {
    if (strategyIndex === undefined || !safe.strategies) return constants.Zero;

    const TurboComptroller = createTurboComptroller(provider, chainId);
    const FusePoolLensSecondary = createFusePoolLensSecondary(provider);

    const cToken = await TurboComptroller.callStatic.cTokensByUnderlying(FEI);

    const maxBorrow = await FusePoolLensSecondary.callStatic.getMaxBorrow(
      safe.safeAddress,
      cToken
    );
    if (!!limitBorrow) {
      return maxBorrow.mul(3).div(4);
    } else {
      return maxBorrow;
    }
  }

  // This one is unique as it is applied to a specific strategy
  if (mode === SafeInteractionMode.LESS) {
    if (strategyIndex === undefined || !safe.strategies) return constants.Zero;
    const strategy = safe.strategies[strategyIndex];
    if (!strategy) return constants.Zero;
    const maxLess = strategy.boostedAmount;
    return maxLess;
  }

  return constants.Zero;
}
