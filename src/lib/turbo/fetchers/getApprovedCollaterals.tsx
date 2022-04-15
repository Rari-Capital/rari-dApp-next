import { providers } from "@0xsequence/multicall";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { FEI } from "../utils/constants";
import {
  createCERC20,
  createCERC20Delegate,
  createTurboComptroller,
} from "../utils/turboContracts";

export const getTurboApprovedCollateral = async (
  provider: JsonRpcProvider | Web3Provider
): Promise<string[]> => {
  const multicallProvider = new providers.MulticallProvider(provider);

  const TurboPool = createTurboComptroller(multicallProvider, 1);
  const markets: string[] = await TurboPool.callStatic.getAllMarkets();

  const underlyings: string[] = (
    await Promise.all(
      markets.map(async (market) => {
        const CERC20 = createCERC20Delegate(multicallProvider, market);
        const underlying: string = await CERC20.callStatic.underlying();
        return underlying;
      })
    )
  ).filter((token) => token.toLowerCase() !== FEI.toLowerCase());

  console.log({ underlyings, markets });

  return underlyings;
};
