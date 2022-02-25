import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface Keep3rPriceOracleInterface extends utils.Interface {
  functions: {
    "MAX_TWAP_TIME()": FunctionFragment;
    "MIN_TWAP_TIME()": FunctionFragment;
    "WETH_ADDRESS()": FunctionFragment;
    "rootOracle()": FunctionFragment;
    "uniswapV2Factory()": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
    "price(address)": FunctionFragment;
  };
  encodeFunctionData(
    functionFragment: "MAX_TWAP_TIME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MIN_TWAP_TIME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "WETH_ADDRESS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rootOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV2Factory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "price", values: [string]): string;
  decodeFunctionResult(
    functionFragment: "MAX_TWAP_TIME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MIN_TWAP_TIME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "WETH_ADDRESS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rootOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV2Factory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  events: {};
}
export interface Keep3rPriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: Keep3rPriceOracleInterface;
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
    MAX_TWAP_TIME(overrides?: CallOverrides): Promise<[BigNumber]>;
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<[BigNumber]>;
    WETH_ADDRESS(overrides?: CallOverrides): Promise<[string]>;
    rootOracle(overrides?: CallOverrides): Promise<[string]>;
    uniswapV2Factory(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`). Prices are expected to be scaled by `10 ** (36 - underlyingDecimals)`.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };
  MAX_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
  MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
  WETH_ADDRESS(overrides?: CallOverrides): Promise<string>;
  rootOracle(overrides?: CallOverrides): Promise<string>;
  uniswapV2Factory(overrides?: CallOverrides): Promise<string>;
  /**
   * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`). Prices are expected to be scaled by `10 ** (36 - underlyingDecimals)`.
   */
  getUnderlyingPrice(
    cToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  /**
   * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
   */
  price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
  callStatic: {
    MAX_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    WETH_ADDRESS(overrides?: CallOverrides): Promise<string>;
    rootOracle(overrides?: CallOverrides): Promise<string>;
    uniswapV2Factory(overrides?: CallOverrides): Promise<string>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`). Prices are expected to be scaled by `10 ** (36 - underlyingDecimals)`.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
  };
  filters: {};
  estimateGas: {
    MAX_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    WETH_ADDRESS(overrides?: CallOverrides): Promise<BigNumber>;
    rootOracle(overrides?: CallOverrides): Promise<BigNumber>;
    uniswapV2Factory(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`). Prices are expected to be scaled by `10 ** (36 - underlyingDecimals)`.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
  };
  populateTransaction: {
    MAX_TWAP_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    WETH_ADDRESS(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    rootOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    uniswapV2Factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`). Prices are expected to be scaled by `10 ** (36 - underlyingDecimals)`.
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
