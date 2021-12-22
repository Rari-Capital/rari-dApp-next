import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface FuseSafeLiquidatorInterface extends utils.Interface {
    functions: {
        "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])": FunctionFragment;
        "safeLiquidateToTokensWithFlashLoan(address,uint256,address,address,uint256,address,address,address,address[],bytes[],uint256)": FunctionFragment;
        "safeLiquidateToEthWithFlashLoan(address,uint256,address,address,uint256,address,address,address[],bytes[],uint256)": FunctionFragment;
        "uniswapV2Call(address,uint256,uint256,bytes)": FunctionFragment;
        "redeemCustomCollateral(address,uint256,address,bytes)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "safeLiquidate", values: [
        string,
        string,
        string,
        BigNumberish,
        string,
        string,
        string[],
        BytesLike[]
    ]): string;
    encodeFunctionData(functionFragment: "safeLiquidateToTokensWithFlashLoan", values: [
        string,
        BigNumberish,
        string,
        string,
        BigNumberish,
        string,
        string,
        string,
        string[],
        BytesLike[],
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "safeLiquidateToEthWithFlashLoan", values: [
        string,
        BigNumberish,
        string,
        string,
        BigNumberish,
        string,
        string,
        string[],
        BytesLike[],
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "uniswapV2Call", values: [string, BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "redeemCustomCollateral", values: [string, BigNumberish, string, BytesLike]): string;
    decodeFunctionResult(functionFragment: "safeLiquidate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeLiquidateToTokensWithFlashLoan", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeLiquidateToEthWithFlashLoan", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV2Call", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemCustomCollateral", data: BytesLike): Result;
    events: {};
}
export interface FuseSafeLiquidator extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: FuseSafeLiquidatorInterface;
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
        "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])"(borrower: string, cEther: string, cErc20Collateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "safeLiquidate(address,uint256,address,address,uint256,address,address,address[],bytes[])"(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        safeLiquidateToTokensWithFlashLoan(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForBorrow: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        safeLiquidateToEthWithFlashLoan(borrower: string, repayAmount: BigNumberish, cEther: string, cErc20Collateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        uniswapV2Call(sender: string, amount0: BigNumberish, amount1: BigNumberish, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        redeemCustomCollateral(underlyingCollateral: string, underlyingCollateralSeized: BigNumberish, strategy: string, strategyData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])"(borrower: string, cEther: string, cErc20Collateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "safeLiquidate(address,uint256,address,address,uint256,address,address,address[],bytes[])"(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    safeLiquidateToTokensWithFlashLoan(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForBorrow: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    safeLiquidateToEthWithFlashLoan(borrower: string, repayAmount: BigNumberish, cEther: string, cErc20Collateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    uniswapV2Call(sender: string, amount0: BigNumberish, amount1: BigNumberish, data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    redeemCustomCollateral(underlyingCollateral: string, underlyingCollateralSeized: BigNumberish, strategy: string, strategyData: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])"(borrower: string, cEther: string, cErc20Collateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: CallOverrides): Promise<BigNumber>;
        "safeLiquidate(address,uint256,address,address,uint256,address,address,address[],bytes[])"(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: CallOverrides): Promise<BigNumber>;
        safeLiquidateToTokensWithFlashLoan(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForBorrow: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        safeLiquidateToEthWithFlashLoan(borrower: string, repayAmount: BigNumberish, cEther: string, cErc20Collateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        uniswapV2Call(sender: string, amount0: BigNumberish, amount1: BigNumberish, data: BytesLike, overrides?: CallOverrides): Promise<void>;
        redeemCustomCollateral(underlyingCollateral: string, underlyingCollateralSeized: BigNumberish, strategy: string, strategyData: BytesLike, overrides?: CallOverrides): Promise<[string, BigNumber]>;
    };
    filters: {};
    estimateGas: {
        "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])"(borrower: string, cEther: string, cErc20Collateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "safeLiquidate(address,uint256,address,address,uint256,address,address,address[],bytes[])"(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        safeLiquidateToTokensWithFlashLoan(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForBorrow: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        safeLiquidateToEthWithFlashLoan(borrower: string, repayAmount: BigNumberish, cEther: string, cErc20Collateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        uniswapV2Call(sender: string, amount0: BigNumberish, amount1: BigNumberish, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        redeemCustomCollateral(underlyingCollateral: string, underlyingCollateralSeized: BigNumberish, strategy: string, strategyData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        "safeLiquidate(address,address,address,uint256,address,address,address[],bytes[])"(borrower: string, cEther: string, cErc20Collateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "safeLiquidate(address,uint256,address,address,uint256,address,address,address[],bytes[])"(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minOutputAmount: BigNumberish, exchangeSeizedTo: string, uniswapV2Router: string, redemptionStrategies: string[], strategyData: BytesLike[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        safeLiquidateToTokensWithFlashLoan(borrower: string, repayAmount: BigNumberish, cErc20: string, cTokenCollateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForBorrow: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        safeLiquidateToEthWithFlashLoan(borrower: string, repayAmount: BigNumberish, cEther: string, cErc20Collateral: string, minProfitAmount: BigNumberish, exchangeProfitTo: string, uniswapV2RouterForCollateral: string, redemptionStrategies: string[], strategyData: BytesLike[], ethToCoinbase: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        uniswapV2Call(sender: string, amount0: BigNumberish, amount1: BigNumberish, data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        redeemCustomCollateral(underlyingCollateral: string, underlyingCollateralSeized: BigNumberish, strategy: string, strategyData: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
