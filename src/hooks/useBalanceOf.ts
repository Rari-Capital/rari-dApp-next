import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { balanceOf } from "utils/erc20Utils";
import { constants } from "ethers";
import { useRari } from "context/RariContext";

export const useBalanceOf = (
  holder: string | undefined,
  tokenAddress: string
) => {
const { provider } = useRari()
  const { data: balance } = useQuery(
    `${holder} balance of ${tokenAddress}`,
    async () => {
      if (!holder) return constants.Zero;

      const balance = await balanceOf(holder, tokenAddress, provider);
      return balance;
    }
  );

  return balance ?? constants.Zero;
};
