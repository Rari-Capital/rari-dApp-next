// Rari
import { EmptyAddress } from "context/RariContext";
import { Vaults } from "../../../esm/index";

// Hooks
import { fetchPools } from "hooks/fuse/useFusePools";

// Next JS
import { NextApiRequest, NextApiResponse } from "next";

// Utils
import { fetchFusePoolData } from "utils/fetchFusePoolData";
import { initFuseWithProviders, providerURL } from "utils/web3Providers";

// Ethers
import { utils } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let _poolIndices: string[] = [];

  if (req.method === "POST") {
    try {
      let userAddress: string = "";

      // Validate queryParams
      const poolIndices = req.body.poolIndices as string[]; // optional
      const address = (req.body.address as string) ?? EmptyAddress; // optional

      try {
        userAddress = utils.getAddress(address);
      } catch (err) {
        return res.status(400).json({ error: "Invalid address provided." });
      }

      // Set up SDKs
      const web3 = new JsonRpcProvider(providerURL);
      const fuse = initFuseWithProviders(web3);

      // If we specified poolIndices, use those, else fetch all pools
      if (poolIndices?.length) {
        _poolIndices = poolIndices;
      } else {
        const fusePools = await fetchPools({
          fuse,
          address: userAddress,
          filter: "",
        });
        _poolIndices = fusePools.map((pool) => pool.id.toString());
      }

      const fusePoolsData = await Promise.all(
        _poolIndices.map((poolIndex) =>
          fetchFusePoolData(poolIndex, userAddress, fuse, undefined, false)
        )
      );

      return res.status(200).json({ pools: fusePoolsData, userAddress });
    } catch (error) {
      console.log({ error });
      return res.status(400).json({ error });
    }
  }
  //   Gets ALL fuse pool Data
  else if (req.method === "GET") {
    try {
      let userAddress: string = "";

      // Validate queryParams
      // const poolIndices = req.body.poolIndices as string[]; // optional
      const address = (req.body.address as string) ?? EmptyAddress; // optional

      try {
        userAddress = utils.getAddress(address);
      } catch (err) {
        return res.status(400).json({ error: "Invalid address provided." });
      }

      // Set up SDKs
      const web3 = new JsonRpcProvider(providerURL);
      const fuse = initFuseWithProviders(web3);

      const fusePools = await fetchPools({
        fuse,
        address: userAddress,
        filter: "",
      });

      const poolIndices = fusePools
        .filter((pool) => !!pool.underlyingTokens.length) // filter out empty pools
        .map((pool) => pool.id.toString());

      const fusePoolsData = await Promise.all(
        poolIndices.map((poolIndex) =>
          fetchFusePoolData(poolIndex, userAddress, fuse, undefined, false)
        )
      );

      return res.status(200).json({ pools: fusePoolsData, userAddress });
    } catch (error) {
      console.log({ error });
      return res.status(400).json({ error });
    }
  }
}
