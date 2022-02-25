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
export interface CurveLpTokenPriceOracleInterface extends utils.Interface {
  functions: {
    "poolOf(address)": FunctionFragment;
    "registry()": FunctionFragment;
    "underlyingTokens(address,uint256)": FunctionFragment;
    "price(address)": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
    "registerPool(address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "poolOf", values: [string]): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "underlyingTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "price", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "registerPool",
    values: [string]
  ): string;
  decodeFunctionResult(functionFragment: "poolOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "underlyingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerPool",
    data: BytesLike
  ): Result;
  events: {};
}
export interface CurveLpTokenPriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: CurveLpTokenPriceOracleInterface;
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
    poolOf(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    registry(overrides?: CallOverrides): Promise<[string]>;
    underlyingTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
    /**
     * Get the LP token price price for an underlying token address.
     * @param underlying The underlying token address for which to get the price (set to zero address for ETH).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    /**
     * Implements the PriceOracle interface for Fuse pools (and Compound v2).
     * Get the underlying price of a cToken.
     * @param cToken The cToken address for price retrieval.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    /**
     * Register the pool given LP token address and set the pool info.
     * @param lpToken LP token to find the corresponding pool.
     */
    registerPool(
      lpToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  poolOf(arg0: string, overrides?: CallOverrides): Promise<string>;
  registry(overrides?: CallOverrides): Promise<string>;
  underlyingTokens(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;
  /**
   * Get the LP token price price for an underlying token address.
   * @param underlying The underlying token address for which to get the price (set to zero address for ETH).
   */
  price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
  /**
   * Implements the PriceOracle interface for Fuse pools (and Compound v2).
   * Get the underlying price of a cToken.
   * @param cToken The cToken address for price retrieval.
   */
  getUnderlyingPrice(
    cToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  /**
   * Register the pool given LP token address and set the pool info.
   * @param lpToken LP token to find the corresponding pool.
   */
  registerPool(
    lpToken: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    poolOf(arg0: string, overrides?: CallOverrides): Promise<string>;
    registry(overrides?: CallOverrides): Promise<string>;
    underlyingTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
    /**
     * Get the LP token price price for an underlying token address.
     * @param underlying The underlying token address for which to get the price (set to zero address for ETH).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Implements the PriceOracle interface for Fuse pools (and Compound v2).
     * Get the underlying price of a cToken.
     * @param cToken The cToken address for price retrieval.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Register the pool given LP token address and set the pool info.
     * @param lpToken LP token to find the corresponding pool.
     */
    registerPool(lpToken: string, overrides?: CallOverrides): Promise<void>;
  };
  filters: {};
  estimateGas: {
    poolOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    registry(overrides?: CallOverrides): Promise<BigNumber>;
    underlyingTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Get the LP token price price for an underlying token address.
     * @param underlying The underlying token address for which to get the price (set to zero address for ETH).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Implements the PriceOracle interface for Fuse pools (and Compound v2).
     * Get the underlying price of a cToken.
     * @param cToken The cToken address for price retrieval.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Register the pool given LP token address and set the pool info.
     * @param lpToken LP token to find the corresponding pool.
     */
    registerPool(
      lpToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    poolOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    underlyingTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Get the LP token price price for an underlying token address.
     * @param underlying The underlying token address for which to get the price (set to zero address for ETH).
     */
    price(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Implements the PriceOracle interface for Fuse pools (and Compound v2).
     * Get the underlying price of a cToken.
     * @param cToken The cToken address for price retrieval.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Register the pool given LP token address and set the pool info.
     * @param lpToken LP token to find the corresponding pool.
     */
    registerPool(
      lpToken: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
