import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";

export const useHasSushiswapRewardsStarted = () => {
  const { rari, chainId } = useRari();

  const { data: hasStarted } = useQuery(
    "hasSushiswapRewardsStarted" + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return false;
      const block = await rari.provider.getBlockNumber();

      const startingBlock =
        rari.governance.rgt.sushiSwapDistributions.DISTRIBUTION_START_BLOCK;

      return block >= startingBlock;
    }
  );

  return hasStarted;
};
