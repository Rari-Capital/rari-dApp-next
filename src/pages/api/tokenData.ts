// Node
import Vibrant from "node-vibrant";
import { Palette } from "node-vibrant/lib/color";
import fetch from "node-fetch";

// Utils
import { providerURL } from "utils/web3Providers";

// Next
import { NextApiRequest, NextApiResponse } from "next";

// Ethers
import { utils, Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

// Rari
import ERC20ABI from "../../esm/Vaults/abi/ERC20.json";

const web3 = new JsonRpcProvider(providerURL);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cache-Control", "max-age=3600, s-maxage=3600");

  return response.status(404).send("Nope");
};
