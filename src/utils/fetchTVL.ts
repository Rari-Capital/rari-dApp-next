// Vaults
import { Vaults, Fuse } from "../esm/index";

// Ethers
import { BigNumber, constants } from "ethers";

import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { ChainID } from "esm/utils/networks";

export const fetchFuseTVL = async (fuse: Fuse) => {
  try {
    const res =
      await fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
        true
      );

    const { 2: poolsData } = res;

    const suppliedETHPerPool = poolsData.map(
      (poolData: any) => poolData.totalSupply
    );

    const totalSuppliedETH = suppliedETHPerPool.reduce(
      (a: BigNumber, b: BigNumber) => a.add(b),
      constants.Zero
    );

    // console.log("4 - Tried FusePoolLens pools call", { totalSuppliedETH, fuse });

    return totalSuppliedETH ?? constants.Zero;
  } catch (err: any) {
    console.error("Error retrieving fuseTVL: " + err.message);
    return constants.Zero;
  }
};

export const perPoolTVL = async (
  Vaults: Vaults,
  fuse: Fuse,
  chainId: ChainID
) => {
  const [stableTVL, yieldTVL, ethTVLInETH, daiTVL] = await Promise.all([
    Vaults.pools.stable.balances.getTotalSupply(),
    Vaults.pools.yield.balances.getTotalSupply(),
    Vaults.pools.ethereum.balances.getTotalSupply(),
    Vaults.pools.dai.balances.getTotalSupply(),
  ]);

  const stakedTVL =
    chainId === 1
      ? await Vaults.governance.rgt.sushiSwapDistributions.totalStakedUsd()
      : constants.Zero;

  const ethPriceBN = await getEthUsdPriceBN();

  // console.log("PER POOL TVL");

  const fuseTVLInETH = await fetchFuseTVL(fuse);

  // console.log("PER POOL TVL", { fuseTVLInETH });


  // const ethUSDBN = (ethPriceBN ?? constants.Zero).div(constants.WeiPerEther);
  const ethTVL = (ethTVLInETH ?? constants.Zero).mul(ethPriceBN).div(constants.WeiPerEther);
  const fuseTVL = (fuseTVLInETH ?? constants.Zero).mul(ethPriceBN).div(constants.WeiPerEther);

  return {
    stableTVL,
    yieldTVL,
    ethTVL,
    daiTVL,
    fuseTVL,
    stakedTVL,
  };
};

export const fetchTVL = async (
  Vaults: Vaults,
  fuse: Fuse,
  chainId?: ChainID
): Promise<BigNumber> => {
  if (!chainId) return constants.Zero;
  try {
    const tvls = await perPoolTVL(Vaults, fuse, chainId);
    const total = tvls.stableTVL
      .add(tvls.yieldTVL)
      .add(tvls.ethTVL)
      .add(tvls.daiTVL)
      .add(tvls.stakedTVL)
      .add(tvls.fuseTVL)
      .div(constants.WeiPerEther)
    return total;
  } catch (err) {
    console.log({ err });
    return constants.Zero;
  }
};
