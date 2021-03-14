import { BigNumber } from "ethers";

export const unitsBN = (amount: number | string, decimals: number | string | undefined): BigNumber => {
  const weiString = ((10 ** Number(decimals)) * Number(amount)).toFixed(0);
  return BigNumber.from(weiString);
};

export const unitsNum = (amount: BigNumber, decimals: number | string): number => {
  return Number(amount.toString()) / (10 ** Number(decimals));
};
