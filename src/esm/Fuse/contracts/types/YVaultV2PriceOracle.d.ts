import { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface YVaultV2PriceOracleInterface extends utils.Interface {
    functions: {
        "getUnderlyingPrice(address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "getUnderlyingPrice", values: [string]): string;
    decodeFunctionResult(functionFragment: "getUnderlyingPrice", data: BytesLike): Result;
    events: {};
}
export interface YVaultV2PriceOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: YVaultV2PriceOracleInterface;
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
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    /**
     * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
     */
    getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        /**
         * Returns the price in ETH of the token underlying `cToken` (implements `PriceOracle`).
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
