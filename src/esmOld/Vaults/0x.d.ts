import { BigNumber } from "ethers";
export declare type ZeroXSwapOrders = [
    orders: any[],
    inputFilledAmountBN: BigNumber,
    protocolFee: any,
    takerAssetFilledAmountBN: BigNumber,
    makerAssetFilledAmountBN: BigNumber,
    gasPrice: any
];
export declare const get0xSwapOrders: (inputTokenAddress: string, outputTokenAddress: string, maxInputAmountBN: BigNumber, maxMakerAssetFillAmountBN?: BigNumber | null | undefined) => Promise<ZeroXSwapOrders>;
