import { useQuery } from "react-query";
import { useRari } from "../context/RariContext";
import {
  fetchPoolInterestEarned,
  PoolInterestEarned,
} from "../utils/fetchPoolInterest";
import useVaultsSDK from "./vaults/useVaultsSDK";

export const usePoolInterestEarned = (): PoolInterestEarned | undefined => {
  const { address } = useRari();
  const { rari } = useVaultsSDK();


  const { data } = useQuery(address + " interest earned", () => {
    return fetchPoolInterestEarned(rari, address);
  });

  return data;
};
