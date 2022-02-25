import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface UniswapV3TwapPriceOracleV2FactoryInterface
  extends utils.Interface {
  functions: {
    "WETH()": FunctionFragment;
    "logic()": FunctionFragment;
    "oracles(address,uint256,address)": FunctionFragment;
    "deploy(address,uint24,address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(functionFragment: "logic", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oracles",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "deploy",
    values: [string, BigNumberish, string]
  ): string;
  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "logic", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  events: {};
}
export interface UniswapV3TwapPriceOracleV2Factory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: UniswapV3TwapPriceOracleV2FactoryInterface;
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;
  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;
  functions: {
    WETH(overrides?: CallOverrides): Promise<[string]>;
    logic(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Maps `UniswapV3Factory` contracts to fee tiers to base tokens to `UniswapV3TwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<[string]>;
    /**
     * Deploys a `UniswapV3TwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param feeTier The fee tier of the pairs for which this oracle will be used.
     * @param uniswapV3Factory The `UniswapV3Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV3Factory: string,
      feeTier: BigNumberish,
      baseToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  WETH(overrides?: CallOverrides): Promise<string>;
  logic(overrides?: CallOverrides): Promise<string>;
  /**
   * Maps `UniswapV3Factory` contracts to fee tiers to base tokens to `UniswapV3TwapPriceOracleV2` contract addresses.
   */
  oracles(
    arg0: string,
    arg1: BigNumberish,
    arg2: string,
    overrides?: CallOverrides
  ): Promise<string>;
  /**
   * Deploys a `UniswapV3TwapPriceOracleV2`.
   * @param baseToken The base token of the pairs for which this oracle will be used.
   * @param feeTier The fee tier of the pairs for which this oracle will be used.
   * @param uniswapV3Factory The `UniswapV3Factory` contract of the pairs for which this oracle will be used.
   */
  deploy(
    uniswapV3Factory: string,
    feeTier: BigNumberish,
    baseToken: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    WETH(overrides?: CallOverrides): Promise<string>;
    logic(overrides?: CallOverrides): Promise<string>;
    /**
     * Maps `UniswapV3Factory` contracts to fee tiers to base tokens to `UniswapV3TwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<string>;
    /**
     * Deploys a `UniswapV3TwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param feeTier The fee tier of the pairs for which this oracle will be used.
     * @param uniswapV3Factory The `UniswapV3Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV3Factory: string,
      feeTier: BigNumberish,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };
  filters: {};
  estimateGas: {
    WETH(overrides?: CallOverrides): Promise<BigNumber>;
    logic(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps `UniswapV3Factory` contracts to fee tiers to base tokens to `UniswapV3TwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Deploys a `UniswapV3TwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param feeTier The fee tier of the pairs for which this oracle will be used.
     * @param uniswapV3Factory The `UniswapV3Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV3Factory: string,
      feeTier: BigNumberish,
      baseToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    logic(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    /**
     * Maps `UniswapV3Factory` contracts to fee tiers to base tokens to `UniswapV3TwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Deploys a `UniswapV3TwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param feeTier The fee tier of the pairs for which this oracle will be used.
     * @param uniswapV3Factory The `UniswapV3Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV3Factory: string,
      feeTier: BigNumberish,
      baseToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
