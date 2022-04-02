import { BigNumber } from "ethers";
import { ITurboRouter } from "lib/turbo/utils/turboContracts";
import { encodeRouterCall } from "lib/turbo/utils/turboMulticall";
// TODO: natspec on funcs

/** Periphery Payments  **/
type PullTokenArgs = [token: string, amount: BigNumber, recipient: string];
const pullTokens = (
  token: string,
  amount: BigNumber,
  recipient: string
) => {
  const pullTokenArgs: PullTokenArgs = [token, amount, recipient];
  return encodeRouterCall(ITurboRouter, "pullToken", pullTokenArgs);
};

/** Create Safe **/
type CreateSafeAndDepositArgs = [
  token: string,
  userAddress: string,
  amount: BigNumber,
  sharesRecieved: BigNumber
];
const createSafeAndDeposit = (
  token: string,
  userAddress: string,
  amount: BigNumber,
  sharesRecieved: BigNumber
) => {
  const createAndDepositArgs: CreateSafeAndDepositArgs = [
    token,
    userAddress,
    amount,
    sharesRecieved,
  ];
  return encodeRouterCall(
    ITurboRouter,
    "createSafeAndDeposit",
    createAndDepositArgs
  );
};

type CreateSafeArgs = [
  token: string,
];

const createSafe = (
  underlyingToken: string,
) => {
  const createSafe: CreateSafeArgs = [
    underlyingToken
  ];
  return encodeRouterCall(
    ITurboRouter,
    "createSafe",
    createSafe
  );
};

/** Boost / Less  **/
type BoostAndLessArgs = [safe: string, strategy: string, amount: BigNumber];
const boost = (safe: string, strategy: string, amount: BigNumber) => {
  const boostArgs: BoostAndLessArgs = [safe, strategy, amount];
  return encodeRouterCall(ITurboRouter, "boost", boostArgs);
};

const less = (safe: string, strategy: string, amount: BigNumber) => {
  const boostArgs: BoostAndLessArgs = [safe, strategy, amount];
  return encodeRouterCall(ITurboRouter, "less", boostArgs);
};

/** Deposit / Withdraw  **/
type DepositAndWithdrawArgs = any[];
const deposit = (safe: string, strategy: string, amount: BigNumber) => {
  const boostArgs: DepositAndWithdrawArgs = [safe, strategy, amount];
  return encodeRouterCall(ITurboRouter, "boost", boostArgs);
};

const withdraw = (safe: string, strategy: string, amount: BigNumber) => {
  const boostArgs: DepositAndWithdrawArgs = [safe, strategy, amount];
  return encodeRouterCall(ITurboRouter, "less", boostArgs);
};

type SlurpArgs = [safe: string, strategy: string];
const slurp = (safe: string, strategy: string) => {
  const slurpArgs: SlurpArgs = [safe, strategy];
  return encodeRouterCall(ITurboRouter, "slurp", slurpArgs);
};

type SweepArgs = [safe: string, recepient: string, tokenAddress: string, amount: BigNumber];
const sweep = (safe: string, recepient: string, tokenAddress: string, amount: BigNumber) => {
  const sweepArgs: SweepArgs = [safe, recepient, tokenAddress, amount];
  return encodeRouterCall(ITurboRouter, "sweep", sweepArgs);
};

type SweepAllArgs = [safe: string, recepient: string, tokenAddress: string];
const sweepAll = (safe: string, recepient: string, tokenAddress: string) => {
  const sweepAllArgs: SweepAllArgs = [safe, recepient, tokenAddress];
  return encodeRouterCall(ITurboRouter, "sweepAll", sweepAllArgs);
}

const encodeCall = {
  pullTokens,
  createSafeAndDeposit,
  createSafe,
  boost,
  less,
  deposit,
  withdraw,
  slurp,
  sweep,
  sweepAll
}

export default encodeCall