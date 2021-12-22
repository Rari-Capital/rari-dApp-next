import { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface InitializableClonesInterface extends utils.Interface {
    functions: {
        "clone(address,bytes)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "clone", values: [string, BytesLike]): string;
    decodeFunctionResult(functionFragment: "clone", data: BytesLike): Result;
    events: {
        "Deployed(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Deployed"): EventFragment;
}
export declare type DeployedEvent = TypedEvent<[string], {
    instance: string;
}>;
export declare type DeployedEventFilter = TypedEventFilter<DeployedEvent>;
export interface InitializableClones extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InitializableClonesInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        clone(master: string, initializer: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    clone(master: string, initializer: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        clone(master: string, initializer: BytesLike, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "Deployed(address)"(instance?: null): DeployedEventFilter;
        Deployed(instance?: null): DeployedEventFilter;
    };
    estimateGas: {
        clone(master: string, initializer: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        clone(master: string, initializer: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
