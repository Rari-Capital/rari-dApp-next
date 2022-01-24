import { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface UniswapLpTokenPriceOracleInterface extends utils.Interface {
    functions: {
        "price(address)": FunctionFragment;
        "getUnderlyingPrice(address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "price", values: [string]): string;
    encodeFunctionData(functionFragment: "getUnderlyingPrice", values: [string]): string;
    decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnderlyingPrice", data: BytesLike): Result;
    events: {};
}
export interface UniswapLpTokenPriceOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: UniswapLpTokenPriceOracleInterface;
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
         * Get the LP token price price for an underlying token address.
         * @param underlying The underlying token address for which to get the price (set to zero address for ETH)
         */
        price(underlying: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        /**
         * Implements the PriceOracle interface for Fuse pools (and Compound v2).
         * Get the underlying price of a cToken.
         * @param cToken The cToken address for price retrieval
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    /**
     * Get the LP token price price for an underlying token address.
     * @param underlying The underlying token address for which to get the price (set to zero address for ETH)
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Implements the PriceOracle interface for Fuse pools (and Compound v2).
     * Get the underlying price of a cToken.
     * @param cToken The cToken address for price retrieval
     */
    getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        /**
         * Get the LP token price price for an underlying token address.
         * @param underlying The underlying token address for which to get the price (set to zero address for ETH)
         */
        price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Implements the PriceOracle interface for Fuse pools (and Compound v2).
         * Get the underlying price of a cToken.
         * @param cToken The cToken address for price retrieval
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        /**
         * Get the LP token price price for an underlying token address.
         * @param underlying The underlying token address for which to get the price (set to zero address for ETH)
         */
        price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Implements the PriceOracle interface for Fuse pools (and Compound v2).
         * Get the underlying price of a cToken.
         * @param cToken The cToken address for price retrieval
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        /**
         * Get the LP token price price for an underlying token address.
         * @param underlying The underlying token address for which to get the price (set to zero address for ETH)
         */
        price(underlying: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Implements the PriceOracle interface for Fuse pools (and Compound v2).
         * Get the underlying price of a cToken.
         * @param cToken The cToken address for price retrieval
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
