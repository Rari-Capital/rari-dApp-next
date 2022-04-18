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

    // If Safe Utilization is above 75%, they can't withdraw anything
    if (safe.safeUtilization.gt(75)) return constants.Zero;

    // If safe has debt, calculate the amount you can withdraw to get utilization to 75%\
    // collateralAmount = debtValue(100)/(utilization * collateralPrice * collateralCF)
    if (safe.debtAmount.gt(0)) {
      const numerator = safe.debtValue;
      const denominator = BigNumber.from(74)
        .div(100)
        .mul(safe.collateralPrice)
        .mul(safe.collateralFactor)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther);

        let withdrawableCollateral = safe.debtValue
      //     .mul(100)
      //     .div(
      //       BigNumber.from(74)
      //         .mul(safe.collateralPrice)
      //         .mul(safe.collateralFactor)
      //         .div(constants.WeiPerEther)
      //         .div(constants.WeiPerEther)
      //     );
      console.log({ withdrawableCollateral, safe, BigNumber, numerator, denominator });
      return withdrawableCollateral;
    }
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
      amount = maxBorrow
    } else {
      amount = maxBorrow;
    }

    // // Max Amount can't be higher than Boost Cap
    // if (amount.gt(boostRemaining)) {
    //   amount = boostRemaining;
    // }

    console.log({ boostCap, totalBoosted, boostRemaining });
    return amount;
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
