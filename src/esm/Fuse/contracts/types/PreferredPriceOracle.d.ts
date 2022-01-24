import { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface PreferredPriceOracleInterface extends utils.Interface {
    functions: {
        "chainlinkOracle()": FunctionFragment;
        "secondaryOracle()": FunctionFragment;
        "getUnderlyingPrice(address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "chainlinkOracle", values?: undefined): string;
    encodeFunctionData(functionFragment: "secondaryOracle", values?: undefined): string;
    encodeFunctionData(functionFragment: "getUnderlyingPrice", values: [string]): string;
    decodeFunctionResult(functionFragment: "chainlinkOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "secondaryOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnderlyingPrice", data: BytesLike): Result;
    events: {};
}
export interface PreferredPriceOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: PreferredPriceOracleInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        chainlinkOracle(overrides?: CallOverrides): Promise<[string]>;
        secondaryOracle(overrides?: CallOverrides): Promise<[string]>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    chainlinkOracle(overrides?: CallOverrides): Promise<string>;
    secondaryOracle(overrides?: CallOverrides): Promise<string>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        chainlinkOracle(overrides?: CallOverrides): Promise<string>;
        secondaryOracle(overrides?: CallOverrides): Promise<string>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        chainlinkOracle(overrides?: CallOverrides): Promise<BigNumber>;
        secondaryOracle(overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        chainlinkOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        secondaryOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
