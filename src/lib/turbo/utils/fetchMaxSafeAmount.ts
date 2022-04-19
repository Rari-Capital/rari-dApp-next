import { BigNumber, constants } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { SafeInteractionMode } from "hooks/turbo/useUpdatedSafeInfo";
import { format } from "path";
import { balanceOf } from "utils/erc20Utils";
import { SafeInfo } from "../fetchers/safes/getSafeInfo";
import { USDPricedTurboSafe } from "../fetchers/safes/getUSDPricedSafeInfo";
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
  safe: USDPricedTurboSafe | undefined,
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
    let maxWithdraw;

    // If Safe Utilization is above 75%, they can't withdraw anything
    if (safe.safeUtilization.gte(75)) return constants.Zero;

    // If safe has debt, calculate the amount you can withdraw to get utilization to 75%.
    if (safe.debtAmount.gt(0)) {
      // Utillization  = maxBoost / activeBoost
      // 1. Calculate maxBoost. Denominated in dollars.
      // 74 - activeBoost
      // 100 - x
      // so...
      // 100 * activeDebt / 74 = x
      // where x is minimum maxBoost targeted.
      const debt = parseEther(safe.debtUSD.toString());
      const percentage = parseEther("100");
      const utilization = parseEther("74");
      const targetMaxBoostInUSD = debt.mul(percentage).div(utilization);

      // 2. Get minimum collateral necessary to get the targetMaxBoost, in USD.
      const minimumCollateralValueInUSD = parseEther(
        targetMaxBoostInUSD.div(safe.collateralFactor).toString()
      );

      // 3. Calculate minimum collateral denominated in TRIBE
      const minimumCollateralInTRIBE = minimumCollateralValueInUSD.div(
        parseEther(safe.collateralPriceUSD.toString())
      );

      // 4. From current deposited collateral, substract minimum collateral to get max withdrawable amount
      maxWithdraw = safe.collateralAmount.sub(
        parseEther(minimumCollateralInTRIBE.toString())
      );

     
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
      amount = maxBorrow;
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
