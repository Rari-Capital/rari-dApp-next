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
export interface ChainlinkPriceOracleInterface extends utils.Interface {
  functions: {
    "BTC_ETH_PRICE_FEED()": FunctionFragment;
    "ETH_USD_PRICE_FEED()": FunctionFragment;
    "btcPriceFeeds(address)": FunctionFragment;
    "ethPriceFeeds(address)": FunctionFragment;
    "maxSecondsBeforePriceIsStale()": FunctionFragment;
    "usdPriceFeeds(address)": FunctionFragment;
    "hasPriceFeed(address)": FunctionFragment;
    "price(address)": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
  };
  encodeFunctionData(
    functionFragment: "BTC_ETH_PRICE_FEED",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ETH_USD_PRICE_FEED",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "btcPriceFeeds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "ethPriceFeeds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "maxSecondsBeforePriceIsStale",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "usdPriceFeeds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasPriceFeed",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "price", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [string]
  ): string;
  decodeFunctionResult(
    functionFragment: "BTC_ETH_PRICE_FEED",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ETH_USD_PRICE_FEED",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "btcPriceFeeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ethPriceFeeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxSecondsBeforePriceIsStale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "usdPriceFeeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasPriceFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  events: {};
}
export interface ChainlinkPriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: ChainlinkPriceOracleInterface;
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
    /**
     * Chainlink BTC/ETH price feed contracts.
     */
    BTC_ETH_PRICE_FEED(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Chainlink ETH/USD price feed contracts.
     */
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<[string]>;
    /**
     * Maps ERC20 token addresses to BTC-based Chainlink price feed contracts.
     */
    btcPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    /**
     * Maps ERC20 token addresses to ETH-based Chainlink price feed contracts.
     */
    ethPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    /**
     * The maxmimum number of seconds elapsed since the round was last updated before the price is considered stale. If set to 0, no limit is enforced.
     */
    maxSecondsBeforePriceIsStale(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    /**
     * Maps ERC20 token addresses to USD-based Chainlink price feed contracts.
     */
    usdPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<[string]>;
    /**
     * Returns a boolean indicating if a price feed exists for the underlying asset.
     */
    hasPriceFeed(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };
  /**
   * Chainlink BTC/ETH price feed contracts.
   */
  BTC_ETH_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
  /**
   * Chainlink ETH/USD price feed contracts.
   */
  ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
  /**
   * Maps ERC20 token addresses to BTC-based Chainlink price feed contracts.
   */
  btcPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
  /**
   * Maps ERC20 token addresses to ETH-based Chainlink price feed contracts.
   */
  ethPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
  /**
   * The maxmimum number of seconds elapsed since the round was last updated before the price is considered stale. If set to 0, no limit is enforced.
   */
  maxSecondsBeforePriceIsStale(overrides?: CallOverrides): Promise<BigNumber>;
  /**
   * Maps ERC20 token addresses to USD-based Chainlink price feed contracts.
   */
  usdPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
  /**
   * Returns a boolean indicating if a price feed exists for the underlying asset.
   */
  hasPriceFeed(underlying: string, overrides?: CallOverrides): Promise<boolean>;
  /**
   * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
   */
  price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
  /**
   * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
   */
  getUnderlyingPrice(
    cToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  callStatic: {
    /**
     * Chainlink BTC/ETH price feed contracts.
     */
    BTC_ETH_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
    /**
     * Chainlink ETH/USD price feed contracts.
     */
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<string>;
    /**
     * Maps ERC20 token addresses to BTC-based Chainlink price feed contracts.
     */
    btcPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
    /**
     * Maps ERC20 token addresses to ETH-based Chainlink price feed contracts.
     */
    ethPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
    /**
     * The maxmimum number of seconds elapsed since the round was last updated before the price is considered stale. If set to 0, no limit is enforced.
     */
    maxSecondsBeforePriceIsStale(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps ERC20 token addresses to USD-based Chainlink price feed contracts.
     */
    usdPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<string>;
    /**
     * Returns a boolean indicating if a price feed exists for the underlying asset.
     */
    hasPriceFeed(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
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
    /**
     * Chainlink BTC/ETH price feed contracts.
     */
    BTC_ETH_PRICE_FEED(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Chainlink ETH/USD price feed contracts.
     */
    ETH_USD_PRICE_FEED(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps ERC20 token addresses to BTC-based Chainlink price feed contracts.
     */
    btcPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps ERC20 token addresses to ETH-based Chainlink price feed contracts.
     */
    ethPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * The maxmimum number of seconds elapsed since the round was last updated before the price is considered stale. If set to 0, no limit is enforced.
     */
    maxSecondsBeforePriceIsStale(overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Maps ERC20 token addresses to USD-based Chainlink price feed contracts.
     */
    usdPriceFeeds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Returns a boolean indicating if a price feed exists for the underlying asset.
     */
    hasPriceFeed(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    /**
     * Chainlink BTC/ETH price feed contracts.
     */
    BTC_ETH_PRICE_FEED(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Chainlink ETH/USD price feed contracts.
     */
    ETH_USD_PRICE_FEED(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Maps ERC20 token addresses to BTC-based Chainlink price feed contracts.
     */
    btcPriceFeeds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Maps ERC20 token addresses to ETH-based Chainlink price feed contracts.
     */
    ethPriceFeeds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * The maxmimum number of seconds elapsed since the round was last updated before the price is considered stale. If set to 0, no limit is enforced.
     */
    maxSecondsBeforePriceIsStale(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Maps ERC20 token addresses to USD-based Chainlink price feed contracts.
     */
    usdPriceFeeds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Returns a boolean indicating if a price feed exists for the underlying asset.
     */
    hasPriceFeed(
      underlying: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    /**
     * Returns the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(
      underlying: string,
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
