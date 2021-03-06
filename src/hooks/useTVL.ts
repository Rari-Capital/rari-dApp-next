import { useCallback } from "react";
import { useRari } from "../context/RariContext";
import { fetchTVL } from "../utils/fetchTVL";
import useVaultsSDK from "./vaults/useVaultsSDK";

export const useTVLFetchers = () => {
  const { fuse, chainId } = useRari();
  const { rari } = useVaultsSDK();

  const getTVL = useCallback(
    () => fetchTVL(rari, fuse, chainId),
    [rari, fuse, chainId]
  );

  const getNumberTVL = useCallback(async () => {
    return parseFloat((await getTVL()).toString());
  }, [rari, getTVL, chainId]);

  return { getNumberTVL, getTVL };
};
