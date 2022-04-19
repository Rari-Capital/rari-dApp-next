import { useRari } from "context/RariContext";
import { BigNumber } from "ethers";
import { createTurboBooster } from "lib/turbo/utils/turboContracts";
import { useQuery } from "react-query";

const useCollateralBoostCap = (token: string | undefined) => {
  const { provider } = useRari();
  const { data: boostCap } = useQuery<BigNumber | undefined>(
    "Turbo collateral boost cap for asset " + token,
    async () => {
      if (!token) return;
      return await getBoostCapForCollateral(provider, token);
    }
  );
  return boostCap
};

const getBoostCapForCollateral = async (
  provider: any,
  token: string
): Promise<BigNumber> => {
  const Booster = createTurboBooster(provider, 1);
  return await Booster.callStatic.getBoostCapForCollateral(token);
};

export default useCollateralBoostCap;
