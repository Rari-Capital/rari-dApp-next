import { useRari } from "context/RariContext";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { createOracle } from "utils/createComptroller";

const useOraclesForPool = (
  poolOracle: string | undefined,
  underlyings: string[]
) => {
  const { fuse } = useRari();

  const { data } = useQuery(
    "querying oracles for MasterPriceOracle " + poolOracle,
    async () => {
      if (!poolOracle) return {};

      const mpo = createOracle(poolOracle, fuse, "MasterPriceOracle");

      // const contract = new ethers.Contract(address, abi, provider.getSigner(0));
      let eventFilter = mpo.filters.NewOracle();

      let events = await mpo.queryFilter(eventFilter, );

      console.log({ events, eventFilter });

      // try {
      // let events = await mpo.queryFilter(eventFilter);

      // const events = await mpo.getPastEvents("NewOracle", {
      //   fromBlock: 0,
      //   toBlock: "latest",
      // });

      //   const oracles: {
      //     [underlyingToken: string]: string;
      //   } = {};
      //   for (let e of events) {
      //     if (
      //       e.returnValues.newOracle !==
      //       "0x0000000000000000000000000000000000000000"
      //     )
      //       oracles[e.returnValues.underlying] = e.returnValues.newOracle;
      //     else if (oracles[e.returnValues.underlying] !== undefined)
      //       delete oracles[e.returnValues.underlying];
      //   }

      //   return oracles;
      // } catch (err) {
      //   console.error("useOraclesForPool", err);
      // }
      return {};
    }
  );

  const tokenToOracleMap = data ?? {};

  //   Maps oracle to list of underlyings
  const oraclesMap = useMemo(() => {
    const map: {
      [oracleAddr: string]: string[];
    } = {};

    // TODO - bring back
    // if (!!Object.keys(tokenToOracleMap).length) {
    //   Object.entries(tokenToOracleMap).map(
    //     ([underlying, oracleAddr]: [string, string]) => {
    //       if (!map[oracleAddr]) {
    //         map[oracleAddr] = [underlying];
    //       } else {
    //         map[oracleAddr] = [...map[oracleAddr], underlying];
    //       }
    //     }
    //   );
    // }

    return map;
  }, [tokenToOracleMap]);

  return oraclesMap;
};

export default useOraclesForPool;
