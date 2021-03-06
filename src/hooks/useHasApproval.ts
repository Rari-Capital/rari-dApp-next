import { useQuery } from "react-query";
import { checkAllowance } from "utils/erc20Utils";
import { useRari } from "context/RariContext";
import { parseEther } from "ethers/lib/utils";
import { isSupportedChainId } from "esm/utils/networks";

const useHasApproval = (
  underlyingToken: string | undefined,
  spender: string | undefined,
  amount: string,
  userAddress?: string
) => {
  const { address, chainId, provider } = useRari();
  const addressToUse = userAddress ?? address;

  const { data } = useQuery(
    ` ${spender} has approval to spend ${underlyingToken} ${amount} on behalf of ${addressToUse} on chain ${chainId}`,
    async () => {
      if (
        !addressToUse ||
        !chainId ||
        !spender ||
        !underlyingToken ||
        !isSupportedChainId(chainId)
      )
        return false;
      if (amount === "" || amount === "0") return true;

      return await checkAllowance(
        provider,
        addressToUse,
        spender,
        underlyingToken,
        parseEther(amount)
      );
    }
  );
  return data ?? false;
};

export default useHasApproval;
