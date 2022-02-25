import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  FuseFeeDistributor,
  FuseFeeDistributorInterface,
} from "../FuseFeeDistributor";
export declare class FuseFeeDistributor__factory {
  static readonly abi: (
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
        outputs?: undefined;
        stateMutability?: undefined;
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
        anonymous?: undefined;
      }
    | {
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        inputs?: undefined;
        name?: undefined;
        outputs?: undefined;
      }
  )[];
  static createInterface(): FuseFeeDistributorInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FuseFeeDistributor;
}
