import StablePool from "./stable.js";
export default class EthereumPool extends StablePool {
    API_BASE_URL: string;
    POOL_TOKEN_SYMBOL: string;
    rept: any;
    static CONTRACT_ADDRESSES: {
        RariFundController: string;
        RariFundManager: string;
        RariFundToken: string;
        RariFundProxy: string;
    };
    static CONTRACT_ABIS: {
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
        RariFundManager: ({
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
            anonymous?: undefined;
            inputs?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: never[];
            payable: boolean;
            stateMutability: string;
            type: string;
            anonymous?: undefined;
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
        })[];
        RariFundToken: ({
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
            inputs: never[];
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
    static LEGACY_CONTRACT_ADDRESSES: {
        "v1.0.0": {
            RariFundController: string;
        };
        "v1.2.0": {
            RariFundController: string;
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
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                } | {
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                })[];
                name: string;
                outputs: never[];
                payable: boolean;
                stateMutability: string;
                type: string;
                anonymous?: undefined;
            })[];
        };
        "v1.2.0": {
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
        };
    };
    constructor(web3: any, subpools: any, getAllTokens: any);
}
