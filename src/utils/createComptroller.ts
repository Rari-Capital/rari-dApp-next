import { Fuse } from "../esm/index";
import { Contract } from "ethers";

import ERC20ABI from "../esm/Vaults/abi/ERC20.json";

export const useCreateComptroller = (comptrollerAddress: string, fuse: Fuse, isAuthed: boolean) => {
  const comptroller = new Contract(
    comptrollerAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
    ),
    isAuthed ? fuse.provider.getSigner() : fuse.provider
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
  type: string,
  special?: boolean
): Contract => {
  const provider = special ? fuse.provider : fuse.provider.getSigner()
  const oracle = new Contract(
    oracleAddress,
    fuse.oracleContracts[type].abi,
    provider
  );

  return oracle;
};

export const createCToken = (fuse: Fuse, cTokenAddress: string, special?: boolean) => {
  const provider = special ? fuse.provider : fuse.provider.getSigner()
  const cErc20Delegate = new Contract(
    cTokenAddress,
    JSON.parse(
      fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"].abi
    ),
    provider
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

export const createMasterPriceOracle = (fuse: Fuse, special?: boolean) => {
  const provider = special ? fuse.provider : fuse.provider.getSigner()
  const masterPriceOracle = new Contract(
    fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle,
    fuse.oracleContracts["MasterPriceOracle"].abi,
    provider
  );
  return masterPriceOracle;
};
