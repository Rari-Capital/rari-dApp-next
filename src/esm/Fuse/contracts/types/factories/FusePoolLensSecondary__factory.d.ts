import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  FusePoolLensSecondary,
  FusePoolLensSecondaryInterface,
} from "../FusePoolLensSecondary";
export declare class FusePoolLensSecondary__factory {
  static readonly abi: (
    | {
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: (
          | {
              internalType: string;
              name: string;
              type: string;
              components?: undefined;
            }
          | {
              components: {
                internalType: string;
                name: string;
                type: string;
              }[];
              internalType: string;
              name: string;
              type: string;
            }
        )[];
        stateMutability: string;
        type: string;
        constant: boolean;
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
        constant?: undefined;
      }
  )[];
  static createInterface(): FusePoolLensSecondaryInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FusePoolLensSecondary;
}
