export const TurboAddresses: TurboAddresses = {
    1: {
        MASTER: "0xf2e513d3b4171bb115cb9ffc45555217fbbbd00c",
        ADMIN: "0x18413D61b335D2F46235E9E1256Fd5ec8AD03757",
        ROUTER: "0x550b756ad4fbef34db5ac84ad41f9cf3c8927d33",
        LENS: "0xe4b54bad1db0a7aafdbb352ecf1056380dd9e829",
        STRATEGY: "0xac4c093c777581dc9c4dc935394ff11e6c58cd45",
        BOOSTER: "0xf6c7f4a90b10c9eaaf2a6676ce81fe8673453e72",
        CLERK: "0x1F45Af9bfDb6ab4B95311e27BEcA59B33A7E17D7",
        COMPTROLLER: "0x1d9EEE473CC1B3b6D316740F5677Ef36E8f0329e",
        TURBO_AUTHORITY: "lfmao"
    },
    31337: {
        MASTER: "0xab69ee29c41cb9ef1befcc650f858feebbf2cead",
        ADMIN: "",
        ROUTER: "0x56e86ef38af5baea7005ba02f80b0c7d1fb13fc1",
        LENS: "0x2600226b9b372d95deced833fe49ca3a19a4e735",
        STRATEGY: "0xb6b4798361033d9bb64f5c8f638c4b7c25bab7b6",
        BOOSTER: "0xc3be0a2078d444a8d19ad59f8378ffb8023e6072",
        CLERK: "0xc5ac5055fab17a3e0a622d1b8160242eb096bb54",
        COMPTROLLER: "0x14Bd62D9b534e2301811400F7284945288797588",
        TURBO_AUTHORITY: "0x3d8bf8Fc25136DC4Bf6CF7c2ee688b9a66a480F3"
    }
}

type TurboAddresses = {
    [chainId: number]: {
        MASTER: string,
        ADMIN: string,
        ROUTER: string,
        LENS: string,
        STRATEGY: string,
        BOOSTER: string,
        CLERK: string,
        COMPTROLLER: string
        TURBO_AUTHORITY: string
    }
}

export const TRIBE = "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
export const FEI = "0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
export const EMPTY_ADDRESS="0x0000000000000000000000000000000000000000"