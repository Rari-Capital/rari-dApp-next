import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { Interface } from "ethers/lib/utils";
import { filterOnlyObjectProperties } from "utils/fetchFusePoolData";

export const createMultiCall = (
  ethersProvider: JsonRpcProvider | Web3Provider
) => new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, ethersProvider);

export const sendWithMultiCall = async (
  provider: JsonRpcProvider | Web3Provider,
  encodedCalls: any,
  address: string
) => {
  const multicall = createMultiCall(provider);

  const returnDatas = await multicall.methods
    .aggregate(encodedCalls)
    .send({ from: address });

  return returnDatas;
};

export const callInterfaceWithMulticall = async (
  provider: JsonRpcProvider | Web3Provider,
  iface: Interface,
  contractAddress: string,
  functionNames: string[],
  params: any[][]
) => {
  const encodedCalls = functionNames.map((funcName, i) =>
    encodeCall(iface, contractAddress, funcName, params[i])
  );

  let result: { blockNum: BigNumber; returnData: string[] } =
    filterOnlyObjectProperties(
      await callStaticWithMultiCall(provider, encodedCalls)
    );
  const { returnData } = result;

  const decodedCalls = functionNames.map((funcName, i) =>
    decodeCall(iface, funcName, returnData[i])
  );

  return decodedCalls;
};


type EncodedCall = [string, any];

export const callStaticWithMultiCall = async (
  provider: JsonRpcProvider | Web3Provider,
  encodedCalls: EncodedCall[],
  address?: string
) => {
  const multicall = createMultiCall(provider);
  let options: any = {};
  if (!!address) options.address = address;

  const returnDatas = await multicall.callStatic.aggregate(
    encodedCalls,
    options
  );

  return returnDatas;
};

export const encodeCall = (
  iface: Interface,
  contractAddress: string,
  functionName: string,
  params: any[]
): EncodedCall => [
    contractAddress,
    iface.encodeFunctionData(functionName, [...params]),
  ];

export const decodeCall = (
  iface: Interface,
  functionName: string,
  txResult: any
): any => iface.decodeFunctionResult(functionName, txResult);


const MULTICALL_ADDRESS = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441";

const MULTICALL_ABI = [
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
