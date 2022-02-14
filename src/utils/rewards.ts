import { providers } from "@0xsequence/multicall";
import { Fuse } from "esm";
import { utils } from "ethers";
import { createRewardsDistributor } from "./createComptroller";
import { sendWithMultiCall } from "./multicall";

export const claimRewardsFromRewardsDistributors = async (
  fuse: Fuse,
  address: string,
  rewardsDistributors: string[]
) => {
  const encodedCalls = rewardsDistributors.map((rDAddress: string) => {
    // const rd = createRewardsDistributor(rDAddress, fuse);
    let iface = new utils.Interface(
      fuse.compoundContracts[
        "contracts/RewardsDistributorDelegate.sol:RewardsDistributorDelegate"
      ].abi
    );
    const callData = iface.encodeFunctionData("claimRewards", [address]);
    return [rDAddress, callData];

    // return rd.interface.function claimRewards(address);
  });


  const returnDatas = await sendWithMultiCall(fuse, encodedCalls, address);

  console.log({ returnDatas });
};
