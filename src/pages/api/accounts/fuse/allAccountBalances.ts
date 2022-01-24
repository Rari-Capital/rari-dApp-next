// Hooks
import { fetchPools } from "../../../../hooks/fuse/useFusePools"

// Rari
import { Vaults } from "../../../../esm/index"

// Next JS
import { NextApiRequest, NextApiResponse } from "next";

// Utils
import { fetchFusePoolData, FusePoolData } from "utils/fetchFusePoolData";
import { initFuseWithProviders, providerURL } from "utils/web3Providers";

// Ethers
import { JsonRpcProvider } from "@ethersproject/providers"
import { utils, constants } from 'ethers'

interface APIAccountsFuseBalancesResponse {
  userAddress: string;
  pools: FusePoolData[];
  totals: {
    totalBorrowsUSD: number;
    totalSuppliedUSD: number;
  };
}

export interface APIError {
  error: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIAccountsFuseBalancesResponse | APIError>
) {
  if (req.method === "GET") {
    try {
      let userAddress: string = "";

      // Validate address input
      const address = req.query.address as string;

      if (!address)
        return res.status(400).json({ error: "No Address provided." });

      try {
        userAddress = utils.getAddress(address);
      } catch (err) {
        return res.status(400).json({ error: "Invalid address provided." });
      }

      // Set up SDKs
      const web3 = new JsonRpcProvider(providerURL);
      const fuse = initFuseWithProviders(web3);

      // Get all fuse pools this user is active in
      const pools = await fetchPools({
        fuse,
        address,
        filter: "my-pools",
      });

      // Then get the data for each of these fuse pools
      const poolIndices = pools.map((pool) => pool.id);
      const fusePoolsData = await Promise.all(
        poolIndices.map((poolIndex) =>
          fetchFusePoolData(poolIndex.toString(), userAddress, fuse)
        )
      );

      // Then filter out the data to show only assets where supply or borrow balance > 0
      const fusePoolsDataWithFilteredAssets = fusePoolsData.map((pool) => {
        return {
          ...pool,
          assets:
            pool?.assets.filter(
              (asset) => asset.borrowBalance.gt(constants.Zero) || asset.supplyBalance.gt(constants.Zero)
            ) ?? [],
        } as FusePoolData;
      });

      const totalBorrowsUSD =
        fusePoolsData?.reduce((a, b) => {
          return a + (b?.totalBorrowBalanceUSD ? parseInt(b?.totalBorrowBalanceUSD.toString()) : 0);
        }, 0) ?? 0;

      const totalSuppliedUSD =
        fusePoolsDataWithFilteredAssets?.reduce((a, b) => {
          return a + (b?.totalSupplyBalanceUSD ? parseInt(b?.totalBorrowBalanceUSD.toString()) : 0);
        }, 0) ?? 0;

      // Calc totals
      const totals = {
        totalBorrowsUSD,
        totalSuppliedUSD,
      };

      return res.status(200).json({
        userAddress,
        pools: fusePoolsDataWithFilteredAssets,
        totals,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  }
}

const validateAddressQuery = (address: string) => {
  let userAddress: string = "";

  return userAddress;
};
