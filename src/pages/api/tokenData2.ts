// Node
import Vibrant from "node-vibrant";
import { Palette } from "node-vibrant/lib/color";
import fetch from "node-fetch";

// Rari
import ERC20ABI from "../../esm/Vaults/abi/ERC20.json";

import { providerURL } from "utils/web3Providers";
import { NextApiRequest, NextApiResponse } from "next";

// Ethers
import { utils, Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

const web3 = new JsonRpcProvider(providerURL);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cache-Control", "max-age=3600, s-maxage=3600");

  const address = utils.getAddress(request.query.address as string);

  const tokenContract = new Contract(address, ERC20ABI as any, web3);

  const [decimals, rawData] = await Promise.all([
    tokenContract.decimals().then((res: any) => parseFloat(res)),

    fetch(
      "https://api.coingecko.com/api/v3/coins/ethereum/contract/" + address
    ).then((res) => res.json()),
  ]);

  let name: string;
  let symbol: string;
  let logoURL: string | undefined;

  if (rawData.error) {
    name = await tokenContract.name();
    symbol = await tokenContract.symbol();

    //////////////////
    // Edge cases: //
    /////////////////
    if (
      utils.getAddress(address) ===
      utils.getAddress("0xFD4D8a17df4C27c1dD245d153ccf4499e806C87D")
    ) {
      name = "linkCRV Gauge Deposit";
      symbol = "[G]linkCRV";
      logoURL =
        "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/crvLINKGauge.png";
    }

    if (
      utils.getAddress(address) ===
      utils.getAddress("0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0")
    ) {
      name = "Wrapped Staked Ether";
      logoURL =
        "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/wstETH.png";
    }

    if (
      utils.getAddress(address) ===
      utils.getAddress("0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f")
    ) {
      logoURL =
        "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/token_sOHM_2.png";
    }

    // Fetch the logo from yearn if possible:
    const yearnLogoURL = `https://raw.githubusercontent.com/yearn/yearn-assets/master/icons/tokens/${address}/logo-128.png`;
    const yearnLogoResponse = await fetch(yearnLogoURL);
    if (yearnLogoResponse.ok) {
      // A lot of the yearn tokens are curve tokens with long names,
      // so we flatten them here and just remove the Curve part
      symbol = symbol.replace("Curve-", "");
      logoURL = yearnLogoURL;
    }
  } else {
    let {
      symbol: _symbol,
      name: _name,
      image: { small },
    } = rawData;

    symbol = _symbol == _symbol.toLowerCase() ? _symbol.toUpperCase() : _symbol;
    name = _name;

    // Prefer the logo from trustwallet if possible!
    const trustWalletURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    const trustWalletLogoResponse = await fetch(trustWalletURL);
    if (trustWalletLogoResponse.ok) {
      logoURL = trustWalletURL;
    } else {
      logoURL = small;
    }
  }

  if (
    address === utils.getAddress("0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9")
  ) {
    // FTX swapped the name and symbol so we will correct for that.
    symbol = "FTT";
    name = "FTX Token";
  }

  // OT-aUSDC
  if (
    address === utils.getAddress("0x8fcb1783bf4b71a51f702af0c266729c4592204a")
  ) {
    // OT token names are too long.
    symbol = "OT-aUSDC22";
    name = "OT-aUSDC DEC22-20";
  }

  // OT-cDAI22
  if (
    address === utils.getAddress("0x3d4e7f52efafb9e0c70179b688fc3965a75bcfea")
  ) {
    // OT token names are too long.
    symbol = "OT-cDAI22";
    name = "OT-cDAI DEC22-20";
  }

  // xSDT
  if (
    address === utils.getAddress("0xaC14864ce5A98aF3248Ffbf549441b04421247D3")
  ) {
    logoURL =
      "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/logos/stakedao/xSDT.png";
  }

  // sd3Crv
  if (
    address === utils.getAddress("0xB17640796e4c27a39AF51887aff3F8DC0daF9567")
  ) {
    logoURL =
      "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/logos/stakedao/sd3Crv.png";
  }

  // sdeursCRV
  if (
    address === utils.getAddress("0xCD6997334867728ba14d7922f72c893fcee70e84")
  ) {
    logoURL =
      "https://raw.githubusercontent.com/Rari-Capital/rari-dApp/master/src/static/logos/stakedao/sdeursCRV.png";
  }

  const basicTokenInfo = {
    symbol,
    name,
    decimals,
  };

  let color: Palette;
  try {
    if (logoURL == undefined) {
      // If we have no logo no need to try to get the color
      // just go to the catch block and return the default logo.
      throw "Go to the catch block";
    }

    color = await Vibrant.from(logoURL).getPalette();
  } catch (error) {
    response.json({
      ...basicTokenInfo,
      color: "#FFFFFF",
      overlayTextColor: "#000",
      logoURL:
        "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg",
      address,
    });

    return;
  }

  if (!color.Vibrant) {
    response.json({
      ...basicTokenInfo,
      color: "#FFFFFF",
      overlayTextColor: "#000",
      logoURL,
      address,
    });

    return;
  }

  response.json({
    ...basicTokenInfo,
    color: color.Vibrant.getHex(),
    overlayTextColor: color.Vibrant.getTitleTextColor(),
    logoURL,
    address,
  });
};
