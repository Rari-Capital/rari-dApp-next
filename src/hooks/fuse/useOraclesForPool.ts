import { useRari } from "context/RariContext";
import { defaultAbiCoder } from "ethers/lib/utils";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { createOracle } from "utils/createComptroller";

type OraclesEventData = [
  underlying: string,
  oldOracle: string,
  newOracle: string
]

type UnderlyingOracleMap = {
  [underlyingToken: string]: string;
}


export type OracleUnderlyingsMap = {
  [oracleAddr: string]: string[];
}

const useOraclesForPool = (
  poolOracle: string | undefined,
  underlyings: string[]
): OracleUnderlyingsMap => {
  const { fuse } = useRari();

  const { data } = useQuery(
    "querying oracles for MasterPriceOracle " + poolOracle,
    async () => {
      if (!poolOracle) return {};

      const mpo = createOracle(poolOracle, fuse, "MasterPriceOracle");

      // const contract = new ethers.Contract(address, abi, provider.getSigner(0));
      let NewOracleFilter = mpo.filters.NewOracle();

      let eventsFilter = await mpo.queryFilter(NewOracleFilter,);

      const oraclesData: OraclesEventData[] = eventsFilter?.map(eF =>
        defaultAbiCoder.decode(["address", "address", "address"], eF.data) as OraclesEventData
      ) ?? []

      const oraclesMap: UnderlyingOracleMap = oraclesData.reduce((acc: UnderlyingOracleMap, curr) => ({
        ...acc,
        [curr[0]]: curr[2]

      }), {})
      return oraclesMap;
    }
  );

  const tokenToOracleMap = data ?? {};

  //   Maps oracle to list of underlyings
  const oraclesMap = useMemo(() => {
    const map: OracleUnderlyingsMap = {};

    // TODO - bring back
    if (!!Object.keys(tokenToOracleMap).length) {
      Object.entries(tokenToOracleMap).map(
        ([underlying, oracleAddr]: [string, string]) => {
          if (!map[oracleAddr]) {
            map[oracleAddr] = [underlying];
          } else {
            map[oracleAddr] = [...map[oracleAddr], underlying];
          }
        }
      );
    }

    return map;
  }, [tokenToOracleMap]);

  return oraclesMap;
};

export default useOraclesForPool;
