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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export declare type FusePoolStruct = {
  name: string;
  creator: string;
  comptroller: string;
  blockPosted: BigNumberish;
  timestampPosted: BigNumberish;
};
export declare type FusePoolStructOutput = [
  string,
  string,
  string,
  BigNumber,
  BigNumber
] & {
  name: string;
  creator: string;
  comptroller: string;
  blockPosted: BigNumber;
  timestampPosted: BigNumber;
};
export interface FusePoolDirectoryInterface extends utils.Interface {
  functions: {
    "adminWhitelist(address)": FunctionFragment;
    "deployerWhitelist(address)": FunctionFragment;
    "enforceDeployerWhitelist()": FunctionFragment;
    "owner()": FunctionFragment;
    "poolExists(address)": FunctionFragment;
    "pools(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "initialize(bool,address[])": FunctionFragment;
    "_setDeployerWhitelistEnforcement(bool)": FunctionFragment;
    "_editDeployerWhitelist(address[],bool)": FunctionFragment;
    "deployPool(string,address,bool,uint256,uint256,address)": FunctionFragment;
    "getAllPools()": FunctionFragment;
    "getPublicPools()": FunctionFragment;
    "getPoolsByAccount(address)": FunctionFragment;
    "getBookmarks(address)": FunctionFragment;
    "bookmarkPool(address)": FunctionFragment;
    "setPoolName(uint256,string)": FunctionFragment;
    "_editAdminWhitelist(address[],bool)": FunctionFragment;
    "getPublicPoolsByVerification(bool)": FunctionFragment;
  };
  encodeFunctionData(
    functionFragment: "adminWhitelist",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "deployerWhitelist",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "enforceDeployerWhitelist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "poolExists", values: [string]): string;
  encodeFunctionData(functionFragment: "pools", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [boolean, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "_setDeployerWhitelistEnforcement",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "_editDeployerWhitelist",
    values: [string[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "deployPool",
    values: [string, string, boolean, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllPools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPublicPools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolsByAccount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getBookmarks",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "bookmarkPool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolName",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "_editAdminWhitelist",
    values: [string[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getPublicPoolsByVerification",
    values: [boolean]
  ): string;
  decodeFunctionResult(
    functionFragment: "adminWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployerWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enforceDeployerWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolExists", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_setDeployerWhitelistEnforcement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_editDeployerWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deployPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublicPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolsByAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBookmarks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bookmarkPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_editAdminWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublicPoolsByVerification",
    data: BytesLike
  ): Result;
  events: {
    "AdminWhitelistUpdated(address[],bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PoolRegistered(uint256,tuple)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "AdminWhitelistUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolRegistered"): EventFragment;
}
export declare type AdminWhitelistUpdatedEvent = TypedEvent<
  [string[], boolean],
  {
    admins: string[];
    status: boolean;
  }
>;
export declare type AdminWhitelistUpdatedEventFilter =
  TypedEventFilter<AdminWhitelistUpdatedEvent>;
export declare type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  {
    previousOwner: string;
    newOwner: string;
  }
>;
export declare type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;
export declare type PoolRegisteredEvent = TypedEvent<
  [BigNumber, FusePoolStructOutput],
  {
    index: BigNumber;
    pool: FusePoolStructOutput;
  }
>;
export declare type PoolRegisteredEventFilter =
  TypedEventFilter<PoolRegisteredEvent>;
export interface FusePoolDirectory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: FusePoolDirectoryInterface;
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
    adminWhitelist(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
    deployerWhitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    enforceDeployerWhitelist(overrides?: CallOverrides): Promise<[boolean]>;
    owner(overrides?: CallOverrides): Promise<[string]>;
    poolExists(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
    pools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, BigNumber] & {
        name: string;
        creator: string;
        comptroller: string;
        blockPosted: BigNumber;
        timestampPosted: BigNumber;
      }
    >;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    initialize(
      _enforceDeployerWhitelist: boolean,
      _deployerWhitelist: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    _setDeployerWhitelistEnforcement(
      enforce: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    _editDeployerWhitelist(
      deployers: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    deployPool(
      name: string,
      implementation: string,
      enforceWhitelist: boolean,
      closeFactor: BigNumberish,
      liquidationIncentive: BigNumberish,
      priceOracle: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getAllPools(overrides?: CallOverrides): Promise<[FusePoolStructOutput[]]>;
    getPublicPools(
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getBookmarks(
      account: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;
    bookmarkPool(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    setPoolName(
      index: BigNumberish,
      name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    _editAdminWhitelist(
      admins: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPublicPoolsByVerification(
      whitelistedAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  };
  adminWhitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  deployerWhitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  enforceDeployerWhitelist(overrides?: CallOverrides): Promise<boolean>;
  owner(overrides?: CallOverrides): Promise<string>;
  poolExists(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  pools(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, BigNumber] & {
      name: string;
      creator: string;
      comptroller: string;
      blockPosted: BigNumber;
      timestampPosted: BigNumber;
    }
  >;
  renounceOwnership(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  transferOwnership(
    newOwner: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  initialize(
    _enforceDeployerWhitelist: boolean,
    _deployerWhitelist: string[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  _setDeployerWhitelistEnforcement(
    enforce: boolean,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  _editDeployerWhitelist(
    deployers: string[],
    status: boolean,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  deployPool(
    name: string,
    implementation: string,
    enforceWhitelist: boolean,
    closeFactor: BigNumberish,
    liquidationIncentive: BigNumberish,
    priceOracle: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getAllPools(overrides?: CallOverrides): Promise<FusePoolStructOutput[]>;
  getPublicPools(
    overrides?: CallOverrides
  ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  getPoolsByAccount(
    account: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  getBookmarks(account: string, overrides?: CallOverrides): Promise<string[]>;
  bookmarkPool(
    comptroller: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  setPoolName(
    index: BigNumberish,
    name: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  _editAdminWhitelist(
    admins: string[],
    status: boolean,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPublicPoolsByVerification(
    whitelistedAdmin: boolean,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  callStatic: {
    adminWhitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;
    deployerWhitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
    enforceDeployerWhitelist(overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    poolExists(arg0: string, overrides?: CallOverrides): Promise<boolean>;
    pools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, BigNumber] & {
        name: string;
        creator: string;
        comptroller: string;
        blockPosted: BigNumber;
        timestampPosted: BigNumber;
      }
    >;
    renounceOwnership(overrides?: CallOverrides): Promise<void>;
    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
    initialize(
      _enforceDeployerWhitelist: boolean,
      _deployerWhitelist: string[],
      overrides?: CallOverrides
    ): Promise<void>;
    _setDeployerWhitelistEnforcement(
      enforce: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
    _editDeployerWhitelist(
      deployers: string[],
      status: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
    deployPool(
      name: string,
      implementation: string,
      enforceWhitelist: boolean,
      closeFactor: BigNumberish,
      liquidationIncentive: BigNumberish,
      priceOracle: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;
    getAllPools(overrides?: CallOverrides): Promise<FusePoolStructOutput[]>;
    getPublicPools(
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getBookmarks(account: string, overrides?: CallOverrides): Promise<string[]>;
    bookmarkPool(comptroller: string, overrides?: CallOverrides): Promise<void>;
    setPoolName(
      index: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<void>;
    _editAdminWhitelist(
      admins: string[],
      status: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
    getPublicPoolsByVerification(
      whitelistedAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  };
  filters: {
    "AdminWhitelistUpdated(address[],bool)"(
      admins?: null,
      status?: null
    ): AdminWhitelistUpdatedEventFilter;
    AdminWhitelistUpdated(
      admins?: null,
      status?: null
    ): AdminWhitelistUpdatedEventFilter;
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    "PoolRegistered(uint256,tuple)"(
      index?: null,
      pool?: null
    ): PoolRegisteredEventFilter;
    PoolRegistered(index?: null, pool?: null): PoolRegisteredEventFilter;
  };
  estimateGas: {
    adminWhitelist(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    deployerWhitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    enforceDeployerWhitelist(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<BigNumber>;
    poolExists(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    pools(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    initialize(
      _enforceDeployerWhitelist: boolean,
      _deployerWhitelist: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    _setDeployerWhitelistEnforcement(
      enforce: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    _editDeployerWhitelist(
      deployers: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    deployPool(
      name: string,
      implementation: string,
      enforceWhitelist: boolean,
      closeFactor: BigNumberish,
      liquidationIncentive: BigNumberish,
      priceOracle: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getAllPools(overrides?: CallOverrides): Promise<BigNumber>;
    getPublicPools(overrides?: CallOverrides): Promise<BigNumber>;
    getPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getBookmarks(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    bookmarkPool(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    setPoolName(
      index: BigNumberish,
      name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    _editAdminWhitelist(
      admins: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPublicPoolsByVerification(
      whitelistedAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    adminWhitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    deployerWhitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    enforceDeployerWhitelist(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    poolExists(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    pools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    renounceOwnership(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    initialize(
      _enforceDeployerWhitelist: boolean,
      _deployerWhitelist: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    _setDeployerWhitelistEnforcement(
      enforce: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    _editDeployerWhitelist(
      deployers: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    deployPool(
      name: string,
      implementation: string,
      enforceWhitelist: boolean,
      closeFactor: BigNumberish,
      liquidationIncentive: BigNumberish,
      priceOracle: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getAllPools(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getPublicPools(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getBookmarks(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    bookmarkPool(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    setPoolName(
      index: BigNumberish,
      name: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    _editAdminWhitelist(
      admins: string[],
      status: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPublicPoolsByVerification(
      whitelistedAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
