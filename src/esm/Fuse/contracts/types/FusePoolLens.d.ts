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
export declare type FusePoolDataStruct = {
  totalSupply: BigNumberish;
  totalBorrow: BigNumberish;
  underlyingTokens: string[];
  underlyingSymbols: string[];
  whitelistedAdmin: boolean;
};
export declare type FusePoolDataStructOutput = [
  BigNumber,
  BigNumber,
  string[],
  string[],
  boolean
] & {
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  underlyingTokens: string[];
  underlyingSymbols: string[];
  whitelistedAdmin: boolean;
};
export declare type FusePoolAssetStruct = {
  cToken: string;
  underlyingToken: string;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimals: BigNumberish;
  underlyingBalance: BigNumberish;
  supplyRatePerBlock: BigNumberish;
  borrowRatePerBlock: BigNumberish;
  totalSupply: BigNumberish;
  totalBorrow: BigNumberish;
  supplyBalance: BigNumberish;
  borrowBalance: BigNumberish;
  liquidity: BigNumberish;
  membership: boolean;
  exchangeRate: BigNumberish;
  underlyingPrice: BigNumberish;
  oracle: string;
  collateralFactor: BigNumberish;
  reserveFactor: BigNumberish;
  adminFee: BigNumberish;
  fuseFee: BigNumberish;
  borrowGuardianPaused: boolean;
};
export declare type FusePoolAssetStructOutput = [
  string,
  string,
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  BigNumber,
  BigNumber,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
] & {
  cToken: string;
  underlyingToken: string;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimals: BigNumber;
  underlyingBalance: BigNumber;
  supplyRatePerBlock: BigNumber;
  borrowRatePerBlock: BigNumber;
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  supplyBalance: BigNumber;
  borrowBalance: BigNumber;
  liquidity: BigNumber;
  membership: boolean;
  exchangeRate: BigNumber;
  underlyingPrice: BigNumber;
  oracle: string;
  collateralFactor: BigNumber;
  reserveFactor: BigNumber;
  adminFee: BigNumber;
  fuseFee: BigNumber;
  borrowGuardianPaused: boolean;
};
export declare type FusePoolUserStruct = {
  account: string;
  totalBorrow: BigNumberish;
  totalCollateral: BigNumberish;
  health: BigNumberish;
  assets: FusePoolAssetStruct[];
}[];
export declare type FusePoolUserStructOutput = ([
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  FusePoolAssetStructOutput[]
] & {
  account: string;
  totalBorrow: BigNumber;
  totalCollateral: BigNumber;
  health: BigNumber;
  assets: FusePoolAssetStructOutput[];
})[];
export interface FusePoolLensInterface extends utils.Interface {
  functions: {
    "directory()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "getPublicPoolsWithData()": FunctionFragment;
    "getPublicPoolsByVerificationWithData(bool)": FunctionFragment;
    "getPoolsByAccountWithData(address)": FunctionFragment;
    "getPoolSummary(address)": FunctionFragment;
    "getPoolAssetsWithData(address)": FunctionFragment;
    "getPublicPoolUsersWithData(uint256)": FunctionFragment;
    "getPoolUsersWithData(address[],uint256)": FunctionFragment;
    "getPoolsBySupplier(address)": FunctionFragment;
    "getPoolsBySupplierWithData(address)": FunctionFragment;
    "getUserSummary(address)": FunctionFragment;
    "getPoolUserSummary(address,address)": FunctionFragment;
    "getWhitelistedPoolsByAccount(address)": FunctionFragment;
    "getWhitelistedPoolsByAccountWithData(address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "directory", values?: undefined): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getPublicPoolsWithData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPublicPoolsByVerificationWithData",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolsByAccountWithData",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolSummary",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolAssetsWithData",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPublicPoolUsersWithData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolUsersWithData",
    values: [string[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolsBySupplier",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolsBySupplierWithData",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserSummary",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolUserSummary",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getWhitelistedPoolsByAccount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getWhitelistedPoolsByAccountWithData",
    values: [string]
  ): string;
  decodeFunctionResult(functionFragment: "directory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPublicPoolsWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublicPoolsByVerificationWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolsByAccountWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolSummary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolAssetsWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublicPoolUsersWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolUsersWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolsBySupplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolsBySupplierWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserSummary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolUserSummary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWhitelistedPoolsByAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWhitelistedPoolsByAccountWithData",
    data: BytesLike
  ): Result;
  events: {};
}
export interface FusePoolLens extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: FusePoolLensInterface;
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
    directory(overrides?: CallOverrides): Promise<[string]>;
    initialize(
      _directory: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPublicPoolsWithData(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPublicPoolsByVerificationWithData(
      whitelistedAdmin: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPoolSummary(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPoolAssetsWithData(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPublicPoolUsersWithData(
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "getPoolUsersWithData(address[],uint256)"(
      comptrollers: string[],
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    "getPoolUsersWithData(address,uint256)"(
      comptroller: string,
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPoolsBySupplier(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getPoolsBySupplierWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getUserSummary(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getPoolUserSummary(
      comptroller: string,
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getWhitelistedPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getWhitelistedPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
  };
  directory(overrides?: CallOverrides): Promise<string>;
  initialize(
    _directory: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPublicPoolsWithData(
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPublicPoolsByVerificationWithData(
    whitelistedAdmin: boolean,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolsByAccountWithData(
    account: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolSummary(
    comptroller: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolAssetsWithData(
    comptroller: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPublicPoolUsersWithData(
    maxHealth: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "getPoolUsersWithData(address[],uint256)"(
    comptrollers: string[],
    maxHealth: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  "getPoolUsersWithData(address,uint256)"(
    comptroller: string,
    maxHealth: BigNumberish,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolsBySupplier(
    account: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  getPoolsBySupplierWithData(
    account: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getUserSummary(
    account: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolUserSummary(
    comptroller: string,
    account: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getWhitelistedPoolsByAccount(
    account: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
  getWhitelistedPoolsByAccountWithData(
    account: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    directory(overrides?: CallOverrides): Promise<string>;
    initialize(_directory: string, overrides?: CallOverrides): Promise<void>;
    getPublicPoolsWithData(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber[],
        FusePoolStructOutput[],
        FusePoolDataStructOutput[],
        boolean[]
      ]
    >;
    getPublicPoolsByVerificationWithData(
      whitelistedAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber[],
        FusePoolStructOutput[],
        FusePoolDataStructOutput[],
        boolean[]
      ]
    >;
    getPoolsByAccountWithData(
      account: string,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber[],
        FusePoolStructOutput[],
        FusePoolDataStructOutput[],
        boolean[]
      ]
    >;
    getPoolSummary(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, string[], string[], boolean]>;
    getPoolAssetsWithData(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<FusePoolAssetStructOutput[]>;
    getPublicPoolUsersWithData(
      maxHealth: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string[],
        FusePoolUserStructOutput[],
        BigNumber[],
        BigNumber[],
        boolean[]
      ]
    >;
    "getPoolUsersWithData(address[],uint256)"(
      comptrollers: string[],
      maxHealth: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [FusePoolUserStructOutput[], BigNumber[], BigNumber[], boolean[]]
    >;
    "getPoolUsersWithData(address,uint256)"(
      comptroller: string,
      maxHealth: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[FusePoolUserStructOutput[], BigNumber, BigNumber]>;
    getPoolsBySupplier(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getPoolsBySupplierWithData(
      account: string,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber[],
        FusePoolStructOutput[],
        FusePoolDataStructOutput[],
        boolean[]
      ]
    >;
    getUserSummary(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, boolean]>;
    getPoolUserSummary(
      comptroller: string,
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
    getWhitelistedPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], FusePoolStructOutput[]]>;
    getWhitelistedPoolsByAccountWithData(
      account: string,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber[],
        FusePoolStructOutput[],
        FusePoolDataStructOutput[],
        boolean[]
      ]
    >;
  };
  filters: {};
  estimateGas: {
    directory(overrides?: CallOverrides): Promise<BigNumber>;
    initialize(
      _directory: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPublicPoolsWithData(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPublicPoolsByVerificationWithData(
      whitelistedAdmin: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPoolSummary(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPoolAssetsWithData(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPublicPoolUsersWithData(
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "getPoolUsersWithData(address[],uint256)"(
      comptrollers: string[],
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    "getPoolUsersWithData(address,uint256)"(
      comptroller: string,
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPoolsBySupplier(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getPoolsBySupplierWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getUserSummary(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getPoolUserSummary(
      comptroller: string,
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getWhitelistedPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getWhitelistedPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    directory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    initialize(
      _directory: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPublicPoolsWithData(
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPublicPoolsByVerificationWithData(
      whitelistedAdmin: boolean,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPoolSummary(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPoolAssetsWithData(
      comptroller: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPublicPoolUsersWithData(
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "getPoolUsersWithData(address[],uint256)"(
      comptrollers: string[],
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    "getPoolUsersWithData(address,uint256)"(
      comptroller: string,
      maxHealth: BigNumberish,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPoolsBySupplier(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getPoolsBySupplierWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getUserSummary(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getPoolUserSummary(
      comptroller: string,
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getWhitelistedPoolsByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getWhitelistedPoolsByAccountWithData(
      account: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
