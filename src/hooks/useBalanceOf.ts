import { useQuery } from "react-query";
import { balanceOf } from "utils/erc20Utils";
import { constants } from "ethers";
import { useRari } from "context/RariContext";

export const useBalanceOf = (
  holder: string | undefined,
  tokenAddress: string | undefined
) => {
  const { provider } = useRari();
  const { data: balance } = useQuery(
    `${holder} balance of ${tokenAddress}`,
    async () => {
      if (!holder || !tokenAddress) return constants.Zero;
      const balance = await balanceOf(holder, tokenAddress, provider);
      return balance;
    }
  );

  return balance ?? constants.Zero;
};
