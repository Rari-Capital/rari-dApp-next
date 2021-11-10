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

export function smallUsdFormatter(num: number) {
  return smallFormatter.format(num);
}

export function usdFormatter(num: number) {
  return formatter.format(num);
}

export function shortUsdFormatter(num: number) {
  return "$" + shortFormatter.format(num);
}

export const abbreviateAmount = (amount: number) => {
  return Math.abs(amount) > 100000
    ? shortUsdFormatter(amount)
    : smallUsdFormatter(amount);
};

export const bnToString = (bn: BigNumber): string => bn.toString();
export const bnToNumber = (bn: BigNumber): number => parseFloat(bnToString(bn));
