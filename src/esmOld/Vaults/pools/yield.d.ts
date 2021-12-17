import { JsonRpcProvider } from "@ethersproject/providers";
import StablePool from "./stable";
export default class YieldPool extends StablePool {
    rypt: any;
    API_BASE_URL: string;
    POOL_NAME: string;
    POOL_TOKEN_SYMBOL: string;
    static CONTRACT_ADDRESSES: {
        RariFundController: string;
        RariFundManager: string;
        RariFundToken: string;
        RariFundPriceConsumer: string;
        RariFundProxy: string;
    };
    static LEGACY_CONTRACT_ADDRESSES: {
        "v1.0.0": {
            RariFundController: string;
            RariFundProxy: string;
        };
        "v1.1.0": {
            RariFundProxy: string;
        };
    };
    static LEGACY_CONTRACT_ABIS: {
        "v1.0.0": {
            RariFundController: ({
                inputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                anonymous: boolean;
                inputs: {
                    indexed: boolean;
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                name: string;
                type: string;
                payable?: undefined;
                stateMutability?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                payable: boolean;
                stateMutability: string;
                type: string;
                inputs?: undefined;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
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
            } | {
                constant: boolean;
                inputs: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                name: string;
                outputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
            })[];
            RariFundProxy: ({
                inputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                anonymous: boolean;
                inputs: {
                    indexed: boolean;
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                name: string;
                type: string;
                payable?: undefined;
                stateMutability?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                payable: boolean;
                stateMutability: string;
                type: string;
                inputs?: undefined;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
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
            } | {
                constant: boolean;
                inputs: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                name: string;
                outputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
            })[];
        };
        "v1.1.0": {
            RariFundProxy: ({
                inputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                anonymous: boolean;
                inputs: {
                    indexed: boolean;
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                name: string;
                type: string;
                payable?: undefined;
                stateMutability?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
                payable: boolean;
                stateMutability: string;
                type: string;
                inputs?: undefined;
                anonymous?: undefined;
                name?: undefined;
                constant?: undefined;
                outputs?: undefined;
            } | {
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
            } | {
                constant: boolean;
                inputs: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                name: string;
                outputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
            })[];
        };
    };
    constructor(provider: JsonRpcProvider, subpools: any, getAllTokens: any);
}
