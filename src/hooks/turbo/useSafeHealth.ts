import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";

const useSafeHealth = (safe: SafeInfo | undefined) => {
  if (!safe) return;

  const utilization = safe.debtValue.mul(100).div(safe.collateralValue)
  return utilization;
};

export default useSafeHealth;
