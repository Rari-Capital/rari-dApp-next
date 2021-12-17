import { ChainID } from "../utils/networks";
const addresses = {
    [ChainID.ETHEREUM]: {
        // Fundamentals
        FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: "0x835482FE0532f169024d5E9410199369aAD5C77E",
        FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS: "0xf0f3a1494ae00b5350535b7777abb2f499fc13d4",
        FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS: "0xa731585ab05fC9f83555cf9Bff8F58ee94e18F85",
        FUSE_POOL_LENS_CONTRACT_ADDRESS: "0x8dA38681826f4ABBe089643D2B3fE4C6e4730493",
        FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS: "0xc76190E04012f26A364228Cfc41690429C44165d",
        COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS: "0x94b2200d28932679def4a7d08596a229553a994e",
        // CEther and CERC20
        CERC20_DELEGATE_CONTRACT_ADDRESS: "0x67e70eeb9dd170f7b4a9ef620720c9069d5e706c",
        CETHER_DELEGATE_CONTRACT_ADDRESS: "0x60884c8faad1b30b1c76100da92b76ed3af849ba",
        // Oracles
        OPEN_ORACLE_PRICE_DATA_CONTRACT_ADDRESS: "0xc629c26dced4277419cde234012f8160a0278a79",
        MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS: "0xb3c8ee7309be658c186f986388c2377da436d8fb",
        PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES: {
            PreferredPriceOracle: "",
            ChainlinkPriceOracle: "0xe102421A85D9C0e71C0Ef1870DaC658EB43E1493",
            ChainlinkPriceOracleV2: "0xb0602af43Ca042550ca9DA3c33bA3aC375d20Df4",
            Keep3rPriceOracle_Uniswap: "0xb90de476d438b37a4a143bf729a9b2237e544af6",
            Keep3rPriceOracle_SushiSwap: "0x08d415f90ccfb971dfbfdd6266f9a7cb1c166fc0",
            Keep3rV2PriceOracle_Uniswap: "0xd6a8cac634e59c00a3d4163f839d068458e39869",
            UniswapTwapPriceOracle_Uniswap: "0xCd8f1c72Ff98bFE3B307869dDf66f5124D57D3a9",
            UniswapTwapPriceOracle_SushiSwap: "0xfD4B4552c26CeBC54cD80B1BDABEE2AC3E7eB324",
            MasterPriceOracle: "0x1887118E49e0F4A78Bd71B792a49dE03504A764D",
            CurveLpTokenPriceOracle: "0x43c534203339bbf15f62b8dde91e7d14195e7a60",
            CurveLiquidityGaugeV2PriceOracle: "0xd9eefdb09d75ca848433079ea72ef609a1c1ea21",
        },
        PRICE_ORACLE_RUNTIME_BYTECODE_HASHES: {
            SimplePriceOracle: "0x825c814c2e008137a46d355a57d0d89f6eea946ad01f0e8203fd33162e3ed799",
            PreferredPriceOracle: "0x3899c6d9b979281ffb059859e0c8c2028662201d3796e0ea10e841e1d68a997f",
            ChainlinkPriceOracle: "0x7a2a5633a99e8abb759f0b52e87875181704b8e29f6567d4a92f12c3f956d313",
            Keep3rPriceOracle: "0x36a0d4743a92d3565f3d2709c41e9983bb263c27c339ddbb8ffa87a939498f7d",
            MasterPriceOracle: "0xfa1349af05af40ffb5e66605a209dbbdc8355ba7dda76b2be10bafdf5ffd1dc6",
            UniswapAnchoredView: "0x764bdac98ac462a37513087378aef33380ac062baa2f86c2c30e5d6a78fabad0",
            UniswapView: "0x817d46149b29738f641c876c56fd7524db4c8d5376f7cc756e94c9e32c29b18b",
            UniswapLpTokenPriceOracle: "0xc79e96f40986213d5f9fc403b5f37e00d3b57842ef0fae24c750222c02592f9f",
            RecursivePriceOracle: "0x6f5280d0028fff9ae0aaa447c6c36ff3b270d9675b74762ed2caf9ce3371d63e",
            YVaultV1PriceOracle: "0xeb5c1b3acb093a4158251f5955540f220c72200ffaf32ce89bfefbce0c0b7f49",
            YVaultV2PriceOracle: "0x5a07033c6820e6ecc517dd94d03b5e38bf15334d4b3c0624dcdb810698196608",
            AlphaHomoraV1PriceOracle: "0xfbec68bfe8dfa9e8bab8af26ee5ae9adeb2dcbf2c91d11c3dd497b6b6c2deb64",
            SynthetixPriceOracle: "0x5c92648ceca2c5698fddc9a35af43275c821961ca9056c50da592566daaebdc6",
        },
        ORACLES: [
            "SimplePriceOracle",
            "PreferredPriceOracle",
            "ChainlinkPriceOracle",
            "Keep3rPriceOracle",
            "MasterPriceOracle",
            "UniswapAnchoredView",
            "UniswapView",
            "UniswapLpTokenPriceOracle",
            "RecursivePriceOracle",
            "YVaultV1PriceOracle",
            "YVaultV2PriceOracle",
            "AlphaHomoraV1PriceOracle",
            "SynthetixPriceOracle",
        ],
        // // UNI-V2 Oracles
        UNISWAP_V2_FACTORY_ADDRESS: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        UNISWAP_V2_PAIR_INIT_CODE_HASH: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
        UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS: "0xa170dba2cd1f68cdd7567cf70184d5492d2e8138",
        UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS: "0xf1860b3714f0163838cf9ee3adc287507824ebdb",
        UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: "",
        // // UNI-V3 Oracles
        UNISWAP_V3_FACTORY_ADDRESS: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
        UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: "0x8Eed20f31E7d434648fF51114446b3CfFD1FF9F1",
        // IRM
        PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES: {
            WhitePaperInterestRateModel_ETH: "0x14ee0270C80bEd60bDC117d4F218DeE0A4909F28",
            WhitePaperInterestRateModel_WBTC: "0x7ecAf96C79c2B263AFe4f486eC9a74F8e563E0a6",
            JumpRateModel_DAI: "0x640dce7c7c6349e254b20eccfa2bb902b354c317",
            JumpRateModel_UNI: "0xc35DB333EF7ce4F246DE9DE11Cc1929d6AA11672",
            JumpRateModel_Stables_Majors: "0xb579d2761470bba14018959d6dffcc681c09c04b",
            JumpRateModel_Gov_Seeds: "0xcdC0a449E011249482824efFcfA05c883d36CfC7",
            JumpRateModel_ALCX: "0x58c3e7119ec200c09b2b3a9f8ce3bd77b6b47012",
        },
        // Tokens / ETC
        COINBASE_PRO_REPORTER_ADDRESS: "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC",
        DAI_POT: "0x197e90f9fad81970ba7976f33cbd77088e5d7cf7",
        DAI_JUG: "0x19c0976f590d67707e62397c87829d896dc0f1f1",
        WETH_ADDRESS: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        INITIALIZABLE_CLONES_CONTRACT_ADDRESS: "0x91ce5566dc3170898c5aee4ae4dd314654b47415",
        REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS: "0x220f93183a69d1598e8405310cb361cff504146f",
    },
    // Todo - update all these addresses
    [ChainID.ARBITRUM]: {
        // Fundamentals
        FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: "0xA2a1cb88D86A939A37770FE5E9530E8700DEe56b",
        FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS: "0x29535B9035500827FfF73206e17a3d16635A1B48",
        FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS: "0xB1205172AAdaAd4c67318EA77A34C1F1CaA784EE",
        FUSE_POOL_LENS_CONTRACT_ADDRESS: "0xe4D84b252308645098846312286E6c6D2846DbB0",
        FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS: "0xc76190E04012f26A364228Cfc41690429C44165d",
        COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS: "0x2f6d8Ff753886AE2b49E0c3bB6504867F2977078",
        // CEther and CERC20
        CETHER_DELEGATE_CONTRACT_ADDRESS: "",
        CERC20_DELEGATE_CONTRACT_ADDRESS: "0xCFA81742393B52c493b8d76E55FFE4992A5cfFd9",
        // Oracles
        OPEN_ORACLE_PRICE_DATA_CONTRACT_ADDRESS: "",
        MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS: "",
        PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES: {
            PreferredPriceOracle_V2_Quick_USDC: "0xCc5F01efd5647C77861Ce15C923731f9e27E3132",
            MasterPriceOracle_V2_BEEFY_LP: "0x606AF64e16bF85F587E9ac27Fa2e8461C5258321",
            MasterPriceOracle_V2_KLIMA: "0xd9b7b49a2e95c56c115ecf3d3f2546aaaa8f0a35",
        },
        PRICE_ORACLE_RUNTIME_BYTECODE_HASHES: {
            "PreferredPriceOracleV2 Quickswap USDC": "0xe6a7eb0795fc9c5e05048d191246ac01efaff82eac6c8c981ed0b475e89e77a9",
            "MasterPriceOracleV2 Beefy": "0x567982b74679a69cfb2ae6b114951562cc80d6790d0c2fdb9a4c1fb46733138d",
            "MasterPriceOracleV2 Klima": "0x17a4e51aa4284da1b2ced8254eac606175ceaf9b810a48c0a336fc0195c95a4a",
        },
        ORACLES: [
            "PreferredPriceOracle",
            "ChainlinkPriceOracleV2",
            "UniswapTwapPriceOracle_SushiSwap",
        ],
        // // UNI-V2 Oracles (Sushi for arbi)
        UNISWAP_V2_FACTORY_ADDRESS: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        UNISWAP_V2_PAIR_INIT_CODE_HASH: "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS: "",
        UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS: "",
        UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: "",
        // // UNI-V3 Oracles
        UNISWAP_V3_FACTORY_ADDRESS: "",
        UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS: "",
        // IRM
        PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES: {
            JumpRateModel_Cream_Stables_Majors: "0xa80F8CC22b4Ff9442B7F188D96E9B75d6cFd80F6",
            JumpRateModel_Cream_Major: "0x8dbf1250c805fc2ed29fc0d3aed31ec69a928ffe",
            JumpRateModel_Cream_Gov: "0x46c54c7D214117c79f2f6F368549776F00c0a6c4",
        },
        // Tokens / ETC
        COINBASE_PRO_REPORTER_ADDRESS: "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC",
        DAI_POT: "",
        DAI_JUG: "",
        WETH_ADDRESS: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        INITIALIZABLE_CLONES_CONTRACT_ADDRESS: "",
        REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS: "",
    },
};
export default addresses;
