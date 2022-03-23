import { useMemo } from "react";
import { useQuery } from "react-query";
import { getBoostableStrategies } from "lib/turbo/fetchers/getBoostableStrategies";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
// import ERC20ABI from "contracts/abi/ERC20.json";


// Trusted Strategies will be independent of any Safe and whitelisted by TRIBE Governance
export const useTrustedStrategies = (): string[] | undefined => {
 
  // get provider
  const provider = useProvider();
  const [{ data: network }] = useNetwork()

    const {data: trustedStrategies }= useQuery(
      `Boostable strategies`, async () => {
          if(!provider || !network.chain?.id) return
          return await getBoostableStrategies(
            provider,
            network.chain?.id
          )
      }
    );

  return trustedStrategies ;
};