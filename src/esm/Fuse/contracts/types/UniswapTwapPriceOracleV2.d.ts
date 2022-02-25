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
export interface UniswapTwapPriceOracleV2Interface extends utils.Interface {
  functions: {
    "MIN_TWAP_TIME()": FunctionFragment;
    "OBSERVATION_BUFFER()": FunctionFragment;
    "WETH()": FunctionFragment;
    "observationCount(address)": FunctionFragment;
    "observations(address,uint256)": FunctionFragment;
    "price(address,address,address)": FunctionFragment;
    "pairsFor(address[],address[],address)": FunctionFragment;
    "workable(address[],address[],uint256[],uint256[])": FunctionFragment;
    "update(address)": FunctionFragment;
  };
  encodeFunctionData(
    functionFragment: "MIN_TWAP_TIME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "OBSERVATION_BUFFER",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "observationCount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "observations",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "price",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "pairsFor",
    values: [string[], string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "workable",
    values: [string[], string[], BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "update", values: [string]): string;
  decodeFunctionResult(
    functionFragment: "MIN_TWAP_TIME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "OBSERVATION_BUFFER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "observationCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "observations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pairsFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "workable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "update", data: BytesLike): Result;
  events: {};
}
export interface UniswapTwapPriceOracleV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: UniswapTwapPriceOracleV2Interface;
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
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<[BigNumber]>;
    OBSERVATION_BUFFER(overrides?: CallOverrides): Promise<[number]>;
    WETH(overrides?: CallOverrides): Promise<[string]>;
    observationCount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    observations(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber] & {
        timestamp: number;
        price0Cumulative: BigNumber;
        price1Cumulative: BigNumber;
      }
    >;
    price(
      underlying: string,
      baseToken: string,
      factory: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    pairsFor(
      tokenA: string[],
      tokenB: string[],
      factory: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;
    workable(
      pairs: string[],
      baseTokens: string[],
      minPeriods: BigNumberish[],
      deviationThresholds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[boolean[]]>;
    "update(address)"(
      pair: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "update(address[])"(
      pairs: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
  OBSERVATION_BUFFER(overrides?: CallOverrides): Promise<number>;
  WETH(overrides?: CallOverrides): Promise<string>;
  observationCount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  observations(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, BigNumber, BigNumber] & {
      timestamp: number;
      price0Cumulative: BigNumber;
      price1Cumulative: BigNumber;
    }
  >;
  price(
    underlying: string,
    baseToken: string,
    factory: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  pairsFor(
    tokenA: string[],
    tokenB: string[],
    factory: string,
    overrides?: CallOverrides
  ): Promise<string[]>;
  workable(
    pairs: string[],
    baseTokens: string[],
    minPeriods: BigNumberish[],
    deviationThresholds: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<boolean[]>;
  "update(address)"(
    pair: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "update(address[])"(
    pairs: string[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    OBSERVATION_BUFFER(overrides?: CallOverrides): Promise<number>;
    WETH(overrides?: CallOverrides): Promise<string>;
    observationCount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    observations(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber] & {
        timestamp: number;
        price0Cumulative: BigNumber;
        price1Cumulative: BigNumber;
      }
    >;
    price(
      underlying: string,
      baseToken: string,
      factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    pairsFor(
      tokenA: string[],
      tokenB: string[],
      factory: string,
      overrides?: CallOverrides
    ): Promise<string[]>;
    workable(
      pairs: string[],
      baseTokens: string[],
      minPeriods: BigNumberish[],
      deviationThresholds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean[]>;
    "update(address)"(pair: string, overrides?: CallOverrides): Promise<void>;
    "update(address[])"(
      pairs: string[],
      overrides?: CallOverrides
    ): Promise<void>;
  };
  filters: {};
  estimateGas: {
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<BigNumber>;
    OBSERVATION_BUFFER(overrides?: CallOverrides): Promise<BigNumber>;
    WETH(overrides?: CallOverrides): Promise<BigNumber>;
    observationCount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    observations(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    price(
      underlying: string,
      baseToken: string,
      factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    pairsFor(
      tokenA: string[],
      tokenB: string[],
      factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    workable(
      pairs: string[],
      baseTokens: string[],
      minPeriods: BigNumberish[],
      deviationThresholds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    "update(address)"(
      pair: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "update(address[])"(
      pairs: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    MIN_TWAP_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    OBSERVATION_BUFFER(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    observationCount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    observations(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    price(
      underlying: string,
      baseToken: string,
      factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    pairsFor(
      tokenA: string[],
      tokenB: string[],
      factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    workable(
      pairs: string[],
      baseTokens: string[],
      minPeriods: BigNumberish[],
      deviationThresholds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    "update(address)"(
      pair: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "update(address[])"(
      pairs: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
