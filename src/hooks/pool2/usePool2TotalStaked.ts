import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { fromWei } from "utils/ethersUtils";
import { ChainID } from "esm/utils/networks";

export const usePool2TotalStaked = () => {
  const { rari, chainId } = useRari();

  const { data: totalStaked } = useQuery(
    "pool2TotalStaked " + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return 0;
      return parseFloat(
        fromWei(
          await rari.governance.rgt.sushiSwapDistributions.totalStakedUsd()
        )
      );
    }
  );

  return totalStaked;
};
