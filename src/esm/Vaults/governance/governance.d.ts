import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import Cache from "../cache";
export declare const contractAddresses: {
  RariGovernanceToken: string;
  RariGovernanceTokenDistributor: string;
  RariGovernanceTokenUniswapDistributor: string;
  RariGovernanceTokenVesting: string;
};
export declare const abis: {
  RariGovernanceToken: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  RariGovernanceTokenDistributor: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  RariGovernanceTokenUniswapDistributor: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  RariGovernanceTokenVesting: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
};
export declare const LP_TOKEN_CONTRACT =
  "0x18a797c7c70c1bf22fdee1c09062aba709cacf04";
export default class Governance {
  provider: JsonRpcProvider;
  cache: Cache;
  contracts: {
    [key: string]: Contract;
  };
  rgt: {
    distributions: any;
    getExchangeRate: any;
    sushiSwapDistributions: any;
    vesting: {
      PRIVATE_VESTING_START_TIMESTAMP: any;
      PRIVATE_VESTING_PERIOD: any;
      getUnclaimed: (account: any) => Promise<BigNumber>;
      claim: any;
      claimAll: any;
      getClaimFee: (timestamp: number) => BigNumber;
    };
    balanceOf: any;
    transfer: any;
  };
  API_BASE_URL: string;
  static CONTRACT_ADDRESSES: {
    RariGovernanceToken: string;
    RariGovernanceTokenDistributor: string;
    RariGovernanceTokenUniswapDistributor: string;
    RariGovernanceTokenVesting: string;
  };
  static CONTRACT_ABIS: {
    RariGovernanceToken: (
      | {
          anonymous: boolean;
          inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          type: string;
          constant?: undefined;
          outputs?: undefined;
          payable?: undefined;
          stateMutability?: undefined;
        }
      | {
          constant: boolean;
          inputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          outputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          payable: boolean;
          stateMutability: string;
          type: string;
          anonymous?: undefined;
        }
    )[];
    RariGovernanceTokenDistributor: (
      | {
          anonymous: boolean;
          inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          type: string;
          constant?: undefined;
          outputs?: undefined;
          payable?: undefined;
          stateMutability?: undefined;
        }
      | {
          constant: boolean;
          inputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          outputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          payable: boolean;
          stateMutability: string;
          type: string;
          anonymous?: undefined;
        }
    )[];
    RariGovernanceTokenUniswapDistributor: (
      | {
          anonymous: boolean;
          inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          type: string;
          constant?: undefined;
          outputs?: undefined;
          payable?: undefined;
          stateMutability?: undefined;
        }
      | {
          constant: boolean;
          inputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          outputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          payable: boolean;
          stateMutability: string;
          type: string;
          anonymous?: undefined;
        }
    )[];
    RariGovernanceTokenVesting: (
      | {
          anonymous: boolean;
          inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          type: string;
          constant?: undefined;
          outputs?: undefined;
          payable?: undefined;
          stateMutability?: undefined;
        }
      | {
          constant: boolean;
          inputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          outputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          payable: boolean;
          stateMutability: string;
          type: string;
          anonymous?: undefined;
        }
    )[];
  };
  constructor(provider: JsonRpcProvider);
}
