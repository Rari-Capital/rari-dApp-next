import { providers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { createTurboRouter } from './turboContracts'

// returns callData for a function call to be parsed through multicall
export const encodeRouterCall = (
  iface: Interface,
  functionName: string,
  params: any[]
): string => iface.encodeFunctionData(functionName, [...params])


export const decodeRouterCall = (
  iface: Interface,
  functionName: string,
  txResult: any
): any => iface.decodeFunctionResult(functionName, txResult);


export const callRouterWithMultiCall = async (
  provider: providers.JsonRpcProvider,
  encodedCalls: string[],
  chainID: number,
  simulatedAddress?: string,
) => {
  const router = await createTurboRouter(provider, chainID);

  let options: any = {};
  if (!!simulatedAddress) options.address = simulatedAddress;

  const returnDatas = await router.callStatic.multicall(
    encodedCalls,
    options
  );

  return returnDatas;
};


export const sendRouterWithMultiCall = async (
  signer: Signer,
  encodedCalls: string[],
  chainID: number,
  simulatedAddress?: string
) => {
  // @ts-ignore
  const router = await createTurboRouter(signer.provider, chainID);

  const routerWithSigner = router.connect(signer)

  let options: any = {};
  if (!!simulatedAddress) options.address = simulatedAddress;

  const tx = await routerWithSigner.multicall(
    encodedCalls,
    options
  );


  return tx;
};

