import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  FuseSafeLiquidator,
  FuseSafeLiquidatorInterface,
} from "../FuseSafeLiquidator";
export declare class FuseSafeLiquidator__factory {
  static readonly abi: (
    | {
        stateMutability: string;
        type: string;
        inputs?: undefined;
        name?: undefined;
        outputs?: undefined;
      }
    | {
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
        stateMutability: string;
        type: string;
      }
  )[];
  static createInterface(): FuseSafeLiquidatorInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FuseSafeLiquidator;
}
