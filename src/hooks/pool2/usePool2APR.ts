import { useQuery } from "react-query";
import { useRari } from "context/RariContext";

import { utils } from "ethers";
import { ChainID } from "esm/utils/networks";

export const usePool2APR = () => {
  const { rari, chainId } = useRari();

  const { data: earned } = useQuery("pool2APR chainId " + chainId, async () => {
    if (chainId !== ChainID.ETHEREUM) return "?";
    const blockNumber = await rari.provider.getBlockNumber();
    const tvl =
      await rari.governance.rgt.sushiSwapDistributions.totalStakedUsd();
    return (
      parseInt(
        utils.formatEther(
          await rari.governance.rgt.sushiSwapDistributions.getCurrentApr(
            blockNumber,
            tvl
          )
        )
      ) / 1e16
    ).toFixed(2);
  });

  return earned;
};
