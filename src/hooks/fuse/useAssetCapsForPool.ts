import { useRari } from "context/RariContext";
import { BigNumber } from "ethers";
import { constants } from "ethers";
import { Interface } from "ethers/lib/utils";
import { useQuery } from "react-query";
import { callInterfaceWithMulticall } from "utils/multicall";

export type AssetCapsMap = {
  [market: string]: {
    supplyCap: BigNumber;
    borrowCap: BigNumber;
  };
};

const useAssetCaps = (
  comptroller: string | undefined,
  marketAddresses: string[]
) => {
  const { fuse } = useRari();

  const IComptroller = new Interface(
    JSON.parse(
      fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
    )
  );

  const { data } = useQuery(
    `asset caps for ${marketAddresses.join(", ")}`,
    async () => {
      let map: AssetCapsMap = {};

      if (!comptroller) return map;

      await Promise.all(
        marketAddresses.map(async (market) => {
          let supplyCap = constants.Zero;
          let borrowCap = constants.Zero;
          try {
            let [[_supplyCap], [_borrowCap]] = await callInterfaceWithMulticall(
              fuse.provider,
              IComptroller,
              comptroller,
              ["supplyCaps", "borrowCaps"],
              [[market], [market]]
            );
            supplyCap = _supplyCap;
            borrowCap = _borrowCap;

            map[market] = {
              supplyCap,
              borrowCap,
            };

            return;
          } catch (err) {
            console.error(`${market} error with supply/borrow caps`);
          }
        })
      );

      return map;
    }
  );
  return data ?? {};
};

export default useAssetCaps;