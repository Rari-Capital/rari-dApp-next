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
export interface RecursivePriceOracleInterface extends utils.Interface {
  functions: {
    "COMPOUND_COMPTROLLER()": FunctionFragment;
    "CREAM_COMPTROLLER()": FunctionFragment;
    "ETH_USD_PRICE_FEED()": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
  };
  encodeFunctionData(
    functionFragment: "COMPOUND_COMPTROLLER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "CREAM_COMPTROLLER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ETH_USD_PRICE_FEED",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [string]
  ): string;
  decodeFunctionResult(
    functionFragment: "COMPOUND_COMPTROLLER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "CREAM_COMPTROLLER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ETH_USD_PRICE_FEED",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  events: {};
}
export interface RecursivePriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: RecursivePriceOracleInterface;
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
    COMPOUND_COMPTROLLER(overrides?: CallOverrides): Promise<[string]>;
    CREAM_COMPTROLLER(overrides?: CallOverrides): Promise<[string]>;
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };
  COMPOUND_COMPTROLLER(overrides?: CallOverrides): Promise<string>;
  CREAM_COMPTROLLER(overrides?: CallOverrides): Promise<string>;
  ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
  /**
   * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
   */
  getUnderlyingPrice(
    cToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  callStatic: {
    COMPOUND_COMPTROLLER(overrides?: CallOverrides): Promise<string>;
    CREAM_COMPTROLLER(overrides?: CallOverrides): Promise<string>;
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  filters: {};
  estimateGas: {
    COMPOUND_COMPTROLLER(overrides?: CallOverrides): Promise<BigNumber>;
    CREAM_COMPTROLLER(overrides?: CallOverrides): Promise<BigNumber>;
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    COMPOUND_COMPTROLLER(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    CREAM_COMPTROLLER(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    ETH_USD_PRICE_FEED(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
