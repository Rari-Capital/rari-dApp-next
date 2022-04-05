import {
  encodeRouterCall,
  sendRouterWithMultiCall,
} from "lib/turbo/utils/turboMulticall";
import { BigNumber, Signer } from "ethers";
import { TurboAddresses } from "lib/turbo/utils/constants";
import { ITurboRouter } from "lib/turbo/utils/turboContracts";

export const createSafeAndDeposit = async (
  signer: Signer,
  amount: BigNumber,
  chainID: number,
  underlyingTokenAddress: string
) => {
  const provider = signer.provider;
  if (!provider) return;

  const userAddress = await signer.getAddress();

  const pullTokensArgs = [underlyingTokenAddress, amount, TurboAddresses[chainID].ROUTER];

  const createAndDepositArgs = [underlyingTokenAddress, userAddress, amount, amount];

  const encodedCreateSafeAndDeposit = encodeRouterCall(
    ITurboRouter,
    "createSafeAndDeposit",
    createAndDepositArgs
  );

  const encodedPullTokens = encodeRouterCall(
    ITurboRouter,
    "pullToken",
    pullTokensArgs
  );

  const encodedCalls = [encodedPullTokens, encodedCreateSafeAndDeposit];

  try {
    const tx = await sendRouterWithMultiCall(
      signer,
      encodedCalls,
      chainID
    );

    const receipt = await tx.wait(1)

    return receipt;
  } catch (e) {
    console.log(e);
  }
};
