import { Fuse } from "esm";
import { BigNumber, Contract } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Interface } from "ethers/lib/utils";
import { filterOnlyObjectProperties } from "./fetchFusePoolData";

type EncodedCall = [string, any]

export const createMultiCall = (provider: JsonRpcProvider | Web3Provider,) => {
  const multicallContract = new Contract(
    MULTICALL_ADDRESS,
    MultiCallAbi,
    provider.getSigner()
  );
  return multicallContract;
};

export const sendWithMultiCall = async (
  fuse: Fuse,
  encodedCalls: any,
  address: string
) => {
  // @ts-ignore
  const multicall = createMultiCall(fuse.provider);

  console.log("sendWithMultiCall", { encodedCalls, multicall });

  const returnDatas = await multicall.aggregate(encodedCalls, {
    from: address,
  });

  return returnDatas;
};


export const callStaticWithMultiCall = async (
  provider: JsonRpcProvider | Web3Provider,
  encodedCalls: EncodedCall[],
  address?: string
) => {
  const multicall = createMultiCall(provider);
  let options: any = {}
  if (!!address) options.address = address

  const returnDatas = await multicall.callStatic.aggregate(encodedCalls, options)

  return returnDatas;
};



export const callInterfaceWithMulticall = async (
  provider: JsonRpcProvider | Web3Provider,
  iface: Interface,
  contractAddress: string,
  functionNames: string[],
  params: any[][],
) => {
  const encodedCalls = functionNames.map(
    (funcName, i) => encodeCall(iface, contractAddress, funcName, params[i])
  )

  let result: { blockNum: BigNumber, returnData: string[] } = filterOnlyObjectProperties(await callStaticWithMultiCall(provider, encodedCalls))
  const { returnData } = result

  const decodedCalls = functionNames.map(
    (funcName, i) => decodeCall(iface, funcName, returnData[i])
  )

  return decodedCalls
}

export const encodeCall = (
  iface: Interface,
  contractAddress: string,
  functionName: string,
  params: any[],

): EncodedCall =>
  [contractAddress, iface.encodeFunctionData(functionName, [...params])]

export const decodeCall = (
  iface: Interface,
  functionName: string,
  txResult: any,
): any =>
  iface.decodeFunctionResult(functionName, txResult);




  
const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

const MultiCallAbi = [
  {
    constant: true,
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [{ name: "timestamp", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "callData", type: "bytes" },
        ],
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      { name: "blockNumber", type: "uint256" },
      { name: "returnData", type: "bytes[]" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLastBlockHash",
    outputs: [{ name: "blockHash", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "addr", type: "address" }],
    name: "getEthBalance",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentBlockDifficulty",
    outputs: [{ name: "difficulty", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentBlockGasLimit",
    outputs: [{ name: "gaslimit", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentBlockCoinbase",
    outputs: [{ name: "coinbase", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "blockNumber", type: "uint256" }],
    name: "getBlockHash",
    outputs: [{ name: "blockHash", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];