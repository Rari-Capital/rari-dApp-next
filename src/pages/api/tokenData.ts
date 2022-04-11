import { TokenDataOverrides } from "constants/tokenData";
import {
  isSupportedChainId,
  coingeckoNetworkPath,
  networkData,
} from "constants/networks";
import ERC20ABI from "contracts/abi/ERC20.json";
// import

import { NextApiRequest, NextApiResponse } from "next";
import { utils, Contract, providers } from "ethers";
import axios from "axios";

// Color
import Vibrant from "node-vibrant";

let method: "RARI" | "COINGECKO" | "CONTRACT";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.setHeader("Cache-Control", "max-age=3600, s-maxage=3600");

  const { address: _address, chainId: _chainId = "1" } = request.query;
  console.log(request.query);

  let chainId: number;

  if (!_address) {
    return response.status(500).send(`No token address provided`);
  }

  // 1.) Validate ChainID
  try {
    chainId = parseInt(_chainId as string);
    if (!isSupportedChainId(chainId)) {
      throw "Unsupported ChainID";
    }
  } catch {
    return response.status(500).send(`Unsupported Chain ID: ${_chainId}`);
  }

  // 2.) Try to get networkdata
  let netData;
  try {
    netData = networkData[chainId];
    if (!netData) {
      return response
        .status(500)
        .send(
          `Network supported but Could not find network data for chain ID: ${chainId}`
        );
    }
  } catch (err) {
    return response
      .status(500)
      .send(
        `Network supported but Could not find network data for chain ID: ${chainId}`
      );
  }

  // 3.) Instiantate variables
  let name: string;
  let symbol: string;
  let logoURL: string =
    "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg";
  const provider = new providers.JsonRpcProvider(networkData[chainId].rpc);

  let address: string;
  let tokenContract: Contract;
  try {
    address = utils.getAddress(_address as string);
    tokenContract = new Contract(address, ERC20ABI, provider);
  } catch (err) {
    return response
      .status(404)
      .send(`Invalid Token ${_address} on chain ${chainId}`);
  }

  // 4.) L1/L2 URLS
  const rariURL = `https://raw.githubusercontent.com/sharad-s/rari-token-list/main/tokens/${chainId}/${address}/info.json`;
  //@ts-ignore
  const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${coingeckoNetworkPath[chainId]}/contract/${address}`;
  // L1 URLs
  const trustWalletURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  const yearnLogoURL = `https://raw.githubusercontent.com/yearn/yearn-assets/master/icons/tokens/${address}/logo-128.png`;

  let decimals = 18;
  let rariTokenData;

  // 6.) Get decimals, return 404 if cant
  try {
    decimals = await tokenContract.callStatic.decimals();
  } catch (err) {
    console.log({ err });

    return response
      .status(404)
      .send(`Invalid Token ${address} on chain ${chainId}`);
  }

  // 7.) Get decimals, return 404 if cant
  try {
    decimals = await tokenContract.callStatic.decimals();
  } catch {
    return response
      .status(404)
      .send(`Invalid Token ${address} on chain ${chainId}`);
  }

  // 8.) Rari Token Data
  try {
    // Fetch data from rari token data first
    const { data } = await axios.get(rariURL);
    rariTokenData = data;
  } catch (err) {
    console.log(`Could not find Rari Token Data at url ${rariURL}}`);
  } finally {
    console.log({ rariTokenData, rariURL });
  }

  // 9.) Try stuff
  try {
    if (!!rariTokenData) {
      // We got data from rari token list
      let { symbol: _symbol, name: _name, logoURI } = rariTokenData;
      symbol =
        _symbol == !!_symbol?.toLowerCase() ? _symbol.toUpperCase() : _symbol;
      name = _name;
      logoURL = logoURI;
      method = "RARI";
    } else {
      // We could not get data from rari token list. Try Coingecko
      let coingeckoData;
      try {
        const { data: _coingeckoData } = await axios.get(coingeckoURL);
        coingeckoData = _coingeckoData;
      } catch (err){

      }

      if (!!coingeckoData) {
        // We got data from Coingecko
        let {
          symbol: _symbol,
          name: _name,
          image: { small },
        } = coingeckoData;
        symbol =
          _symbol == !!_symbol?.toLowerCase()
            ? _symbol?.toUpperCase()
            : _symbol;
        name = _name;

        // Prefer the logo from trustwallet if possible!
        let trustWalletLogoURL;
        try {
          const { data: _trustWalletLogoURL } = await axios.get(trustWalletURL);
          trustWalletLogoURL = _trustWalletLogoURL;
        } catch (err) {
          console.log("No TrustWalletURL");
        } finally {
          if (trustWalletLogoURL) {
            logoURL = trustWalletURL;
          } else {
            logoURL = small;
          }
        }
      } else {
        // We could not get data from coingecko. Use the contract data
        try {
          name = await tokenContract.callStatic.name();
          symbol = await tokenContract.callStatic.symbol();
        } catch (err) {
          return response
            .status(404)
            .send(
              `Could not get name and symbol for token ${address} on chain ${chainId}`
            );
        }

        // We can't get the logo data from literally anywhere else so try one last time from yearn
        let yearnLogo;
        try {
          const { data: _yearnLogo } = await axios.get(yearnLogoURL);
          yearnLogo = _yearnLogo;
        } catch (err) {
        } finally {
          if (yearnLogo) {
            symbol = symbol.replace("Curve-", "");
            logoURL = yearnLogoURL;
          }
          method = "CONTRACT";
        }
      }
    }
  } catch (err) {
    console.log({ err });
    return response.status(404).send(err);
  }

  // 10. Assign any overrides if needed
  let overrides = {};
  if (!!TokenDataOverrides[chainId]) {
    overrides = TokenDataOverrides[chainId][address] ?? {};
  }
  const basicTokenInfo = Object.assign(
    {},
    {
      symbol,
      name,
      decimals,
      logoURL,
    },
    overrides
  );

  console.log({ overrides, basicTokenInfo, address });

  // 11. colors
  // Get the color
  let color: any;
  try {
    if (basicTokenInfo.logoURL === undefined) {
      // If we have no logo no need to try to get the color
      // just go to the catch block and return the default logo.
      throw "Go to the catch block";
    }

    color = await Vibrant.from(basicTokenInfo.logoURL).getPalette();
  } catch (error) {
    return response.json({
      ...basicTokenInfo,
      color: "#FFFFFF",
      overlayTextColor: "#000",
      address,
    });
  }

  if (!color.Vibrant) {
    return response.json({
      ...basicTokenInfo,
      color: "#FFFFFF",
      overlayTextColor: "#000",
      address,
    });
  }

  return response.json({
    ...basicTokenInfo,
    color: color.Vibrant.getHex(),
    overlayTextColor: color.Vibrant.getTitleTextColor(),
    address,
  });
}
