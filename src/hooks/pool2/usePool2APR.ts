import { useQuery } from "react-query";
import { useRari } from "context/RariContext";

import { utils } from 'ethers';

export const usePool2APR = () => {
  const { rari } = useRari();

  const { data: earned } = useQuery("pool2APR", async () => {
    const blockNumber = await rari.provider.getBlockNumber();
    const tvl = await rari.governance.rgt.sushiSwapDistributions.totalStakedUsd();
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
