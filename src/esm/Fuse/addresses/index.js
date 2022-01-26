import { ChainID } from "../../utils/networks";
import MAINNET_ADDRESSES from "./mainnet";
import ARBITRUM_ADDRESSES from "./arbitrum";
import ARBITRUM_RINKEBY_ADDRESSES from "./arbitrumRinkeby";
export var CompoundContractVersion;
(function (CompoundContractVersion) {
    CompoundContractVersion[CompoundContractVersion["1.0.0"] = 0] = "1.0.0";
    CompoundContractVersion[CompoundContractVersion["1.0.1"] = 1] = "1.0.1";
    CompoundContractVersion[CompoundContractVersion["1.0.2"] = 2] = "1.0.2";
    CompoundContractVersion[CompoundContractVersion["1.1.0"] = 3] = "1.1.0";
})(CompoundContractVersion || (CompoundContractVersion = {}));
export var FuseContractVersion;
(function (FuseContractVersion) {
    FuseContractVersion[FuseContractVersion["1.0.0"] = 0] = "1.0.0";
    FuseContractVersion[FuseContractVersion["1.0.1"] = 1] = "1.0.1";
    FuseContractVersion[FuseContractVersion["1.0.2"] = 2] = "1.0.2";
    FuseContractVersion[FuseContractVersion["1.0.3"] = 3] = "1.0.3";
    FuseContractVersion[FuseContractVersion["1.0.4"] = 4] = "1.0.4";
    FuseContractVersion[FuseContractVersion["1.0.5"] = 5] = "1.0.5";
    FuseContractVersion[FuseContractVersion["1.1.0"] = 6] = "1.1.0";
    FuseContractVersion[FuseContractVersion["1.1.1"] = 7] = "1.1.1";
    FuseContractVersion[FuseContractVersion["1.1.2"] = 8] = "1.1.2";
    FuseContractVersion[FuseContractVersion["1.1.3"] = 9] = "1.1.3";
    FuseContractVersion[FuseContractVersion["1.1.4"] = 10] = "1.1.4";
    FuseContractVersion[FuseContractVersion["1.1.5"] = 11] = "1.1.5";
    FuseContractVersion[FuseContractVersion["1.1.6"] = 12] = "1.1.6";
    FuseContractVersion[FuseContractVersion["1.2.0"] = 13] = "1.2.0";
    FuseContractVersion[FuseContractVersion["1.2.1"] = 14] = "1.2.1";
    FuseContractVersion[FuseContractVersion["1.2.2"] = 15] = "1.2.2";
})(FuseContractVersion || (FuseContractVersion = {}));
const addresses = {
    [ChainID.ETHEREUM]: MAINNET_ADDRESSES,
    [ChainID.HARDHAT]: MAINNET_ADDRESSES,    // Todo - update all these addresses
    [ChainID.ARBITRUM]: ARBITRUM_ADDRESSES,
    [ChainID.ARBITRUM_TESTNET]: ARBITRUM_RINKEBY_ADDRESSES,
};
export default addresses;
