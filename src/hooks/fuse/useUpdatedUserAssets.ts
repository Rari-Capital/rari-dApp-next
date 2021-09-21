// Hooks
import { useRari } from "context/RariContext";
import { useQuery, UseQueryResult } from "react-query";
import { useMemo } from "react";

// Utils / types
import { Mode } from "components/pages/Fuse/Modals/PoolModal";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { AmountSelectMode } from "components/shared/AmountSelectNew/AmountSelectNew";

import { constants, BigNumber, utils } from 'ethers'


const useUpdatedUserAssets = ({
  mode,
  index,
  assets,
  amount,
}: {
  mode: Mode | AmountSelectMode;
  assets: USDPricedFuseAsset[] | undefined;
  index: number;
  amount: number;
}) => {
  const { rari, fuse } = useRari();

  const { data: updatedAssets }: UseQueryResult<USDPricedFuseAsset[]> =
    useQuery(
      mode + " " + index + " " + JSON.stringify(assets) + " " + amount,
      async () => {
        if (!assets || !assets.length) return [];

        const ethPrice: number = parseInt(utils.formatEther(await rari.getEthUsdPriceBN()));

        const assetToBeUpdated = assets[index];

        const interestRateModel = await fuse.getInterestRateModel(
          assetToBeUpdated.cToken
        );

        let updatedAsset: USDPricedFuseAsset;
        if (mode === Mode.SUPPLY || mode === AmountSelectMode.LEND) {
          const supplyBalance =
            parseInt(assetToBeUpdated.supplyBalance as any) + amount;

          const totalSupply =
            parseInt(assetToBeUpdated.totalSupply as any) + amount;

          //   Len.log(
          //     { mode, assetToBeUpdated, totalSupply, amount },
          //     assetToBeUpdated.totalSupply
          //   );

          updatedAsset = {
            ...assetToBeUpdated,

            supplyBalance,
            supplyBalanceUSD:
              ((supplyBalance * assetToBeUpdated.underlyingPrice) / 1e36) *
              ethPrice,

            totalSupply,
            supplyRatePerBlock: interestRateModel.getSupplyRate(
                totalSupply > 0
                  ? BigNumber.from(assetToBeUpdated.totalBorrow)
                      .div(utils.parseUnits(totalSupply.toString()))
                      .mul(constants.WeiPerEther)
                  : constants.Zero
              )
          };

          console.log("LEND", { updatedAsset });
        } else if (mode === Mode.WITHDRAW) {
          const supplyBalance =
            parseInt(assetToBeUpdated.supplyBalance as any) - amount;

          const totalSupply =
            parseInt(assetToBeUpdated.totalSupply as any) - amount;

          updatedAsset = {
            ...assetToBeUpdated,

            supplyBalance,
            supplyBalanceUSD:
              ((supplyBalance * assetToBeUpdated.underlyingPrice) / 1e36) *
              ethPrice,

            totalSupply,
            supplyRatePerBlock: interestRateModel.getSupplyRate(
                totalSupply > 0
                  ? BigNumber.from(assetToBeUpdated.totalBorrow)
                      .div(utils.parseUnits(totalSupply.toString()))
                      .mul(1e18)
                  : 0
              )
          };
        } else if (mode === Mode.BORROW || mode === AmountSelectMode.BORROW) {
          const borrowBalance =
            parseInt(assetToBeUpdated.borrowBalance as any) + amount;

          const totalBorrow =
            parseInt(assetToBeUpdated.totalBorrow as any) + amount;

          updatedAsset = {
            ...assetToBeUpdated,

            borrowBalance,
            borrowBalanceUSD:
              ((borrowBalance * assetToBeUpdated.underlyingPrice) / 1e36) *
              ethPrice,

            totalBorrow,
            borrowRatePerBlock: interestRateModel.getBorrowRate(
                assetToBeUpdated.totalSupply > 0
                  ? utils.parseUnits(totalBorrow.toString())
                      .div(utils.parseUnits(assetToBeUpdated.totalSupply.toString()))
                      .mul(constants.WeiPerEther)
                  : 0
              )
          };
        } else if (mode === Mode.REPAY) {
          const borrowBalance =
            parseInt(assetToBeUpdated.borrowBalance as any) - amount;

          const totalBorrow =
            parseInt(assetToBeUpdated.totalBorrow as any) - amount;

          const borrowRatePerBlock = interestRateModel.getBorrowRate(
              assetToBeUpdated.totalSupply > 0
                ? utils.parseUnits(totalBorrow.toString())
                    .div(utils.parseUnits(assetToBeUpdated.totalSupply.toString()))
                    .mul(constants.WeiPerEther)
                : 0
            )

          //   console.log({ borrowRatePerBlock });

          updatedAsset = {
            ...assetToBeUpdated,

            borrowBalance,
            borrowBalanceUSD:
              ((borrowBalance * assetToBeUpdated.underlyingPrice) / 1e36) *
              ethPrice,

            totalBorrow,
            borrowRatePerBlock,
          };
        }

        const ret = assets.map((value, _index) => {
          if (_index === index) {
            return updatedAsset;
          } else {
            return value;
          }
        });

        console.log({ ret });

        return ret;
      }
    );

  //   console.log({ updatedAssets, mode });

  return useMemo(() => updatedAssets, [updatedAssets]);
};

export const useUpdatedUserAssetsForBorrowAndLend = ({
  lendIndex,
  borrowIndex,
  assets,
  lendAmount,
  borrowAmount,
}: {
  assets: USDPricedFuseAsset[];
  lendIndex: number;
  borrowIndex: number;
  lendAmount: number;
  borrowAmount: number;
}) => {
  console.log({ assets, lendIndex, borrowIndex, lendAmount, borrowAmount });

  const updatedAssetsLend: USDPricedFuseAsset[] | undefined =
    useUpdatedUserAssets({
      mode: AmountSelectMode.LEND,
      assets,
      index: lendIndex,
      amount: lendAmount,
    });

  // const updatedAssetsLendAndBorrow: USDPricedFuseAsset[] | undefined =
  //   useUpdatedUserAssets({
  //     mode: AmountSelectMode.BORROW,
  //     assets: updatedAssetsLend,
  //     index: borrowIndex,
  //     amount: borrowAmount,
  //   });

  return updatedAssetsLend;
};

// const useAmountIsValid = ({
//     mode,
//     amount,
//   }: {
//     mode: Mode;
//     amount: number;
//   }) => {

//   const { rari, fuse, address } = useRari();

// const { data: amountIsValid } = useQuery(
//     (amount?.toString() ?? "null") + " " + mode + " isValid",
//     async () => {
//       if (amount === null || amount.isZero()) {
//         return false;
//       }

//       try {
//         const max = await fetchMaxAmount(
//           mode,
//           fuse,
//           address,
//           asset,
//           comptrollerAddress
//         );

//         return amount.lte(max!.toString());
//       } catch (e) {
//         handleGenericError(e, toast);
//         return false;
//       }
//     }
//   );
// })

export default useUpdatedUserAssets;
