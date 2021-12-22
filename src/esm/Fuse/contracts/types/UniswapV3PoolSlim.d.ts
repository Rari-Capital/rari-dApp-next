import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface UniswapV3PoolSlimInterface extends utils.Interface {
    functions: {
        "increaseObservationCardinalityNext(uint16)": FunctionFragment;
        "slot0()": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "increaseObservationCardinalityNext", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "slot0", values?: undefined): string;
    decodeFunctionResult(functionFragment: "increaseObservationCardinalityNext", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "slot0", data: BytesLike): Result;
    events: {};
}
export interface UniswapV3PoolSlim extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: UniswapV3PoolSlimInterface;
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
        increaseObservationCardinalityNext(observationCardinalityNext: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        slot0(overrides?: CallOverrides): Promise<[
            BigNumber,
            number,
            number,
            number,
            number,
            number,
            boolean
        ] & {
            sqrtPriceX96: BigNumber;
            tick: number;
            observationIndex: number;
            observationCardinality: number;
            observationCardinalityNext: number;
            feeProtocol: number;
            unlocked: boolean;
        }>;
    };
    increaseObservationCardinalityNext(observationCardinalityNext: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    slot0(overrides?: CallOverrides): Promise<[
        BigNumber,
        number,
        number,
        number,
        number,
        number,
        boolean
    ] & {
        sqrtPriceX96: BigNumber;
        tick: number;
        observationIndex: number;
        observationCardinality: number;
        observationCardinalityNext: number;
        feeProtocol: number;
        unlocked: boolean;
    }>;
    callStatic: {
        increaseObservationCardinalityNext(observationCardinalityNext: BigNumberish, overrides?: CallOverrides): Promise<void>;
        slot0(overrides?: CallOverrides): Promise<[
            BigNumber,
            number,
            number,
            number,
            number,
            number,
            boolean
        ] & {
            sqrtPriceX96: BigNumber;
            tick: number;
            observationIndex: number;
            observationCardinality: number;
            observationCardinalityNext: number;
            feeProtocol: number;
            unlocked: boolean;
        }>;
    };
    filters: {};
    estimateGas: {
        increaseObservationCardinalityNext(observationCardinalityNext: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        slot0(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        increaseObservationCardinalityNext(observationCardinalityNext: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        slot0(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
