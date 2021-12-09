import { useEffect, useRef, useState } from "react";

// Hooks
import { useRari } from "context/RariContext";

// ABIs
import LendingPool from "./LendingPool";

// Utils
import { ETH_TOKEN_DATA } from "hooks/useTokenData";

// Types
import { MarketInfo, InterestRatesType } from "../types";
import { Vaults } from "../../../esm/index"

// Ethers
import { Contract } from "@ethersproject/contracts";

// address for WETH
const WETH_TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export default function useReserves() {
  const { rari } = useRari();

  // state for reserves (list & borrowing/lending rate data)
  const [reserves, setReserves] = useState<MarketInfo[]>([]);

  // ref for refresh interval
  const refreshInterval = useRef<number | null>(null);

  useEffect(() => {
    const contract = new Contract(
      LendingPool.address,
      LendingPool.abi,
      rari.provider.getSigner()
    );

    // fetch list of token addresses
    async function getReserves() {
      // get list of token addresses
      const tokenList: string[] = await contract.methods
        .getReservesList()
        .call();

      // grab reserve data asynchronously
      let reservesData: MarketInfo[] = [];
      await Promise.all(
        tokenList.map(async (address) => {
          reservesData.push({
            tokenAddress: address,
            rates: await fetchReserveData(address, rari),
          });
        })
      );

      // sort reserves according to tokenList order
      // TODO: possibly remove this, as it may no
      // longer be necessary if the sorting happens
      // in InterestRatesView
      reservesData.sort(
        (a, b) =>
          tokenList.indexOf(a.tokenAddress) - tokenList.indexOf(b.tokenAddress)
      );

      reservesData = reservesData.map((reserve) => {
        // Aave lists ETH under WETH address, so we have
        // to map the WETH address to the ETH dummy address
        if (reserve.tokenAddress === WETH_TOKEN_ADDRESS)
          reserve.tokenAddress = ETH_TOKEN_DATA.address;

        return reserve;
      });

      setReserves(reservesData);
    }

    getReserves().then(() => {
      refreshInterval.current = window.setInterval(getReserves, 5000);
    });

    // clear refreshInterval on unmount (if initialized)
    return () => {
      window.clearInterval(refreshInterval.current || -1);
    };
  }, [rari, setReserves]);

  return reserves;
}

async function fetchReserveData(
  assetAddress: string,
  rari: Vaults  
): Promise<InterestRatesType> {
  // init LendingPool
  const contract = new Contract(LendingPool.address, LendingPool.abi, rari.provider.getSigner());

  // get reserve data from LendingPool
  const reserveData = await contract.getReserveData(assetAddress)

  // get lending and borrowing rates (converting from ray [1e27])
  const lendingRate = reserveData.currentLiquidityRate / 1e27;
  const borrowingRate = reserveData.currentVariableBorrowRate / 1e27;

  return { lending: lendingRate, borrowing: borrowingRate };
}
