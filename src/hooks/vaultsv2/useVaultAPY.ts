import { SubgraphVault } from "lib/vaultsv2/types";
import { BigNumber } from "ethers";

// Todo - finish
const useVaultAPY = (vault: SubgraphVault | undefined) => {
  if (!vault) return "0";

  const totalStrategyHoldings = BigNumber.from(vault.totalStrategyHoldings);
  const maxLockedProfit = BigNumber.from(vault.maxLockedProfit);
  const harvestDelay = BigNumber.from(vault.harvestDelay);

  // Check against division by zero
  const remaining = totalStrategyHoldings.sub(maxLockedProfit);
  const numerator = remaining.eq(0)
    ? 0
    : Math.log(totalStrategyHoldings.div(remaining).toNumber());

  const denominator = harvestDelay.toNumber() / 3154e7;

  const apy = numerator / denominator;
  //   console.log({ x });

  return apy.toString();
};

export default useVaultAPY;
