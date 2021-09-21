import { Fuse } from "../esm/index"
import { Contract } from 'ethers';

export const createComptroller = (comptrollerAddress: string, fuse: Fuse) => {
  const comptroller = new Contract(
    comptrollerAddress,
    JSON.parse( fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi),
    fuse.provider.getSigner()
  );

  return comptroller;
};
