import { Fuse } from "esm";
import { createRewardsDistributor } from "./createComptroller";
import { sendWithMultiCall } from "./multicall";

export const claimRewardsFromRewardsDistributors = async (
  fuse: Fuse,
  address: string,
  rewardsDistributors: string[]
) => {
  const methods = rewardsDistributors.map((rDAddress: string) => {
    const rd = createRewardsDistributor(rDAddress, fuse);
    console.log({ rd }, rd.address);
    return rd.claimRewards(address);
  });

  const addrs = rewardsDistributors;
  alert("YO2");

  const encodedCalls = methods.map((m, i) => {
    return [addrs[i], m.encodeABI()];
  });

  console.log({ encodedCalls });

  // const returnDatas = await sendWithMultiCall(fuse.web3, encodedCalls, address);
};
