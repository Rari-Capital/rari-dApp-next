import { useQuery } from "react-query";
import { checkAllowance } from "utils/erc20Utils";
import { useRari } from "context/RariContext";

const useHasApproval = (
  underlyingToken: string | undefined,
  spender: string | undefined,
  userAddress?: string
) => {
  const { address, chainId, provider } = useRari();
  const addressToUse = userAddress ?? address;

  const { data } = useQuery(
    ` ${spender} has approval to spend ${underlyingToken} on behalf of ${addressToUse}`,
    async () => {
      if (!addressToUse || !chainId || !spender || !underlyingToken) return false;

      //   const spender = TurboAddresses[network.chain?.id].ROUTER;
      return await checkAllowance(
        provider,
        addressToUse,
        spender,
        underlyingToken,
      );
    }
  );
  return data ?? false;
};

export default useHasApproval;
