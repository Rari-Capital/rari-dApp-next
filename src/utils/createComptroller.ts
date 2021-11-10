import { Fuse } from "../esm/index";
import { Contract } from "ethers";

import ERC20ABI from "../esm/Vaults/abi/ERC20.json";

export const createComptroller = (comptrollerAddress: string, fuse: Fuse) => {
  const comptroller = new Contract(
    comptrollerAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
    ),
    fuse.provider.getSigner()
  );

  return comptroller;
};

export const createUnitroller = (
  unitrollerAddress: string,
  fuse: Fuse
): Contract => {
  const unitroller = new Contract(
    unitrollerAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/Unitroller.sol:Unitroller"].abi
    ),
    fuse.provider.getSigner()
  );

  return unitroller;
};

export const createRewardsDistributor = (
  distributorAddress: string,
  fuse: Fuse
) => {
  const rewardsDistributorInstance = new Contract(
    distributorAddress,
    JSON.parse(
      fuse.compoundContracts[
        "contracts/RewardsDistributorDelegate.sol:RewardsDistributorDelegate"
      ].abi
    ),
    fuse.provider.getSigner()
  );

  return rewardsDistributorInstance;
};

export const createOracle = (
  oracleAddress: string,
  fuse: Fuse,
  type: string
): Contract => {
  const oracle = new Contract(
    oracleAddress,
    fuse.oracleContracts[type].abi,
    fuse.provider.getSigner()
  );

  return oracle;
};

export const createCToken = (fuse: Fuse, cTokenAddress: string) => {
  const cErc20Delegate = new Contract(
    cTokenAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"].abi
    ),
    fuse.provider.getSigner()
  );

  return cErc20Delegate;
};

export const createERC20 = (fuse: Fuse, cTokenAddress: string) => {
  const erc20 = new Contract(
    cTokenAddress,
    ERC20ABI as any,
    fuse.provider.getSigner()
  );
  return erc20;
};

export const createMasterPriceOracle = (fuse: Fuse) => {
  const masterPriceOracle = new Contract(
    Fuse.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle,
    fuse.oracleContracts["MasterPriceOracle"].abi,
    fuse.provider.getSigner()
  );
  return masterPriceOracle;
};
