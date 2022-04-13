// Hooks
import { useRari } from "context/RariContext";
import { useQuery, UseQueryResult } from "react-query";
import { useMemo } from "react";

// Utils / types
import { Mode } from "components/pages/Fuse/Modals/PoolModal";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { AmountSelectMode } from "components/shared/AmountSelectNew/AmountSelectNew";

import { constants, BigNumber } from "ethers";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { parseEther } from "ethers/lib/utils";

const useUpdatedUserAssets = ({
  mode,
  index,
  assets,
  amount,
}: {
  mode: Mode | AmountSelectMode;
  assets: USDPricedFuseAsset[] | undefined;
  index: number;
  amount: BigNumber;
}) => {
  const { fuse } = useRari();

  const { data: updatedAssets }: UseQueryResult<USDPricedFuseAsset[]> =
    useQuery(
      mode + " " + index + " " + JSON.stringify(assets) + " " + amount,
      async () => {
        if (!assets || !assets.length) return [];

        const ethPrice: BigNumber = await getEthUsdPriceBN();

        const assetToBeUpdated = assets[index];

        const interestRateModel = await fuse.getInterestRateModel(
          assetToBeUpdated.cToken
        );

        let updatedAsset: USDPricedFuseAsset;
        if (mode === Mode.SUPPLY || mode === AmountSelectMode.LEND) {
          const supplyBalance = assetToBeUpdated.supplyBalance.add(amount);

          const totalSupply = assetToBeUpdated.totalSupply.add(amount);

          updatedAsset = {
            ...assetToBeUpdated,

            supplyBalance,
            supplyBalanceUSD: supplyBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(parseEther(ethPrice.toString()))
              .div(constants.WeiPerEther),

            totalSupply,
            supplyRatePerBlock: interestRateModel.getSupplyRate(
              totalSupply.gt(0)
                ? assetToBeUpdated.totalBorrow
                    .mul(constants.WeiPerEther)
                    .div(totalSupply)
                : constants.Zero
            ),
          };
        } else if (mode === Mode.WITHDRAW) {
          const supplyBalance = assetToBeUpdated.supplyBalance.sub(amount);
          const totalSupply = assetToBeUpdated.totalSupply.sub(amount);

          updatedAsset = {
            ...assetToBeUpdated,

            supplyBalance,
            supplyBalanceUSD: supplyBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(parseEther(ethPrice.toString()))
              .div(constants.WeiPerEther),

            totalSupply,
            supplyRatePerBlock: interestRateModel.getSupplyRate(
              totalSupply.gt(constants.Zero)
                ? assetToBeUpdated.totalBorrow
                    .div(totalSupply)
                    .mul(constants.WeiPerEther)
                : constants.Zero
            ),
          };
          
        } else if (mode === Mode.BORROW || mode === AmountSelectMode.BORROW) {
          const borrowBalance = assetToBeUpdated.borrowBalance.add(amount);

          const totalBorrow = assetToBeUpdated.totalBorrow.add(amount);

          let newUtilRate = totalBorrow
            .mul(constants.WeiPerEther)
            .div(assetToBeUpdated.totalSupply);

          updatedAsset = {
            ...assetToBeUpdated,

            borrowBalance,
            borrowBalanceUSD: borrowBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(parseEther(ethPrice.toString()))
              .div(constants.WeiPerEther),

            totalBorrow,
            borrowRatePerBlock: interestRateModel.getBorrowRate(
              assetToBeUpdated.totalSupply.gt(constants.Zero)
                ? newUtilRate
                : constants.Zero
            ),
          };
        } else if (mode === Mode.REPAY) {
          const borrowBalance = assetToBeUpdated.borrowBalance.sub(amount);

          const totalBorrow = assetToBeUpdated.totalBorrow.sub(amount);

          let newUtilRate = totalBorrow
            .mul(constants.WeiPerEther)
            .div(assetToBeUpdated.totalSupply);

          const borrowRatePerBlock = interestRateModel.getBorrowRate(
            assetToBeUpdated.totalSupply.gt(constants.Zero)
              ? newUtilRate
              : constants.Zero
          );

          updatedAsset = {
            ...assetToBeUpdated,

            borrowBalance,
            borrowBalanceUSD: borrowBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(parseEther(ethPrice.toString()))
              .div(constants.WeiPerEther),
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
  lendAmount: BigNumber;
  borrowAmount: BigNumber;
}) => {
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
