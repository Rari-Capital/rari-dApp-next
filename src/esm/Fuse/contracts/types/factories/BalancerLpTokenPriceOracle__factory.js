/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { utils, Contract, ContractFactory } from "ethers";
const _abi = [
  {
    inputs: [],
    name: "BONE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BPOW_PRECISION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXIT_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INIT_POOL_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_BOUND_TOKENS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_BPOW_BASE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_IN_RATIO",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_OUT_RATIO",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_TOTAL_WEIGHT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_WEIGHT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_BALANCE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_BOUND_TOKENS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_BPOW_BASE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_WEIGHT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "underlying",
        type: "address",
      },
    ],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address",
      },
    ],
    name: "getUnderlyingPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const _bytecode =
  "0x608060405234801561001057600080fd5b50611261806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063b7b800a4116100a2578063c36596a611610071578063c36596a61461013d578063c6580d12146101b3578063e4a28a521461011b578063ec093021146101bb578063fc57d4df146101c357610116565b8063b7b800a414610193578063ba019dab1461019b578063bc063e1a146101a3578063bc694ea2146101ab57610116565b8063867378c5116100e9578063867378c51461014d5780639381cd2b14610155578063992e2a921461015d578063aea9107814610165578063b0e0d1361461018b57610116565b806309a3bbe41461011b578063189d00ca14610135578063218b53821461013d57806376c7a3c714610145575b600080fd5b6101236101e9565b60408051918252519081900360200190f35b6101236101f6565b61012361020a565b610123610216565b610123610228565b61012361023c565b610123610249565b6101236004803603602081101561017b57600080fd5b50356001600160a01b0316610255565b610123610266565b61012361026b565b610123610270565b610123610275565b610123610285565b610123610291565b610123610296565b610123600480360360208110156101d957600080fd5b50356001600160a01b03166102a6565b6802b5e3af16b188000081565b6402540be400670de0b6b3a76400005b0481565b670de0b6b3a764000081565b620f4240670de0b6b3a7640000610206565b64e8d4a51000670de0b6b3a7640000610206565b68056bc75e2d6310000081565b6704a03ce68d21555681565b6000610260826103af565b92915050565b600881565b600281565b600181565b600a670de0b6b3a7640000610206565b671bc16d674ec7ffff81565b600081565b6002670de0b6b3a7640000610206565b600080826001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b1580156102e257600080fd5b505afa1580156102f6573d6000803e3d6000fd5b505050506040513d602081101561030c57600080fd5b50516040805163313ce56760e01b815290519192506103a8916001600160a01b0384169163313ce567916004808301926020929190829003018186803b15801561035557600080fd5b505afa158015610369573d6000803e3d6000fd5b505050506040513d602081101561037f57600080fd5b505160ff16600a0a6103a2670de0b6b3a764000061039c856103af565b90610a86565b90610adf565b9392505050565b600080829050806001600160a01b031663cd2ed8fb6040518163ffffffff1660e01b815260040160206040518083038186803b1580156103ee57600080fd5b505afa158015610402573d6000803e3d6000fd5b505050506040513d602081101561041857600080fd5b50516002146104585760405162461bcd60e51b81526004018080602001828103825260298152602001806111e26029913960400191505060405180910390fd5b6060816001600160a01b031663be3bbd2e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561049357600080fd5b505afa1580156104a7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405260208110156104d057600080fd5b81019080805160405193929190846401000000008211156104f057600080fd5b90830190602082018581111561050557600080fd5b825186602082028301116401000000008211171561052257600080fd5b82525081516020918201928201910280838360005b8381101561054f578181015183820152602001610537565b50505050905001604052505050905060008160008151811061056d57fe5b6020026020010151905060008260018151811061058657fe5b602002602001015190506000336001600160a01b031663aea91078846040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156105df57600080fd5b505afa1580156105f3573d6000803e3d6000fd5b505050506040513d602081101561060957600080fd5b5051604080516315d5220f60e31b81526001600160a01b03851660048201529051919250600091339163aea91078916024808301926020929190829003018186803b15801561065757600080fd5b505afa15801561066b573d6000803e3d6000fd5b505050506040513d602081101561068157600080fd5b50516040805163313ce56760e01b815290519192506000916001600160a01b0387169163313ce567916004808301926020929190829003018186803b1580156106c957600080fd5b505afa1580156106dd573d6000803e3d6000fd5b505050506040513d60208110156106f357600080fd5b50516040805163313ce56760e01b815290519192506000916001600160a01b0387169163313ce567916004808301926020929190829003018186803b15801561073b57600080fd5b505afa15801561074f573d6000803e3d6000fd5b505050506040513d602081101561076557600080fd5b50519050601260ff8316101561078b576107888460ff8416601203600a0a610a86565b93505b60128260ff1611156107ae576107ab8460111960ff851601600a0a610adf565b93505b60128160ff1610156107d0576107cd8360ff8316601203600a0a610a86565b92505b60128160ff1611156107f3576107f08360111960ff841601600a0a610adf565b92505b6000806109ed8a6001600160a01b031663f8b2cb4f8a6040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561084657600080fd5b505afa15801561085a573d6000803e3d6000fd5b505050506040513d602081101561087057600080fd5b50516040805163f8b2cb4f60e01b81526001600160a01b038b811660048301529151918e169163f8b2cb4f91602480820192602092909190829003018186803b1580156108bc57600080fd5b505afa1580156108d0573d6000803e3d6000fd5b505050506040513d60208110156108e657600080fd5b50516040805163f1b8a9b760e01b81526001600160a01b038d811660048301529151918f169163f1b8a9b791602480820192602092909190829003018186803b15801561093257600080fd5b505afa158015610946573d6000803e3d6000fd5b505050506040513d602081101561095c57600080fd5b81019080805190602001909291905050508d6001600160a01b031663f1b8a9b78c6040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156109ba57600080fd5b505afa1580156109ce573d6000803e3d6000fd5b505050506040513d60208110156109e457600080fd5b50518a8a610b21565b91509150610a768a6001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015610a2d57600080fd5b505afa158015610a41573d6000803e3d6000fd5b505050506040513d6020811015610a5757600080fd5b50516103a2610a668489610a86565b610a70868b610a86565b90610bd0565b9c9b505050505050505050505050565b600082610a9557506000610260565b82820282848281610aa257fe5b04146103a85760405162461bcd60e51b815260040180806020018281038252602181526020018061120b6021913960400191505060405180910390fd5b60006103a883836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610c2a565b6000806000610b308989610ccc565b90506000610b50610b418987610ddf565b610b4b8989610ddf565b610ccc565b905080821115610b93576000610b668284610ccc565b9050610b7b8b610b76838b610ea1565b610ddf565b9450610b8b8a610b4b838c610ea1565b935050610bc3565b6000610b9f8383610ccc565b9050610baf8b610b4b838b610ea1565b9450610bbf8a610b76838c610ea1565b9350505b5050965096945050505050565b6000828201838110156103a8576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b60008183610cb65760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610c7b578181015183820152602001610c63565b50505050905090810190601f168015610ca85780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581610cc257fe5b0495945050505050565b600081610d0f576040805162461bcd60e51b815260206004820152600c60248201526b4552525f4449565f5a45524f60a01b604482015290519081900360640190fd5b670de0b6b3a76400008302831580610d375750670de0b6b3a7640000848281610d3457fe5b04145b610d7b576040805162461bcd60e51b815260206004820152601060248201526f11549497d1125597d25395115493905360821b604482015290519081900360640190fd5b60028304810181811015610dc9576040805162461bcd60e51b815260206004820152601060248201526f11549497d1125597d25395115493905360821b604482015290519081900360640190fd5b6000848281610dd457fe5b049695505050505050565b6000828202831580610df9575082848281610df657fe5b04145b610e3d576040805162461bcd60e51b815260206004820152601060248201526f4552525f4d554c5f4f564552464c4f5760801b604482015290519081900360640190fd5b6706f05b59d3b20000810181811015610e90576040805162461bcd60e51b815260206004820152601060248201526f4552525f4d554c5f4f564552464c4f5760801b604482015290519081900360640190fd5b6000670de0b6b3a764000082610dd4565b60006001831015610ef1576040805162461bcd60e51b81526020600482015260156024820152744552525f42504f575f424153455f544f4f5f4c4f5760581b604482015290519081900360640190fd5b671bc16d674ec7ffff831115610f47576040805162461bcd60e51b815260206004820152601660248201527508aa4a4be84a09eaebe8482a68abea89e9ebe90928e960531b604482015290519081900360640190fd5b6000610f5283610faf565b90506000610f608483610fca565b90506000610f7686610f718561102c565b61103a565b905081610f87579250610260915050565b6000610f9887846305f5e100611091565b9050610fa48282610ddf565b979650505050505050565b6000670de0b6b3a7640000610fc38361102c565b0292915050565b6000806000610fd9858561116f565b915091508015611024576040805162461bcd60e51b81526020600482015260116024820152704552525f5355425f554e444552464c4f5760781b604482015290519081900360640190fd5b509392505050565b670de0b6b3a7640000900490565b6000806002830661105357670de0b6b3a7640000611055565b835b90506002830492505b82156103a85761106e8485610ddf565b93506002830615611086576110838185610ddf565b90505b60028304925061105e565b60008281806110a887670de0b6b3a764000061116f565b9092509050670de0b6b3a764000080600060015b888410611160576000670de0b6b3a7640000820290506000806110f08a6110eb85670de0b6b3a7640000610fca565b61116f565b9150915061110287610b76848c610ddf565b965061110e8784610ccc565b96508661111d57505050611160565b8715611127579315935b8015611131579315935b8415611148576111418688610fca565b9550611155565b6111528688611194565b95505b5050506001016110bc565b50909998505050505050505050565b600080828410611185575050808203600061118d565b505081810360015b9250929050565b6000828201838110156103a8576040805162461bcd60e51b815260206004820152601060248201526f4552525f4144445f4f564552464c4f5760801b604482015290519081900360640190fdfe42616c616e63657220706f6f6c206d75737420686176652065786163746c79203220746f6b656e732e536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a264697066735822122038d2111861095c99a108a7fd3a38dc7fd44e166b7a0417fa2b67c9868061782664736f6c634300060c0033";
const isSuperArgs = (xs) => xs.length > 1;
export class BalancerLpTokenPriceOracle__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }
  deploy(overrides) {
    return super.deploy(overrides || {});
  }
  getDeployTransaction(overrides) {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address) {
    return super.attach(address);
  }
  connect(signer) {
    return super.connect(signer);
  }
  static createInterface() {
    return new utils.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
}
BalancerLpTokenPriceOracle__factory.bytecode = _bytecode;
BalancerLpTokenPriceOracle__factory.abi = _abi;
