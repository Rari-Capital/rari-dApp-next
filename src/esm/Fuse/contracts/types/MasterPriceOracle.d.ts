import { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface MasterPriceOracleInterface extends utils.Interface {
    functions: {
        "admin()": FunctionFragment;
        "defaultOracle()": FunctionFragment;
        "oracles(address)": FunctionFragment;
        "canAdminOverwrite()": FunctionFragment;
        "initialize(address[],address[],address,address,bool)": FunctionFragment;
        "add(address[],address[])": FunctionFragment;
        "setDefaultOracle(address)": FunctionFragment;
        "changeAdmin(address)": FunctionFragment;
        "getUnderlyingPrice(address)": FunctionFragment;
        "price(address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "admin", values?: undefined): string;
    encodeFunctionData(functionFragment: "defaultOracle", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracles", values: [string]): string;
    encodeFunctionData(functionFragment: "canAdminOverwrite", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [string[], string[], string, string, boolean]): string;
    encodeFunctionData(functionFragment: "add", values: [string[], string[]]): string;
    encodeFunctionData(functionFragment: "setDefaultOracle", values: [string]): string;
    encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
    encodeFunctionData(functionFragment: "getUnderlyingPrice", values: [string]): string;
    encodeFunctionData(functionFragment: "price", values: [string]): string;
    decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "defaultOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "canAdminOverwrite", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDefaultOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnderlyingPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
    events: {
        "NewAdmin(address,address)": EventFragment;
        "NewDefaultOracle(address,address)": EventFragment;
        "NewOracle(address,address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "NewAdmin"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NewDefaultOracle"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NewOracle"): EventFragment;
}
export declare type NewAdminEvent = TypedEvent<[
    string,
    string
], {
    oldAdmin: string;
    newAdmin: string;
}>;
export declare type NewAdminEventFilter = TypedEventFilter<NewAdminEvent>;
export declare type NewDefaultOracleEvent = TypedEvent<[
    string,
    string
], {
    oldOracle: string;
    newOracle: string;
}>;
export declare type NewDefaultOracleEventFilter = TypedEventFilter<NewDefaultOracleEvent>;
export declare type NewOracleEvent = TypedEvent<[
    string,
    string,
    string
], {
    underlying: string;
    oldOracle: string;
    newOracle: string;
}>;
export declare type NewOracleEventFilter = TypedEventFilter<NewOracleEvent>;
export interface MasterPriceOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MasterPriceOracleInterface;
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
        admin(overrides?: CallOverrides): Promise<[string]>;
        defaultOracle(overrides?: CallOverrides): Promise<[string]>;
        oracles(arg0: string, overrides?: CallOverrides): Promise<[string]>;
        /**
         * Returns a boolean indicating if `admin` can overwrite existing assignments of oracles to underlying tokens.
         */
        canAdminOverwrite(overrides?: CallOverrides): Promise<[boolean]>;
        /**
         * Constructor to initialize state variables.
         * @param _admin The admin who can assign oracles to underlying tokens.
         * @param _canAdminOverwrite Controls if `admin` can overwrite existing assignments of oracles to underlying tokens.
         * @param _defaultOracle The default `PriceOracle` contract to use.
         * @param _oracles The `PriceOracle` contracts to be assigned to `underlyings`.
         * @param underlyings The underlying ERC20 token addresses to link to `_oracles`.
         */
        initialize(underlyings: string[], _oracles: string[], _defaultOracle: string, _admin: string, _canAdminOverwrite: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        /**
         * Sets `_oracles` for `underlyings`.
         */
        add(underlyings: string[], _oracles: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        /**
         * Changes the admin and emits an event.
         */
        setDefaultOracle(newOracle: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        /**
         * Changes the admin and emits an event.
         */
        changeAdmin(newAdmin: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        /**
         * Implements the `PriceOracle` interface for Fuse pools (and Compound v2).
         * Returns the price in ETH of the token underlying `cToken`.
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        /**
         * Attempts to return the price in ETH of `underlying` (implements `BasePriceOracle`).
         */
        price(underlying: string, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    admin(overrides?: CallOverrides): Promise<string>;
    defaultOracle(overrides?: CallOverrides): Promise<string>;
    oracles(arg0: string, overrides?: CallOverrides): Promise<string>;
    /**
     * Returns a boolean indicating if `admin` can overwrite existing assignments of oracles to underlying tokens.
     */
    canAdminOverwrite(overrides?: CallOverrides): Promise<boolean>;
    /**
     * Constructor to initialize state variables.
     * @param _admin The admin who can assign oracles to underlying tokens.
     * @param _canAdminOverwrite Controls if `admin` can overwrite existing assignments of oracles to underlying tokens.
     * @param _defaultOracle The default `PriceOracle` contract to use.
     * @param _oracles The `PriceOracle` contracts to be assigned to `underlyings`.
     * @param underlyings The underlying ERC20 token addresses to link to `_oracles`.
     */
    initialize(underlyings: string[], _oracles: string[], _defaultOracle: string, _admin: string, _canAdminOverwrite: boolean, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    /**
     * Sets `_oracles` for `underlyings`.
     */
    add(underlyings: string[], _oracles: string[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    /**
     * Changes the admin and emits an event.
     */
    setDefaultOracle(newOracle: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    /**
     * Changes the admin and emits an event.
     */
    changeAdmin(newAdmin: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    /**
     * Implements the `PriceOracle` interface for Fuse pools (and Compound v2).
     * Returns the price in ETH of the token underlying `cToken`.
     */
    getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
    /**
     * Attempts to return the price in ETH of `underlying` (implements `BasePriceOracle`).
     */
    price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        admin(overrides?: CallOverrides): Promise<string>;
        defaultOracle(overrides?: CallOverrides): Promise<string>;
        oracles(arg0: string, overrides?: CallOverrides): Promise<string>;
        /**
         * Returns a boolean indicating if `admin` can overwrite existing assignments of oracles to underlying tokens.
         */
        canAdminOverwrite(overrides?: CallOverrides): Promise<boolean>;
        /**
         * Constructor to initialize state variables.
         * @param _admin The admin who can assign oracles to underlying tokens.
         * @param _canAdminOverwrite Controls if `admin` can overwrite existing assignments of oracles to underlying tokens.
         * @param _defaultOracle The default `PriceOracle` contract to use.
         * @param _oracles The `PriceOracle` contracts to be assigned to `underlyings`.
         * @param underlyings The underlying ERC20 token addresses to link to `_oracles`.
         */
        initialize(underlyings: string[], _oracles: string[], _defaultOracle: string, _admin: string, _canAdminOverwrite: boolean, overrides?: CallOverrides): Promise<void>;
        /**
         * Sets `_oracles` for `underlyings`.
         */
        add(underlyings: string[], _oracles: string[], overrides?: CallOverrides): Promise<void>;
        /**
         * Changes the admin and emits an event.
         */
        setDefaultOracle(newOracle: string, overrides?: CallOverrides): Promise<void>;
        /**
         * Changes the admin and emits an event.
         */
        changeAdmin(newAdmin: string, overrides?: CallOverrides): Promise<void>;
        /**
         * Implements the `PriceOracle` interface for Fuse pools (and Compound v2).
         * Returns the price in ETH of the token underlying `cToken`.
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Attempts to return the price in ETH of `underlying` (implements `BasePriceOracle`).
         */
        price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "NewAdmin(address,address)"(oldAdmin?: null, newAdmin?: null): NewAdminEventFilter;
        NewAdmin(oldAdmin?: null, newAdmin?: null): NewAdminEventFilter;
        "NewDefaultOracle(address,address)"(oldOracle?: null, newOracle?: null): NewDefaultOracleEventFilter;
        NewDefaultOracle(oldOracle?: null, newOracle?: null): NewDefaultOracleEventFilter;
        "NewOracle(address,address,address)"(underlying?: null, oldOracle?: null, newOracle?: null): NewOracleEventFilter;
        NewOracle(underlying?: null, oldOracle?: null, newOracle?: null): NewOracleEventFilter;
    };
    estimateGas: {
        admin(overrides?: CallOverrides): Promise<BigNumber>;
        defaultOracle(overrides?: CallOverrides): Promise<BigNumber>;
        oracles(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Returns a boolean indicating if `admin` can overwrite existing assignments of oracles to underlying tokens.
         */
        canAdminOverwrite(overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Constructor to initialize state variables.
         * @param _admin The admin who can assign oracles to underlying tokens.
         * @param _canAdminOverwrite Controls if `admin` can overwrite existing assignments of oracles to underlying tokens.
         * @param _defaultOracle The default `PriceOracle` contract to use.
         * @param _oracles The `PriceOracle` contracts to be assigned to `underlyings`.
         * @param underlyings The underlying ERC20 token addresses to link to `_oracles`.
         */
        initialize(underlyings: string[], _oracles: string[], _defaultOracle: string, _admin: string, _canAdminOverwrite: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        /**
         * Sets `_oracles` for `underlyings`.
         */
        add(underlyings: string[], _oracles: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        /**
         * Changes the admin and emits an event.
         */
        setDefaultOracle(newOracle: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        /**
         * Changes the admin and emits an event.
         */
        changeAdmin(newAdmin: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        /**
         * Implements the `PriceOracle` interface for Fuse pools (and Compound v2).
         * Returns the price in ETH of the token underlying `cToken`.
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<BigNumber>;
        /**
         * Attempts to return the price in ETH of `underlying` (implements `BasePriceOracle`).
         */
        price(underlying: string, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        defaultOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracles(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Returns a boolean indicating if `admin` can overwrite existing assignments of oracles to underlying tokens.
         */
        canAdminOverwrite(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Constructor to initialize state variables.
         * @param _admin The admin who can assign oracles to underlying tokens.
         * @param _canAdminOverwrite Controls if `admin` can overwrite existing assignments of oracles to underlying tokens.
         * @param _defaultOracle The default `PriceOracle` contract to use.
         * @param _oracles The `PriceOracle` contracts to be assigned to `underlyings`.
         * @param underlyings The underlying ERC20 token addresses to link to `_oracles`.
         */
        initialize(underlyings: string[], _oracles: string[], _defaultOracle: string, _admin: string, _canAdminOverwrite: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        /**
         * Sets `_oracles` for `underlyings`.
         */
        add(underlyings: string[], _oracles: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        /**
         * Changes the admin and emits an event.
         */
        setDefaultOracle(newOracle: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        /**
         * Changes the admin and emits an event.
         */
        changeAdmin(newAdmin: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        /**
         * Implements the `PriceOracle` interface for Fuse pools (and Compound v2).
         * Returns the price in ETH of the token underlying `cToken`.
         */
        getUnderlyingPrice(cToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        /**
         * Attempts to return the price in ETH of `underlying` (implements `BasePriceOracle`).
         */
        price(underlying: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
