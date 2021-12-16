import { SubgraphVault } from "lib/vaultsv2/types";
import { BigNumber } from "ethers";

// Todo - finish
const useVaultAPY = (vault: SubgraphVault | undefined) => {
  if (!vault) return "0";

  const totalStrategyHoldings = BigNumber.from(vault.totalStrategyHoldings);
  const maxLockedProfit = BigNumber.from(vault.maxLockedProfit);
  const harvestDelay = BigNumber.from(vault.harvestDelay);

  const numerator = Math.log(
    totalStrategyHoldings
      .div(totalStrategyHoldings.sub(maxLockedProfit))
      .toNumber()
  );

  const denominator = harvestDelay.toNumber() / 3154e7;

  const apy = numerator / denominator;
  //   console.log({ x });

  return apy.toString();
};

export default useVaultAPY;
