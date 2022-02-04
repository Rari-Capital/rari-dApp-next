import { BigNumber } from "ethers";

const formatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
});

const smallFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const shortFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export function smallStringUsdFormatter(num: string | number) {
  return smallFormatter.format(parseFloat(num.toString()));
}

export function stringUsdFormatter(num: string) {
  return formatter.format(parseFloat(num));
}

export function smallUsdFormatter(num: number | string) {
  if (typeof num === typeof "") {
    return smallFormatter.format(parseFloat(num as string));
  }
  return smallFormatter.format(num as number);
}

export function usdFormatter(num: number) {
  return formatter.format(num);
}

export function shortUsdFormatter(num: number | string) {
  if (typeof num === typeof "") {
    return "$" + shortFormatter.format(parseFloat(num as string));
  }
  return "$" + shortFormatter.format(num as number);
}

export const abbreviateAmount = (amount: number) => {
  return Math.abs(amount) > 100000
    ? shortUsdFormatter(amount)
    : smallUsdFormatter(amount);
};

export const bnToString = (bn: BigNumber): string => bn.toString();
export const bnToNumber = (bn: BigNumber): number => parseFloat(bnToString(bn));
