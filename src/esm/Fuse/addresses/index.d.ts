export declare enum CompoundContractVersion {
  "1.0.0" = 0,
  "1.0.1" = 1,
  "1.0.2" = 2,
  "1.1.0" = 3,
}
export declare enum FuseContractVersion {
  "1.0.0" = 0,
  "1.0.1" = 1,
  "1.0.2" = 2,
  "1.0.3" = 3,
  "1.0.4" = 4,
  "1.0.5" = 5,
  "1.1.0" = 6,
  "1.1.1" = 7,
  "1.1.2" = 8,
  "1.1.3" = 9,
  "1.1.4" = 10,
  "1.1.5" = 11,
  "1.1.6" = 12,
  "1.2.0" = 13,
  "1.2.1" = 14,
  "1.2.2" = 15,
}
export interface Oracle {
  address: string;
  bytecodeHash: string;
  deployable: boolean;
  oldVersions: {
    [version: string]: Pick<Oracle, "address" | "bytecodeHash">;
  };
}
export interface Oracles {
  [oracleName: string]: Oracle;
}
export interface FuseAddresses {
  FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: string;
  FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS: string;
  FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS: string;
  FUSE_POOL_LENS_CONTRACT_ADDRESS: string;
  FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS: string;
  COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS: string;
  CERC20_DELEGATE_CONTRACT_ADDRESS: string;
  CETHER_DELEGATE_CONTRACT_ADDRESS: string;
  MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS: string;
  INITIALIZABLE_CLONES_CONTRACT_ADDRESS: string;
  PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES: {
    [oracleName: string]: string;
  };
  PRICE_ORACLE_RUNTIME_BYTECODE_HASHES: {
    [oracleName: string]: string;
  };
  ORACLES: string[];
  oracles: Oracles;
  DEPLOYABLE_ORACLES: (keyof Oracles)[];
  UNISWAP_V2_FACTORY_ADDRESS: string;
  UNISWAP_V2_PAIR_INIT_CODE_HASH: string;
  UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS: string;
  UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS: string;
  UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: string;
  UNISWAP_V3_FACTORY_ADDRESS: string;
  UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: string;
  PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES: {
    [oracleName: string]: string;
  };
  WETH_ADDRESS: string;
  REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS: string;
  OPEN_ORACLE_PRICE_DATA_CONTRACT_ADDRESS?: string;
  COINBASE_PRO_REPORTER_ADDRESS?: string;
  DAI_POT?: string;
  DAI_JUG?: string;
}
declare const addresses: {
  [chainId: number]: FuseAddresses;
};
export default addresses;
