import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface FuseFeeDistributorInterface extends utils.Interface {
    functions: {
        "_latestCErc20Delegate(address)": FunctionFragment;
        "_latestCEtherDelegate(address)": FunctionFragment;
        "cErc20DelegateWhitelist(address,address,bool)": FunctionFragment;
        "cEtherDelegateWhitelist(address,address,bool)": FunctionFragment;
        "comptrollerImplementationWhitelist(address,address)": FunctionFragment;
        "customInterestFeeRates(address)": FunctionFragment;
        "defaultInterestFeeRate()": FunctionFragment;
        "maxSupplyEth()": FunctionFragment;
        "maxUtilizationRate()": FunctionFragment;
        "minBorrowEth()": FunctionFragment;
        "owner()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "initialize(uint256)": FunctionFragment;
        "_setDefaultInterestFeeRate(uint256)": FunctionFragment;
        "_withdrawAssets(address)": FunctionFragment;
        "_setPoolLimits(uint256,uint256,uint256)": FunctionFragment;
        "_callPool(address[],bytes[])": FunctionFragment;
        "deployCEther(bytes)": FunctionFragment;
        "deployCErc20(bytes)": FunctionFragment;
        "_editComptrollerImplementationWhitelist(address[],address[],bool[])": FunctionFragment;
        "_editCErc20DelegateWhitelist(address[],address[],bool[],bool[])": FunctionFragment;
        "_editCEtherDelegateWhitelist(address[],address[],bool[],bool[])": FunctionFragment;
        "latestComptrollerImplementation(address)": FunctionFragment;
        "_setLatestComptrollerImplementation(address,address)": FunctionFragment;
        "latestCErc20Delegate(address)": FunctionFragment;
        "latestCEtherDelegate(address)": FunctionFragment;
        "_setLatestCEtherDelegate(address,address,bool,bytes)": FunctionFragment;
        "_setLatestCErc20Delegate(address,address,bool,bytes)": FunctionFragment;
        "interestFeeRate()": FunctionFragment;
        "_setCustomInterestFeeRate(address,int256)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "_latestCErc20Delegate", values: [string]): string;
    encodeFunctionData(functionFragment: "_latestCEtherDelegate", values: [string]): string;
    encodeFunctionData(functionFragment: "cErc20DelegateWhitelist", values: [string, string, boolean]): string;
    encodeFunctionData(functionFragment: "cEtherDelegateWhitelist", values: [string, string, boolean]): string;
    encodeFunctionData(functionFragment: "comptrollerImplementationWhitelist", values: [string, string]): string;
    encodeFunctionData(functionFragment: "customInterestFeeRates", values: [string]): string;
    encodeFunctionData(functionFragment: "defaultInterestFeeRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxSupplyEth", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxUtilizationRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "minBorrowEth", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string;
    encodeFunctionData(functionFragment: "initialize", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "_setDefaultInterestFeeRate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "_withdrawAssets", values: [string]): string;
    encodeFunctionData(functionFragment: "_setPoolLimits", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "_callPool", values: [string[], BytesLike[]]): string;
    encodeFunctionData(functionFragment: "deployCEther", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "deployCErc20", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "_editComptrollerImplementationWhitelist", values: [string[], string[], boolean[]]): string;
    encodeFunctionData(functionFragment: "_editCErc20DelegateWhitelist", values: [string[], string[], boolean[], boolean[]]): string;
    encodeFunctionData(functionFragment: "_editCEtherDelegateWhitelist", values: [string[], string[], boolean[], boolean[]]): string;
    encodeFunctionData(functionFragment: "latestComptrollerImplementation", values: [string]): string;
    encodeFunctionData(functionFragment: "_setLatestComptrollerImplementation", values: [string, string]): string;
    encodeFunctionData(functionFragment: "latestCErc20Delegate", values: [string]): string;
    encodeFunctionData(functionFragment: "latestCEtherDelegate", values: [string]): string;
    encodeFunctionData(functionFragment: "_setLatestCEtherDelegate", values: [string, string, boolean, BytesLike]): string;
    encodeFunctionData(functionFragment: "_setLatestCErc20Delegate", values: [string, string, boolean, BytesLike]): string;
    encodeFunctionData(functionFragment: "interestFeeRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "_setCustomInterestFeeRate", values: [string, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "_latestCErc20Delegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_latestCEtherDelegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cErc20DelegateWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cEtherDelegateWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "comptrollerImplementationWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "customInterestFeeRates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "defaultInterestFeeRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxSupplyEth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxUtilizationRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minBorrowEth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setDefaultInterestFeeRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_withdrawAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setPoolLimits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_callPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployCEther", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployCErc20", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_editComptrollerImplementationWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_editCErc20DelegateWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_editCEtherDelegateWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "latestComptrollerImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setLatestComptrollerImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "latestCErc20Delegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "latestCEtherDelegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setLatestCEtherDelegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setLatestCErc20Delegate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "interestFeeRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_setCustomInterestFeeRate", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], {
    previousOwner: string;
    newOwner: string;
}>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface FuseFeeDistributor extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: FuseFeeDistributorInterface;
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
        _latestCErc20Delegate(arg0: string, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            string
        ] & {
            implementation: string;
            allowResign: boolean;
            becomeImplementationData: string;
        }>;
        _latestCEtherDelegate(arg0: string, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            string
        ] & {
            implementation: string;
            allowResign: boolean;
            becomeImplementationData: string;
        }>;
        cErc20DelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<[boolean]>;
        cEtherDelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<[boolean]>;
        comptrollerImplementationWhitelist(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[boolean]>;
        customInterestFeeRates(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        defaultInterestFeeRate(overrides?: CallOverrides): Promise<[BigNumber]>;
        maxSupplyEth(overrides?: CallOverrides): Promise<[BigNumber]>;
        maxUtilizationRate(overrides?: CallOverrides): Promise<[BigNumber]>;
        minBorrowEth(overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        initialize(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _setDefaultInterestFeeRate(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _withdrawAssets(erc20Contract: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _setPoolLimits(_minBorrowEth: BigNumberish, _maxSupplyEth: BigNumberish, _maxUtilizationRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "_callPool(address[],bytes[])"(targets: string[], data: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "_callPool(address[],bytes)"(targets: string[], data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        deployCEther(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        deployCErc20(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _editComptrollerImplementationWhitelist(oldImplementations: string[], newImplementations: string[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _editCErc20DelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _editCEtherDelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        latestComptrollerImplementation(oldImplementation: string, overrides?: CallOverrides): Promise<[string]>;
        _setLatestComptrollerImplementation(oldImplementation: string, newImplementation: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        latestCErc20Delegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
        latestCEtherDelegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
        _setLatestCEtherDelegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        _setLatestCErc20Delegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        interestFeeRate(overrides?: CallOverrides): Promise<[BigNumber]>;
        _setCustomInterestFeeRate(comptroller: string, rate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    _latestCErc20Delegate(arg0: string, overrides?: CallOverrides): Promise<[
        string,
        boolean,
        string
    ] & {
        implementation: string;
        allowResign: boolean;
        becomeImplementationData: string;
    }>;
    _latestCEtherDelegate(arg0: string, overrides?: CallOverrides): Promise<[
        string,
        boolean,
        string
    ] & {
        implementation: string;
        allowResign: boolean;
        becomeImplementationData: string;
    }>;
    cErc20DelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<boolean>;
    cEtherDelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<boolean>;
    comptrollerImplementationWhitelist(arg0: string, arg1: string, overrides?: CallOverrides): Promise<boolean>;
    customInterestFeeRates(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    defaultInterestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
    maxSupplyEth(overrides?: CallOverrides): Promise<BigNumber>;
    maxUtilizationRate(overrides?: CallOverrides): Promise<BigNumber>;
    minBorrowEth(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    initialize(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _setDefaultInterestFeeRate(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _withdrawAssets(erc20Contract: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _setPoolLimits(_minBorrowEth: BigNumberish, _maxSupplyEth: BigNumberish, _maxUtilizationRate: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "_callPool(address[],bytes[])"(targets: string[], data: BytesLike[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "_callPool(address[],bytes)"(targets: string[], data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    deployCEther(constructorData: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    deployCErc20(constructorData: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _editComptrollerImplementationWhitelist(oldImplementations: string[], newImplementations: string[], statuses: boolean[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _editCErc20DelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _editCEtherDelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    latestComptrollerImplementation(oldImplementation: string, overrides?: CallOverrides): Promise<string>;
    _setLatestComptrollerImplementation(oldImplementation: string, newImplementation: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    latestCErc20Delegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
    latestCEtherDelegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
    _setLatestCEtherDelegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    _setLatestCErc20Delegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    interestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
    _setCustomInterestFeeRate(comptroller: string, rate: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        _latestCErc20Delegate(arg0: string, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            string
        ] & {
            implementation: string;
            allowResign: boolean;
            becomeImplementationData: string;
        }>;
        _latestCEtherDelegate(arg0: string, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            string
        ] & {
            implementation: string;
            allowResign: boolean;
            becomeImplementationData: string;
        }>;
        cErc20DelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<boolean>;
        cEtherDelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<boolean>;
        comptrollerImplementationWhitelist(arg0: string, arg1: string, overrides?: CallOverrides): Promise<boolean>;
        customInterestFeeRates(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        defaultInterestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
        maxSupplyEth(overrides?: CallOverrides): Promise<BigNumber>;
        maxUtilizationRate(overrides?: CallOverrides): Promise<BigNumber>;
        minBorrowEth(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;
        initialize(_defaultInterestFeeRate: BigNumberish, overrides?: CallOverrides): Promise<void>;
        _setDefaultInterestFeeRate(_defaultInterestFeeRate: BigNumberish, overrides?: CallOverrides): Promise<void>;
        _withdrawAssets(erc20Contract: string, overrides?: CallOverrides): Promise<void>;
        _setPoolLimits(_minBorrowEth: BigNumberish, _maxSupplyEth: BigNumberish, _maxUtilizationRate: BigNumberish, overrides?: CallOverrides): Promise<void>;
        "_callPool(address[],bytes[])"(targets: string[], data: BytesLike[], overrides?: CallOverrides): Promise<void>;
        "_callPool(address[],bytes)"(targets: string[], data: BytesLike, overrides?: CallOverrides): Promise<void>;
        deployCEther(constructorData: BytesLike, overrides?: CallOverrides): Promise<string>;
        deployCErc20(constructorData: BytesLike, overrides?: CallOverrides): Promise<string>;
        _editComptrollerImplementationWhitelist(oldImplementations: string[], newImplementations: string[], statuses: boolean[], overrides?: CallOverrides): Promise<void>;
        _editCErc20DelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: CallOverrides): Promise<void>;
        _editCEtherDelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: CallOverrides): Promise<void>;
        latestComptrollerImplementation(oldImplementation: string, overrides?: CallOverrides): Promise<string>;
        _setLatestComptrollerImplementation(oldImplementation: string, newImplementation: string, overrides?: CallOverrides): Promise<void>;
        latestCErc20Delegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
        latestCEtherDelegate(oldImplementation: string, overrides?: CallOverrides): Promise<[string, boolean, string]>;
        _setLatestCEtherDelegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: CallOverrides): Promise<void>;
        _setLatestCErc20Delegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: CallOverrides): Promise<void>;
        interestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
        _setCustomInterestFeeRate(comptroller: string, rate: BigNumberish, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        _latestCErc20Delegate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        _latestCEtherDelegate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        cErc20DelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<BigNumber>;
        cEtherDelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<BigNumber>;
        comptrollerImplementationWhitelist(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
        customInterestFeeRates(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        defaultInterestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
        maxSupplyEth(overrides?: CallOverrides): Promise<BigNumber>;
        maxUtilizationRate(overrides?: CallOverrides): Promise<BigNumber>;
        minBorrowEth(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        initialize(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _setDefaultInterestFeeRate(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _withdrawAssets(erc20Contract: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _setPoolLimits(_minBorrowEth: BigNumberish, _maxSupplyEth: BigNumberish, _maxUtilizationRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "_callPool(address[],bytes[])"(targets: string[], data: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "_callPool(address[],bytes)"(targets: string[], data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        deployCEther(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        deployCErc20(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _editComptrollerImplementationWhitelist(oldImplementations: string[], newImplementations: string[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _editCErc20DelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _editCEtherDelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        latestComptrollerImplementation(oldImplementation: string, overrides?: CallOverrides): Promise<BigNumber>;
        _setLatestComptrollerImplementation(oldImplementation: string, newImplementation: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        latestCErc20Delegate(oldImplementation: string, overrides?: CallOverrides): Promise<BigNumber>;
        latestCEtherDelegate(oldImplementation: string, overrides?: CallOverrides): Promise<BigNumber>;
        _setLatestCEtherDelegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        _setLatestCErc20Delegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        interestFeeRate(overrides?: CallOverrides): Promise<BigNumber>;
        _setCustomInterestFeeRate(comptroller: string, rate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        _latestCErc20Delegate(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        _latestCEtherDelegate(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        cErc20DelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        cEtherDelegateWhitelist(arg0: string, arg1: string, arg2: boolean, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        comptrollerImplementationWhitelist(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        customInterestFeeRates(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        defaultInterestFeeRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxSupplyEth(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxUtilizationRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minBorrowEth(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        initialize(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _setDefaultInterestFeeRate(_defaultInterestFeeRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _withdrawAssets(erc20Contract: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _setPoolLimits(_minBorrowEth: BigNumberish, _maxSupplyEth: BigNumberish, _maxUtilizationRate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "_callPool(address[],bytes[])"(targets: string[], data: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "_callPool(address[],bytes)"(targets: string[], data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        deployCEther(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        deployCErc20(constructorData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _editComptrollerImplementationWhitelist(oldImplementations: string[], newImplementations: string[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _editCErc20DelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _editCEtherDelegateWhitelist(oldImplementations: string[], newImplementations: string[], allowResign: boolean[], statuses: boolean[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        latestComptrollerImplementation(oldImplementation: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        _setLatestComptrollerImplementation(oldImplementation: string, newImplementation: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        latestCErc20Delegate(oldImplementation: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        latestCEtherDelegate(oldImplementation: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        _setLatestCEtherDelegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        _setLatestCErc20Delegate(oldImplementation: string, newImplementation: string, allowResign: boolean, becomeImplementationData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        interestFeeRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        _setCustomInterestFeeRate(comptroller: string, rate: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
