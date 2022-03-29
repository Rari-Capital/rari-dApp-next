import { BigNumber, constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";

const useSafeHealth = (safe: SafeInfo | undefined) => {
  if (!safe) return;
  if (safe.collateralValue.isZero()) return constants.Zero;

  const utilization = safe.debtValue.mul(100).div(safe.collateralValue);
  // return BigNumber.from(90)
  return utilization;
};

export default useSafeHealth;
