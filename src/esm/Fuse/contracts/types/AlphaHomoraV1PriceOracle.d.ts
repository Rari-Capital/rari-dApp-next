import { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface AlphaHomoraV1PriceOracleInterface extends utils.Interface {
    functions: {
        "IBETH()": FunctionFragment;
        "getUnderlyingPrice(address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "IBETH", values?: undefined): string;
    encodeFunctionData(functionFragment: "getUnderlyingPrice", values: [string]): string;
    decodeFunctionResult(functionFragment: "IBETH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnderlyingPrice", data: BytesLike): Result;
    events: {};
}
export interface AlphaHomoraV1PriceOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AlphaHomoraV1PriceOracleInterface;
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
        IBETH(overrides?: CallOverrides): Promise<[string]>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    IBETH(overrides?: CallOverrides): Promise<string>;
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        IBETH(overrides?: CallOverrides): Promise<string>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        IBETH(overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        IBETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
