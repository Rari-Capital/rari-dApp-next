import { toInt } from "./ethersUtils";

export const convertMantissaToAPY = (mantissa: any, dayRange: number = 35) => {
  if (!mantissa) return 0
  const parsedMantissa = toInt(mantissa)
  return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};

export const convertMantissaToAPR = (mantissa: any) => {
  if (!mantissa) return 0
  const parsedMantissa = toInt(mantissa)
  return (parsedMantissa * 2372500) / 1e16;
};
