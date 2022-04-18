import { BigNumber, providers } from "ethers";
import encodeCall from "lib/turbo/transactions/encodedCalls";
import {
  createTurboMaster,
  createTurboSafe,
} from "lib/turbo/utils/turboContracts";
import { sendRouterWithMultiCall } from "lib/turbo/utils/turboMulticall";

export const createSafe = async (
  underlyingToken: string,
  provider: providers.JsonRpcProvider | providers.Web3Provider,
  chainID: number
) => {
  const turboMaster = createTurboMaster(provider, 1);
  const tx = await turboMaster.createSafe(underlyingToken);
  return tx;
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
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return;
  }

  const turboSafeContract = await createTurboSafe(signer, safe);
  const tx = await turboSafeContract.deposit(amount, recipient);
  return tx;
};

export const safeWithdraw = async (
  safe: string,
  recipient: string,
  amount: BigNumber,
  signer: providers.JsonRpcSigner | any
) => {
  const turboSafeContract = await createTurboSafe(signer, safe);
  const tx = await turboSafeContract.withdraw(amount, recipient, recipient);
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
    const tx = await sendRouterWithMultiCall(signer, encodedCalls, chainID);
    return tx;
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
    const tx = await sendRouterWithMultiCall(signer, [encodedSweep], chainID);
    return tx;
  } catch (err) {
    console.error(err);
  }
};
