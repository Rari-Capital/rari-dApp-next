// Vaults
import { Vaults, Fuse } from "../esm/index";

// Ethers
import { BigNumber as EthersBigNumber, constants } from "ethers";

import BigNumber from "bignumber.js";

export const fetchFuseTVL = async (fuse: Fuse) => {
  console.log({ fuse });

  const res =
    await fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
      true
    );

  const { 2: suppliedETHPerPool } = res;

  const totalSuppliedETH = EthersBigNumber.from(
    new BigNumber(
      suppliedETHPerPool
        .reduce((a: number, b: string) => a + parseInt(b), 0)
        .toString()
    ).toFixed(0)
  );

  console.log(totalSuppliedETH.toString());

  return totalSuppliedETH;
};

// Todo - delete this and just make `fetchFuseTVL` do this stuff
export const fetchFuseTVLBorrowsAndSupply = async (
  fuse: Fuse,
  blockNum?: number
) => {
  const { 2: suppliedETHPerPool, 3: borrowedETHPerPool } =
    await fuse.contracts.FusePoolLens.methods
      .getPublicPoolsWithData()
      .call({ gas: 1e18 }, blockNum);

  const totalSuppliedETH = EthersBigNumber.from(
    new BigNumber(
      suppliedETHPerPool
        .reduce((a: number, b: string) => a + parseInt(b), 0)
        .toString()
    ).toFixed(0)
  );

  const totalBorrowedETH = EthersBigNumber.from(
    new BigNumber(
      borrowedETHPerPool
        .reduce((a: number, b: string) => a + parseInt(b), 0)
        .toString()
    ).toFixed(0)
  );

  return { totalSuppliedETH, totalBorrowedETH };
};

export const perPoolTVL = async (Vaults: Vaults, fuse: Fuse) => {
  const [
    stableTVL,
    yieldTVL,
    ethTVLInETH,
    daiTVL,
    ethPriceBN,
    stakedTVL,
    fuseTVLInETH,
  ] = await Promise.all([
    Vaults.pools.stable.balances.getTotalSupply(),
    Vaults.pools.yield.balances.getTotalSupply(),
    Vaults.pools.ethereum.balances.getTotalSupply(),
    Vaults.pools.dai.balances.getTotalSupply(),
    Vaults.getEthUsdPriceBN(),
    Vaults.governance.rgt.sushiSwapDistributions.totalStakedUsd(),
    fetchFuseTVL(fuse),
  ]);

  // console.log({
  //   stableTVL,
  //   yieldTVL,
  //   ethTVLInETH,
  //   daiTVL,
  //   ethPriceBN,
  //   stakedTVL,
  //   fuseTVLInETH,
  // });

  const ethUSDBN = ethPriceBN.div(constants.WeiPerEther);

  const ethTVL = ethTVLInETH.mul(ethUSDBN);
  const fuseTVL = fuseTVLInETH.mul(ethUSDBN);

  return {
    stableTVL,
    yieldTVL,
    ethTVL,
    daiTVL,
    fuseTVL,
    stakedTVL
  };
};

export const fetchTVL = async (Vaults: Vaults, fuse: Fuse) => {
  const tvls = await perPoolTVL(Vaults, fuse);

  return tvls.stableTVL
    .add(tvls.yieldTVL)
    .add(tvls.ethTVL)
    .add(tvls.daiTVL)
    .add(tvls.stakedTVL)
    .add(tvls.fuseTVL);
};
