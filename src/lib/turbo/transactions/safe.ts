import { BigNumber, providers } from "ethers";
import { createTurboSafe } from "lib/turbo/utils/turboContracts";
import encodeCall from "lib/turbo/transactions/encodedCalls";
import { sendRouterWithMultiCall } from "lib/turbo/utils/turboMulticall";

export const createSafe = async (
  underlyingToken: string,
  provider: providers.JsonRpcProvider | providers.Web3Provider,
  chainID: number
) => {
  const encodedSafe = encodeCall.createSafe(underlyingToken);
  const receipt = await sendRouterWithMultiCall(
    provider.getSigner(),
    [encodedSafe],
    chainID
  );
  return receipt
};

export const safeBoost = async (
  safe: string,
  strategy: string,
  amount: BigNumber,
  signer: providers.JsonRpcSigner
) => {
  const turboSafeContract = await createTurboSafe(signer.provider, safe);
  const connectedTurboSafe = turboSafeContract.connect(signer);
  const receipt = await connectedTurboSafe.boost(strategy, amount);
  return await receipt;
};

export const safeDeposit = async (
  safe: string,
  recipient: string,
  amount: BigNumber,
  signer: providers.JsonRpcSigner | any
) => {
  const turboSafeContract = await createTurboSafe(signer, safe);
  console.log({ safe, recipient, amount, signer });
  const tx = await turboSafeContract.deposit(amount, recipient);
  return tx;
};

export const safeLess = async (
  safe: string,
  strategy: string,
  amount: BigNumber,
  lessingMax: boolean,
  signer: any,
  chainID: number
) => {
  let encodedCalls = [];

  if (lessingMax) {
    const encodedSlurp = encodeCall.slurp(safe, strategy);
    encodedCalls.push(encodedSlurp);
  }

  const encodedLess = encodeCall.less(safe, strategy, amount);
  encodedCalls.push(encodedLess);

  try {
    const result = await sendRouterWithMultiCall(signer, encodedCalls, chainID);
  } catch (err) {
    console.error(err);
  }
};

export const safeSlurp = async (
  safe: string,
  strategies: string[],
  signer: any,
  chainID: number
) => {
  const encodedSlurps = strategies.map((vault) =>
    encodeCall.slurp(safe, vault)
  );

  try {
    const result = await sendRouterWithMultiCall(
      signer,
      encodedSlurps,
      chainID
    );
  } catch (err) {
    console.error(err);
  }
};

export const safeSweep = async (
  safe: string,
  recepient: string,
  tokenAddress: string,
  amount: BigNumber,
  chainID: number,
  signer: any
) => {
  const encodedSweep = encodeCall.sweep(safe, recepient, tokenAddress, amount);

  try {
    const result = await sendRouterWithMultiCall(
      signer,
      [encodedSweep],
      chainID
    );
  } catch (err) {
    console.error(err);
  }
};
