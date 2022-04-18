import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { useQuery } from "react-query";

const useETHUSDBN = () => {
  const { data: ethUSDPriceBN } = useQuery("ETHUSD", async () =>
    getEthUsdPriceBN()
  );
  return ethUSDPriceBN;
};

export default useETHUSDBN;
