import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers";

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
