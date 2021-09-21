// Ethers
import { Contract } from "ethers";
// StablePool
import StablePools from "./stable";
// Legacy ABIs (v1.0.0)
import RariFundControllerv100 from "./dai/abi/legacy/v1.0.0/RariFundController.json";
import RariFundProxyABIv100 from "./dai/abi/legacy/v1.0.0/RariFundProxy.json";
// Contract Addresses
const contractAddressesDai = {
    RariFundController: "0xaFD2AaDE64E6Ea690173F6DE59Fc09F5C9190d74",
    RariFundManager: "0xB465BAF04C087Ce3ed1C266F96CA43f4847D9635",
    RariFundToken: "0x0833cfcb11A5ba89FbAF73a407831c98aD2D7648",
    RariFundPriceConsumer: "0x96ce4C781eDF07F4e3D210c919CA4F9A7ad82a7f",
    RariFundProxy: "0x7C332FeA58056D1EF6aB2B2016ce4900773DC399",
};
// Legacy Addresses
const legacyContractAddressesDai = {
    "v1.0.0": {
        RariFundController: "0xD7590e93a2e04110Ad50ec70EADE7490F7B8228a",
        RariFundProxy: "0x3F579F097F2CE8696Ae8C417582CfAFdE9Ec9966",
    },
};
// For every contractName require the ABI
const legacyAbisDai = {
    "v1.0.0": {
        RariFundController: RariFundControllerv100,
        RariFundProxy: RariFundProxyABIv100,
    },
};
export default class DaiPool extends StablePools {
    constructor(provider, subpools, getAllTokens) {
        super(provider, subpools, getAllTokens);
        this.API_BASE_URL = "https://api.rari.capital/pools/dai/";
        this.POOL_NAME = "Rari DAI Pool";
        this.POOL_TOKEN_SYMBOL = "RDPT";
        this.contracts = {};
        for (const contractName of Object.keys(contractAddressesDai))
            this.contracts[contractName] = new Contract(contractAddressesDai[contractName], DaiPool.CONTRACT_ABIS[contractName], this.provider);
        this.legacyContracts = {};
        for (const version of Object.keys(legacyContractAddressesDai)) {
            if (!this.legacyContracts[version])
                this.legacyContracts[version] = {};
            for (const contractName of Object.keys(legacyContractAddressesDai[version])) {
                this.legacyContracts[version][contractName] = new Contract(legacyContractAddressesDai[version][contractName], legacyAbisDai[version][contractName], this.provider);
            }
        }
        this.allocations.POOLS = (function () {
            let pools = ["dYdX", "Compound", "Aave", "mStable"];
            pools[100] = "Fuse6";
            pools[101] = "Fuse7";
            pools[102] = "Fuse18";
            return pools;
        })();
        this.allocations.POOLS_BY_CURRENCY = {
            DAI: ["dYdX", "Compound", "Aave", "Fuse6", "Fuse7", "Fuse18"],
            mUSD: ["mStable"],
        };
        this.allocations.CURRENCIES_BY_POOL = {
            dYdX: ["DAI"],
            Compound: ["DAI"],
            Aave: ["DAI"],
            mStable: ["mUSD"],
            Fuse6: ["DAI"],
            Fuse7: ["DAI"],
            Fuse18: ["DAI"],
        };
    }
}
DaiPool.CONTRACT_ADDRESSES = contractAddressesDai;
DaiPool.LEGACY_CONTRACT_ADDRESSES = legacyContractAddressesDai;
DaiPool.LEGACY_CONTRACT_ABIS = legacyAbisDai;
