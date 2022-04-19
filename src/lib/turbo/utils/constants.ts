import { ChainID } from "esm/utils/networks";

export const TurboAddresses: TurboAddresses = {
  1: {
    MASTER: "0xf2e513d3b4171bb115cb9ffc45555217fbbbd00c",
    ADMIN: "0x18413D61b335D2F46235E9E1256Fd5ec8AD03757",
    ROUTER: "0x550b756ad4fbef34db5ac84ad41f9cf3c8927d33",
    LENS: "0x38e16f5c4556d3ddb938954a632a0b761701e9b3",
    STRATEGY: "0xac4c093c777581dc9c4dc935394ff11e6c58cd45",
    BOOSTER: "0xf6c7f4a90b10c9eaaf2a6676ce81fe8673453e72",
    CLERK: "0x1F45Af9bfDb6ab4B95311e27BEcA59B33A7E17D7",
    COMPTROLLER: "0x1d9EEE473CC1B3b6D316740F5677Ef36E8f0329e",
    ORACLE: "0xFb5b08d17dc5Bc5C8627c10dBed11614b43dc0F1",
    TURBO_AUTHORITY: "0x286c9724a0C1875233cf17A4ffE475A0BD8158dE",
  },
  31337: {
    MASTER: "0xf2e513d3b4171bb115cb9ffc45555217fbbbd00c",
    ADMIN: "0x18413D61b335D2F46235E9E1256Fd5ec8AD03757",
    ROUTER: "0x550b756ad4fbef34db5ac84ad41f9cf3c8927d33",
    LENS: "0x38e16f5c4556d3ddb938954a632a0b761701e9b3",
    STRATEGY: "0xac4c093c777581dc9c4dc935394ff11e6c58cd45",
    BOOSTER: "0xf6c7f4a90b10c9eaaf2a6676ce81fe8673453e72",
    CLERK: "0x1F45Af9bfDb6ab4B95311e27BEcA59B33A7E17D7",
    COMPTROLLER: "0x1d9EEE473CC1B3b6D316740F5677Ef36E8f0329e",
    ORACLE: "0xFb5b08d17dc5Bc5C8627c10dBed11614b43dc0F1",
    TURBO_AUTHORITY: "0x286c9724a0C1875233cf17A4ffE475A0BD8158dE",
  },
};

type TurboAddresses = {
  [chainId: number]: {
    MASTER: string;
    ADMIN: string;
    ROUTER: string;
    LENS: string;
    STRATEGY: string;
    BOOSTER: string;
    CLERK: string;
    COMPTROLLER: string;
    ORACLE: string;
    TURBO_AUTHORITY: string;
  };
};

export const TRIBE = "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B";
export const FEI = "0x956F47F50A910163D8BF957Cf5846D573E7f87CA";
export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export const DELISTED_STRATEGIES: { [strat: string]: boolean } = {
  "0xb734cc08a38f0b81e7d3ddd38dfbd66a66f1a6ba": true,
  "0xac4c093c777581dc9c4dc935394ff11e6c58cd45": true,
};

const isTurboSupportedNetwork = (chainId: number) =>
  Object.keys(TurboAddresses).includes(chainId.toString());
