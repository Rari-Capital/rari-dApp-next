import {
  BaseContract,
  BigNumber,
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
export declare type CTokenOwnershipStruct = {
  cToken: string;
  admin: string;
  adminHasRights: boolean;
  fuseAdminHasRights: boolean;
};
export declare type CTokenOwnershipStructOutput = [
  string,
  string,
  boolean,
  boolean
] & {
  cToken: string;
  admin: string;
  adminHasRights: boolean;
  fuseAdminHasRights: boolean;
};
export interface FusePoolLensSecondaryInterface extends utils.Interface {
  functions: {
    "directory()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "getPoolOwnership(address)": FunctionFragment;
    "getMaxRedeem(address,address)": FunctionFragment;
    "getMaxBorrow(address,address)": FunctionFragment;
    "getRewardSpeedsByPool(address)": FunctionFragment;
    "getRewardSpeedsByPools(address[])": FunctionFragment;
    "getUnclaimedRewardsByDistributors(address,address[])": FunctionFragment;
    "getRewardsDistributorsBySupplier(address)": FunctionFragment;
  };
  encodeFunctionData(functionFragment: "directory", values?: undefined): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getPoolOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxRedeem",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxBorrow",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardSpeedsByPool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardSpeedsByPools",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getUnclaimedRewardsByDistributors",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardsDistributorsBySupplier",
    values: [string]
  ): string;
  decodeFunctionResult(functionFragment: "directory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxBorrow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardSpeedsByPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardSpeedsByPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnclaimedRewardsByDistributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardsDistributorsBySupplier",
    data: BytesLike
  ): Result;
  events: {};
}
export interface FusePoolLensSecondary extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: FusePoolLensSecondaryInterface;
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
    getPoolOwnership(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<[string, boolean, boolean, CTokenOwnershipStructOutput[]]>;
    getMaxRedeem(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getMaxBorrow(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getRewardSpeedsByPool(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<[string[], string[], string[], BigNumber[][], BigNumber[][]]>;
    getRewardSpeedsByPools(
      comptrollers: string[],
      overrides?: CallOverrides
    ): Promise<
      [string[][], string[][], string[][], BigNumber[][][], BigNumber[][][]]
    >;
    getUnclaimedRewardsByDistributors(
      holder: string,
      distributors: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<ContractTransaction>;
    getRewardsDistributorsBySupplier(
      supplier: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], string[], string[][]]>;
  };
  directory(overrides?: CallOverrides): Promise<string>;
  initialize(
    _directory: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getPoolOwnership(
    comptroller: string,
    overrides?: CallOverrides
  ): Promise<[string, boolean, boolean, CTokenOwnershipStructOutput[]]>;
  getMaxRedeem(
    account: string,
    cTokenModify: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getMaxBorrow(
    account: string,
    cTokenModify: string,
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getRewardSpeedsByPool(
    comptroller: string,
    overrides?: CallOverrides
  ): Promise<[string[], string[], string[], BigNumber[][], BigNumber[][]]>;
  getRewardSpeedsByPools(
    comptrollers: string[],
    overrides?: CallOverrides
  ): Promise<
    [string[][], string[][], string[][], BigNumber[][][], BigNumber[][][]]
  >;
  getUnclaimedRewardsByDistributors(
    holder: string,
    distributors: string[],
    overrides?: Overrides & {
      from?: string | Promise<string>;
    }
  ): Promise<ContractTransaction>;
  getRewardsDistributorsBySupplier(
    supplier: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], string[], string[][]]>;
  callStatic: {
    directory(overrides?: CallOverrides): Promise<string>;
    initialize(_directory: string, overrides?: CallOverrides): Promise<void>;
    getPoolOwnership(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<[string, boolean, boolean, CTokenOwnershipStructOutput[]]>;
    getMaxRedeem(
      account: string,
      cTokenModify: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getMaxBorrow(
      account: string,
      cTokenModify: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getRewardSpeedsByPool(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<[string[], string[], string[], BigNumber[][], BigNumber[][]]>;
    getRewardSpeedsByPools(
      comptrollers: string[],
      overrides?: CallOverrides
    ): Promise<
      [string[][], string[][], string[][], BigNumber[][][], BigNumber[][][]]
    >;
    getUnclaimedRewardsByDistributors(
      holder: string,
      distributors: string[],
      overrides?: CallOverrides
    ): Promise<
      [
        string[],
        BigNumber[],
        string[][],
        [BigNumber, BigNumber][][],
        BigNumber[]
      ]
    >;
    getRewardsDistributorsBySupplier(
      supplier: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], string[], string[][]]>;
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
    getPoolOwnership(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getMaxRedeem(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getMaxBorrow(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getRewardSpeedsByPool(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getRewardSpeedsByPools(
      comptrollers: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getUnclaimedRewardsByDistributors(
      holder: string,
      distributors: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<BigNumber>;
    getRewardsDistributorsBySupplier(
      supplier: string,
      overrides?: CallOverrides
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
    getPoolOwnership(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getMaxRedeem(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getMaxBorrow(
      account: string,
      cTokenModify: string,
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getRewardSpeedsByPool(
      comptroller: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getRewardSpeedsByPools(
      comptrollers: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getUnclaimedRewardsByDistributors(
      holder: string,
      distributors: string[],
      overrides?: Overrides & {
        from?: string | Promise<string>;
      }
    ): Promise<PopulatedTransaction>;
    getRewardsDistributorsBySupplier(
      supplier: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
