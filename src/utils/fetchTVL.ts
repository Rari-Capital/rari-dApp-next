// Vaults
import { Vaults, Fuse } from "../esm/index";

// Ethers
import {
  BigNumber,
  BigNumber as EthersBigNumber,
  constants,
  Contract,
} from "ethers";

import { chooseBestWeb3Provider } from "./web3Providers";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

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

    console.log("4 - Tried FusePoolLens pools call", { totalSuppliedETH, fuse });

    return totalSuppliedETH ?? constants.Zero;
  } catch (err: any) {
    console.error("Error retrieving fuseTVL: " + err.message);
    return constants.Zero;
  }
};

// Todo - delete this and just make `fetchFuseTVL` do this stuff
export const fetchFuseTVLBorrowsAndSupply = async (
  fuse: Fuse,
  blockNum?: number
) => {
  const { 2: suppliedETHPerPool, 3: borrowedETHPerPool } =
    await fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
      true
    );

  let totalSuppliedETH = suppliedETHPerPool
    .reduce((a: number, b: string) => a + parseInt(b), 0)
    .toFixed(2);

  let totalBorrowedETH = borrowedETHPerPool
    .reduce((a: number, b: string) => a + parseInt(b), 0)
    .toFixed(2);


  let totalSuppliedETHBN = EthersBigNumber.from(totalSuppliedETH);

  const totalBorrowedETHBN = EthersBigNumber.from(totalBorrowedETH);

  return {
    totalSuppliedETH: totalSuppliedETHBN,
    totalBorrowedETH: totalBorrowedETHBN,
  };
};

export const perPoolTVL = async (Vaults: Vaults, fuse: Fuse) => {
  // const [stableTVL, yieldTVL, ethTVLInETH, daiTVL, ethPriceBN, stakedTVL] =
  //   await Promise.all([
  //     Vaults.pools.stable.balances.getTotalSupply(),
  //     Vaults.pools.yield.balances.getTotalSupply(),
  //     Vaults.pools.ethereum.balances.getTotalSupply(),
  //     Vaults.pools.dai.balances.getTotalSupply(),
  //     Vaults.getEthUsdPriceBN(),
  //     Vaults.governance.rgt.sushiSwapDistributions.totalStakedUsd(),
  //   ]);

  const ethUSDBN =  await getEthUsdPriceBN();

  // console.log("PER POOL TVL");

  const fuseTVLInETH = await fetchFuseTVL(fuse);

  // console.log("PER POOL TVL", { fuseTVLInETH });

  // console.log({
  //   stableTVL,
  //   yieldTVL,
  //   ethTVLInETH,
  //   daiTVL,
  //   ethPriceBN,
  //   stakedTVL,
  //   fuseTVLInETH,
  // });

  // const ethUSDBN = (ethPriceBN ?? constants.Zero).div(constants.WeiPerEther);
  // const ethTVL = (ethTVLInETH ?? constants.Zero).mul(ethUSDBN);
  const fuseTVL = (fuseTVLInETH ?? constants.Zero).mul(ethUSDBN);

  return {
    // stableTVL,
    // yieldTVL,
    // ethTVL,
    // daiTVL,
    fuseTVL,
    // stakedTVL,
  };
};

export const fetchTVL = async (Vaults: Vaults, fuse: Fuse) => {
  try {
    const tvls = await perPoolTVL(Vaults, fuse);
    console.log({ tvls });

    return tvls.fuseTVL;

    // return tvls.stableTVL
    //   .add(tvls.yieldTVL)
    //   .add(tvls.ethTVL)
    //   .add(tvls.daiTVL)
    //   .add(tvls.stakedTVL)
    //   .add(tvls.fuseTVL);
  } catch (err) {
    console.log({ err });
    return constants.Zero;
  }
};
