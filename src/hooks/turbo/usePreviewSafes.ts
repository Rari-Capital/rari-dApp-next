import { useQuery } from "react-query";
import { createTurboMaster } from "lib/turbo/utils/turboContracts";
import { useRari } from "context/RariContext";
import { providers } from "@0xsequence/multicall";
import { useSafesInfo } from "./useSafeInfo";

const SAFE_IDS = [1, 2, 1];

const usePreviewSafes = () => {
  const { provider } = useRari();

  const { data: safeAddresses } = useQuery<string[]>(
    "Preview safe addresses for indices" + SAFE_IDS.join(","),
    async () => {
      const multicallProvider = new providers.MulticallProvider(provider);
      const TurboMaster = createTurboMaster(multicallProvider);

      const settledPromises = await Promise.allSettled<string>(
        SAFE_IDS.map((id) => TurboMaster.callStatic.safes(id))
      );

      const result: string[] = settledPromises.reduce((acc: string[], obj) => {
        if (obj.status === "fulfilled") return [...acc, obj.value];
        return [...acc];
      }, []);

      return result;
    }
  );
  const safes = useSafesInfo(safeAddresses ?? []);
  return safes ?? [];
};

export default usePreviewSafes;
