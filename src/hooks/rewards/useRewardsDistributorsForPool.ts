import { useRari } from "context/RariContext";
import { Contract } from "ethers";
import { useQuery } from "react-query";
import { createComptroller } from "utils/createComptroller";

export interface RewardsDistributor {
  address: string;
  rewardToken: string;
  admin: string;
}

export const useRewardsDistributorsForPool = (
  comptrollerAddress?: string
): RewardsDistributor[] => {
  const { fuse } = useRari();

  const { data, error } = useQuery(
    comptrollerAddress + " rewardsDistributors",
    async () => {
      if (!comptrollerAddress) return [];
      const comptroller = createComptroller(comptrollerAddress, fuse);

      console.log({ comptroller });

      const rewardsDistributors: string[] =
        await comptroller.callStatic.getRewardsDistributors();

      console.log({ rewardsDistributors });

      if (!rewardsDistributors.length) return [];

      const distributors: RewardsDistributor[] = await Promise.all(
        rewardsDistributors.map(async (addr) => {
          const distributor = new Contract(
            addr,
            JSON.parse(
              fuse.compoundContracts[
                "contracts/RewardsDistributorDelegate.sol:RewardsDistributorDelegate"
              ].abi
            ),
            fuse.provider.getSigner()
          );

          console.log({ addr, distributor });

          const ret = {
            address: addr,
            rewardToken: await distributor.callStatic.rewardToken(),
            admin: await await distributor.callStatic.admin(),
          };
          return ret;
        })
      );

      return distributors;
    }
  );
  return data ?? [];
};
