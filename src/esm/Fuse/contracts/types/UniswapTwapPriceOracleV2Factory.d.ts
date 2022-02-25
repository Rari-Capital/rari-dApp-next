import {
  BaseContract,
  BigNumber,
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
export interface UniswapTwapPriceOracleV2FactoryInterface
  extends utils.Interface {
  functions: {
    "WETH()": FunctionFragment;
    "logic()": FunctionFragment;
    "oracles(address,address)": FunctionFragment;
    "rootOracle()": FunctionFragment;
    "deploy(address,address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(functionFragment: "logic", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oracles",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "rootOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deploy",
    values: [string, string]
  ): string;
  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "logic", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rootOracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  events: {};
}
export interface UniswapTwapPriceOracleV2Factory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: UniswapTwapPriceOracleV2FactoryInterface;
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
     * Maps `UniswapV2Factory` contracts to base tokens to `UniswapTwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[string]>;
    rootOracle(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Deploys a `UniswapTwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param uniswapV2Factory The `UniswapV2Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV2Factory: string,
      baseToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  WETH(overrides?: CallOverrides): Promise<string>;
  logic(overrides?: CallOverrides): Promise<string>;
  /**
   * Maps `UniswapV2Factory` contracts to base tokens to `UniswapTwapPriceOracleV2` contract addresses.
   */
  oracles(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;
  rootOracle(overrides?: CallOverrides): Promise<string>;
  /**
   * Deploys a `UniswapTwapPriceOracleV2`.
   * @param baseToken The base token of the pairs for which this oracle will be used.
   * @param uniswapV2Factory The `UniswapV2Factory` contract of the pairs for which this oracle will be used.
   */
  deploy(
    uniswapV2Factory: string,
    baseToken: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    WETH(overrides?: CallOverrides): Promise<string>;
    logic(overrides?: CallOverrides): Promise<string>;
    /**
     * Maps `UniswapV2Factory` contracts to base tokens to `UniswapTwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;
    rootOracle(overrides?: CallOverrides): Promise<string>;
    /**
     * Deploys a `UniswapTwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param uniswapV2Factory The `UniswapV2Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV2Factory: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };
  filters: {};
  estimateGas: {
    WETH(overrides?: CallOverrides): Promise<BigNumber>;
    logic(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps `UniswapV2Factory` contracts to base tokens to `UniswapTwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    rootOracle(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Deploys a `UniswapTwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param uniswapV2Factory The `UniswapV2Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV2Factory: string,
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
     * Maps `UniswapV2Factory` contracts to base tokens to `UniswapTwapPriceOracleV2` contract addresses.
     */
    oracles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    rootOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    /**
     * Deploys a `UniswapTwapPriceOracleV2`.
     * @param baseToken The base token of the pairs for which this oracle will be used.
     * @param uniswapV2Factory The `UniswapV2Factory` contract of the pairs for which this oracle will be used.
     */
    deploy(
      uniswapV2Factory: string,
      baseToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
