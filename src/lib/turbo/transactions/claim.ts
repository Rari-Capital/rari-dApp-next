import { FEI } from "../utils/constants";
import { sendRouterWithMultiCall } from "../utils/turboMulticall";
import encodeCall from "./encodedCalls";

interface SafeClaimParams {
    safeAddress: string,
    strategies: string[],
    recipient: string,
    signer: any,
    chainID: number,
}

/*
/* Multicall 
/* 1.) Slurp all strategies to safe
/* 2.) Sweep the safe to recipient
*/
export const safeClaimAll = async (
    {
        safeAddress,
        strategies,
        recipient,
        signer,
        chainID,
    }: SafeClaimParams
) => {

    // 1.) Slurp all strategies
    const encodedSlurps = strategies.map(strategy =>
        encodeCall.slurp(safeAddress, strategy)
    );

    // 2.) Sweep da safe
    const encodedSweepAll = encodeCall.sweepAll(safeAddress, recipient, FEI);

    const encodedCalls = [
        ...encodedSlurps,
        encodedSweepAll
    ]

    try {
        const tx = await sendRouterWithMultiCall(
            signer,
            encodedCalls,
            chainID
        );
        return tx
    } catch (err) {
        console.error(err);
        throw err
    }
}