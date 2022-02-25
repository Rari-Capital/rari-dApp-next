import { Fuse } from "../esm/index";
import { USDPricedFuseAsset } from "./fetchFusePoolData";
import { isAssetETH } from "./tokenUtils";

import { Contract } from "ethers";

// Creates a CToken Contract
// Todo - refactor this into a `contractUtils.ts` file.
export const createCTokenContract = ({
  fuse,
  asset,
}: {
  fuse: Fuse;
  asset: USDPricedFuseAsset;
}) => {
  const isETH = isAssetETH(asset.underlyingToken);

  // Create the cTokenContract
  const cToken = new Contract(
    asset.cToken,
    isETH
      ? JSON.parse(
          fuse.compoundContracts["contracts/CEtherDelegate.sol:CEtherDelegate"]
            .abi
        )
      : JSON.parse(
          fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"]
            .abi
        ),
    fuse.provider.getSigner()
  );

  return cToken;
};
