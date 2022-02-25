import { BigNumber } from "ethers";
export default class mStableSubpool {
  provider: any;
  cache: any;
  externalContracts: any;
  static EXTERNAL_CONTRACT_ADDRESSES: {
    Masset: string;
    MassetValidationHelper: string;
  };
  static EXTERNAL_CONTRACT_ABIS: {
    Masset: (
      | {
          anonymous: boolean;
          inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          type: string;
          constant?: undefined;
          outputs?: undefined;
          payable?: undefined;
          stateMutability?: undefined;
        }
      | {
          constant: boolean;
          inputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          name: string;
          outputs: {
            internalType: string;
            name: string;
            type: string;
          }[];
          payable: boolean;
          stateMutability: string;
          type: string;
          anonymous?: undefined;
        }
    )[];
    MassetValidationHelper: {
      constant: boolean;
      inputs: {
        internalType: string;
        name: string;
        type: string;
      }[];
      name: string;
      outputs: {
        internalType: string;
        name: string;
        type: string;
      }[];
      payable: boolean;
      stateMutability: string;
      type: string;
    }[];
  };
  static SUPPORTED_EXCHANGE_CURRENCIES: string[];
  constructor(provider: any);
  getMUsdSavingsApy(includeIMUsdVaultApy: any): Promise<void | BigNumber>;
  getCurrencyApys(): Promise<any>;
  getMtaUsdPrice(): Promise<any>;
  getIMUsdVaultWeeklyRoi(
    totalStakingRewards: any,
    stakingTokenPrice: any
  ): Promise<number>;
  getIMUsdVaultApy(
    totalStakingRewards: any,
    stakingTokenPrice: any
  ): Promise<BigNumber>;
}
