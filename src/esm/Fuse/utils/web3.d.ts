import { BigNumber, BigNumberish, Contract } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
export declare const createContract: (address: string, abi: any, provider: Web3Provider) => Contract;
export declare const toBN: (input: BigNumberish) => BigNumber;
