import { ChainID } from "esm/utils/networks";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useRari } from "../../context/RariContext";

export function useUnclaimedRGT() {
  const { rari, address, chainId } = useRari();

  const { data: unclaimedRGT } = useQuery(
    address + " unclaimed RGT chain " + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return undefined
      return parseFloat(
        (
          await rari.governance.rgt.distributions.getUnclaimed(address)
        ).toString()
      );
    }
  );

  const { data: privateUnclaimedRGT } = useQuery(
    address + " privateUnclaimed RGT chain " + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return undefined
      return parseFloat(
        (await rari.governance.rgt.vesting.getUnclaimed(address)).toString()
      );
    }
  );

  const { data: pool2UnclaimedRGT } = useQuery(
    address + " pool2Unclaimed RGT chain " + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return undefined
      return parseFloat(
        (
          await rari.governance.rgt.sushiSwapDistributions.getUnclaimed(address)
        ).toString()
      );
    }
  );

  return useMemo(
    () => ({
      pool2UnclaimedRGT,
      privateUnclaimedRGT,
      unclaimedRGT,
    }),
    [pool2UnclaimedRGT, privateUnclaimedRGT, unclaimedRGT]
  );
}
