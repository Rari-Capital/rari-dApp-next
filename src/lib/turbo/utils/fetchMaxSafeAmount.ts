import { BigNumber, constants } from "ethers";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { balanceOf } from "utils/erc20Utils";
import { SafeInfo } from "../fetchers/safes/getSafeInfo";
import { getBoostCapForStrategy } from "../fetchers/strategies/getBoostCapsForStrategies";
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
  limitBorrow?: boolean // Whether we should limit to 75%
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
    // const TurboComptroller = createTurboComptroller(provider, chainId);
    // const FusePoolLensSecondary = createFusePoolLensSecondary(provider);

    // const cToken = await TurboComptroller.callStatic.cTokensByUnderlying(FEI);
    // const collateralCToken =
    //   await TurboComptroller.callStatic.cTokensByUnderlying(
    //     safe.collateralAsset
    //   );

    // const maxWithdraw = await FusePoolLensSecondary.callStatic.getMaxRedeem(
    //   safe.safeAddress,
    //   collateralCToken
    // );

    // console.log({
    //   cToken,
    //   collateralCToken,
    //   maxWithdraw,
    //   FusePoolLensSecondary,
    // });

    return maxWithdraw;
  }

  if (mode === SafeInteractionMode.BOOST) {
    if (strategyIndex === undefined || !safe.strategies) return constants.Zero;

    const TurboComptroller = createTurboComptroller(provider, chainId);
    const FusePoolLensSecondary = createFusePoolLensSecondary(provider);

    const cToken = await TurboComptroller.callStatic.cTokensByUnderlying(FEI);

    // Safe's Max Borrow
    const maxBorrow = await FusePoolLensSecondary.callStatic.getMaxBorrow(
      safe.safeAddress,
      cToken
    );

    // Strategy Boost Cap
    const [boostCap, totalBoosted, boostRemaining] =
      await getBoostCapForStrategy(
        provider,
        safe.strategies[strategyIndex].strategy
      );

    console.log({ boostCap, totalBoosted, boostRemaining });

    // Prevent rekt
    let amount: BigNumber;
    if (!!limitBorrow) {
      amount = maxBorrow.mul(3).div(4);
    } else {
      amount = maxBorrow;
    }

    // Max Amount can't be higher than Boost Cap
    if (amount.gt(boostRemaining)) {
      amount = boostRemaining;
    }

    console.log({ boostCap, totalBoosted, boostRemaining });
    return amount
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
