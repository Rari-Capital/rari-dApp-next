import { useQuery } from "react-query";
import { checkAllowance } from "utils/erc20Utils";
import { useRari } from "context/RariContext";

const useHasApproval = (
  underlyingToken: string,
  spender: string,
  userAddress?: string
) => {
  const { address, chainId, provider } = useRari();
  const addressToUse = userAddress ?? address;

  const { data } = useQuery(
    `${addressToUse} has approval for TurboRouter`,
    async () => {
      if (!addressToUse || !chainId) return false;

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
