import { providers } from "ethers";
import { createTurboLens } from "lib/turbo/utils/turboContracts";
import { formatSafeInfo } from "./getSafeInfo";

export const getAllUserSafes = async (
  provider: providers.Provider,
  user: string,
  chainID: number
) => {
  let lens = createTurboLens(provider, chainID);
  try {
    let result: any[] = await lens.callStatic.getAllUserSafes(user);
    const formattedResult = result.map(formatSafeInfo);
    return formattedResult;
  } catch (err) {
    console.log(err);
  }
};
