import { useRari } from "context/RariContext";
import { isUserAuthorizedToCreateSafes } from "lib/turbo/fetchers/getIsUserAuthorizedToCreateSafes";
import { TurboAddresses } from "lib/turbo/utils/constants";
import { useQuery } from "react-query";

export const useIsUserAuthorizedToCreateSafes = () => {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    return true;
  }

  const { address, provider, chainId } = useRari();

  const { data: isAuthorized } = useQuery(
    `Is ${address} authorized to create safes`,
    async () => {
      if (!address || !chainId || !provider) return;

      const isAuthorized = await isUserAuthorizedToCreateSafes(
        provider,
        TurboAddresses[chainId].TURBO_AUTHORITY,
        address,
        TurboAddresses[chainId].MASTER
      );

      return isAuthorized;
    }
  );

  return isAuthorized;
};
