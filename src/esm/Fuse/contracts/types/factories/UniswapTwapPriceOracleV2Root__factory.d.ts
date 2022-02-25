import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  UniswapTwapPriceOracleV2Root,
  UniswapTwapPriceOracleV2RootInterface,
} from "../UniswapTwapPriceOracleV2Root";
export declare class UniswapTwapPriceOracleV2Root__factory {
  static readonly abi: {
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
  }[];
  static createInterface(): UniswapTwapPriceOracleV2RootInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapTwapPriceOracleV2Root;
}
