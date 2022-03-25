import { BigNumber, constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";

export const getUserFeiOwed = (safe: SafeInfo | undefined) => {
  if (!safe) return constants.Zero;
  console.log({ safe });
  const { boostedAmount, debtAmount, feiAmount, tribeDAOFee } = safe;
  const boostedAmountAfterDebtRepaid = boostedAmount.sub(debtAmount);
  const yieldAccruedBySafe = feiAmount.sub(boostedAmount);

  const userShare = 1 - parseFloat(safe.tribeDAOFee.toString()) / 1e18;
  const revShareUser = BigNumber.from(userShare * 100)

  // console.log({
  //   boostedAmountAfterDebtRepaid,
  //   yieldAccruedBySafe,
  //   revShareUser,
  // });
  const feiOwedForUser = boostedAmountAfterDebtRepaid.add(
    yieldAccruedBySafe.mul(revShareUser)
  ).div(100);

  // console.log({feiOwedForUser})
  return feiOwedForUser;
};
