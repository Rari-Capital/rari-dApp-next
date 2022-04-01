import { BigNumber, constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";

// (boostedAmount - debtAmount) + ((feiAmount - boostedAmount) * revShare)
export const getUserFeiOwed = (safe: SafeInfo | undefined) => {
  if (!safe) return constants.Zero;
  const { boostedAmount, debtAmount, feiAmount, tribeDAOFee } = safe;
  const boostedAmountAfterDebtRepaid = boostedAmount.sub(debtAmount);
  const yieldAccruedBySafe = feiAmount.sub(boostedAmount);

  const userShare = 1 - parseFloat(tribeDAOFee.toString()) / 1e18;
  const revShareUser = BigNumber.from(userShare * 100)

  const feiOwedForUser = boostedAmountAfterDebtRepaid.add(
    yieldAccruedBySafe.mul(revShareUser)
  ).div(100);

  return feiOwedForUser;
};
