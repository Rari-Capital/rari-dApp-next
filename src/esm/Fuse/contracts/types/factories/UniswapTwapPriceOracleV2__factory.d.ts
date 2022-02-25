import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  UniswapTwapPriceOracleV2,
  UniswapTwapPriceOracleV2Interface,
} from "../UniswapTwapPriceOracleV2";
export declare class UniswapTwapPriceOracleV2__factory {
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
  static createInterface(): UniswapTwapPriceOracleV2Interface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapTwapPriceOracleV2;
}
