import { useRari } from "context/RariContext";
import { getTurboApprovedCollateral } from "lib/turbo/fetchers/getApprovedCollaterals";
import { useQuery } from "react-query";

const useApprovedCollateral = () => {
  const { provider } = useRari();
  const { data } = useQuery("Approved Turbo Collateral", async () => {
    return await getTurboApprovedCollateral(provider);
  });
  return data ?? [];
};

export default useApprovedCollateral;
