// Rari
import { EmptyAddress } from "context/RariContext";

// Hooks
import { initFuseWithProviders, providerURL } from "utils/web3Providers";

// Next Js
import { NextApiRequest, NextApiResponse } from "next";

// Utils
import { fetchFusePoolData } from "utils/fetchFusePoolData";

// Ethers
import { utils } from 'ethers'
import { JsonRpcProvider } from "@ethersproject/providers"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    try {
      let userAddress: string = "";

      // Validate queryParams
      const poolIndex = req.query.poolIndex as string; // required
      const address = (req.query.address as string) ?? EmptyAddress; // optional
      try {
        userAddress = utils.getAddress(address);
      } catch (err) {
        return res.status(400).json({ error: "Invalid address provided." });
      }
      if (!poolIndex)
        return res.status(400).json({ error: "Invalid address provided." });

      // Set up SDKs
      const web3 = new JsonRpcProvider(providerURL);
      const fuse = initFuseWithProviders(web3);

      // Get data for this fuse pool
      const fusePoolData = await fetchFusePoolData(
        poolIndex,
        userAddress,
        fuse,
      );

      return res.status(200).json({ success: true, fusePoolData, userAddress });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}
