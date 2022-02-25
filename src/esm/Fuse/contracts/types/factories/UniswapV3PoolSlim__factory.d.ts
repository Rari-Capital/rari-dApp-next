import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  UniswapV3PoolSlim,
  UniswapV3PoolSlimInterface,
} from "../UniswapV3PoolSlim";
export declare class UniswapV3PoolSlim__factory {
  static readonly abi: (
    | {
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
      }
    | {
        inputs: never[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        stateMutability: string;
        type: string;
      }
  )[];
  static createInterface(): UniswapV3PoolSlimInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapV3PoolSlim;
}
