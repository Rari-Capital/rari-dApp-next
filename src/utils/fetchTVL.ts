// Vaults
import { Vaults, Fuse } from "../esm/index";

// Ethers
import { BigNumber as EthersBigNumber, constants, Contract } from "ethers";

// import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { chooseBestWeb3Provider } from "./web3Providers";

export const fetchFuseTVL = async (fuse: Fuse) => {
  console.log("fetchFuseTVL", {
    fuse,
    Contract,
    provider: chooseBestWeb3Provider(),
  });

  const res =
    await fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
      true,
      { gasLimit: 100000000000000000000000000 }
    );

  const { 2: suppliedETHPerPool } = res;

  const totalSuppliedETH = EthersBigNumber.from(
    EthersBigNumber.from(
      suppliedETHPerPool
        .reduce((a: number, b: string) => a + parseInt(b), 0)
        .toString()
    )
  );

  return totalSuppliedETH;
};

// Todo - delete this and just make `fetchFuseTVL` do this stuff
export const fetchFuseTVLBorrowsAndSupply = async (
  fuse: Fuse,
  blockNum?: number
) => {
  const { 2: suppliedETHPerPool, 3: borrowedETHPerPool } =
    await fuse.contracts.FusePoolLens.callStatic.getPublicPoolsWithData({
      gasLimit: "1000000000000000000",
    });

  let totalSuppliedETH = suppliedETHPerPool
    .reduce((a: number, b: string) => a + parseInt(b), 0)
    .toFixed(2);

  let totalBorrowedETH = borrowedETHPerPool
    .reduce((a: number, b: string) => a + parseInt(b), 0)
    .toFixed(2);

  console.log({ totalSuppliedETH, totalBorrowedETH });

  let totalSuppliedETHBN = EthersBigNumber.from(totalSuppliedETH);

  const totalBorrowedETHBN = EthersBigNumber.from(totalBorrowedETH);

  return {
    totalSuppliedETH: totalSuppliedETHBN,
    totalBorrowedETH: totalBorrowedETHBN,
  };
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
    stakedTVL,
  };
};

export const fetchTVL = async (Vaults: Vaults, fuse: Fuse) => {
  try {
    const tvls = await perPoolTVL(Vaults, fuse);

    return tvls.stableTVL
      .add(tvls.yieldTVL)
      .add(tvls.ethTVL)
      .add(tvls.daiTVL)
      .add(tvls.stakedTVL)
      .add(tvls.fuseTVL);
  } catch (err) {
    console.log({ err });
    return constants.Zero;
  }
};
