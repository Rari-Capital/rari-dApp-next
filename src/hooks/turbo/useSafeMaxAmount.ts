import { useRari } from "context/RariContext";
import { BigNumber, constants } from "ethers";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { fetchMaxSafeAmount } from "lib/turbo/utils/fetchMaxSafeAmount";
import { useQuery } from "react-query";
import { SafeInteractionMode } from "./useUpdatedSafeInfo";

const useSafeMaxAmount = (
  safe: USDPricedTurboSafe | undefined,
  mode: SafeInteractionMode,
  strategyIndex?: number //only used for LESS
) => {
  const { provider, address, chainId } = useRari();

  const { data: maxAmount } = useQuery<BigNumber | undefined>(
    `Safe ${safe?.safeAddress} Max ${mode} amount ${
      !!strategyIndex ? "Strategy " + strategyIndex : null
    }`,
    async () => {
      if (!chainId) return constants.Zero;

      return fetchMaxSafeAmount(
        provider,
        mode,
        address,
        safe,
        chainId,
        strategyIndex,
        true,
      );
    }
  );

  return maxAmount ?? constants.Zero;
};

export default useSafeMaxAmount;
