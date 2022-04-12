import { useRari } from "context/RariContext";
import { BigNumber, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { useQuery } from "react-query";
import { fetchStrategyData } from "./useStrategyInfo";
import { SafeInteractionMode } from "./useUpdatedSafeInfo";

const useUpdatedStrategyRate = (
  mode: SafeInteractionMode.BOOST | SafeInteractionMode.LESS,
  safe: SafeInfo | undefined,
  strategyIndex: number,
  amountBN: BigNumber
) => {
  const { fuse, provider } = useRari();

  const { data: updatedStrategyRates } = useQuery(
    `Updated strategy APY for safe ${
      safe?.safeAddress
    } strategy ${strategyIndex} mode ${mode} and amount ${amountBN.toString()}`,
    async () => {
      const strategy = safe?.strategies[strategyIndex];
      if (!safe || !strategy) return;

      // Get CToken from strategy
      const fuseStrategy = await fetchStrategyData(provider, strategy.strategy);
      const irm = fuse.getInterestRateModel(fuseStrategy.fToken);
      let supplyRatePerBlock = fuseStrategy.supplyRatePerBlock;

      const collateralValue = safe.collateralValue;

      const debtAmount =
        mode === SafeInteractionMode.BOOST
          ? safe.debtAmount.add(amountBN)
          : safe.debtAmount.sub(amountBN);

      const debtValue = debtAmount
        .mul(safe.feiPrice)
        .div(constants.WeiPerEther);

      console.log({ amountBN, collateralValue, debtAmount, debtValue });

      //   let newSupplyRatePerBlock = await irm.getSupplyRate(
      //     totalSupply.gt(0)
      //       ? assetToBeUpdated.totalBorrow
      //           .mul(constants.WeiPerEther)
      //           .div(totalSupply)
      //       : constants.Zero
      //   );
    }
  );

  return updatedStrategyRates;
};

export default useUpdatedStrategyRate;
