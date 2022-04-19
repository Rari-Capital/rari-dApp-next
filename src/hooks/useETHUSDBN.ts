import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import React from "react";
import { useQuery } from "react-query";

const useETHUSDBN = () => {
  const { data: ethUSDPriceBN } = useQuery(
    "ETHUSDBN",
    async () => await getEthUsdPriceBN()
  );
  return ethUSDPriceBN;
};

export default useETHUSDBN;
