// Hooks
import { fetchTokenBalance } from "hooks/useTokenBalance";

// Types
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import { Fuse } from "../esm/index"
import {
  AmountSelectMode,
  AmountSelectUserAction,
} from "components/shared/AmountSelectNew/AmountSelectNew";

// Utils
import { useCreateComptroller } from "utils/createComptroller";
import {
  checkHasApprovedEnough,
  createERC20Contract,
  isAssetETH,
  MAX_APPROVAL_AMOUNT,
} from "./tokenUtils";
import { createCTokenContract } from "./fuseUtils";
import {
  fetchGasForCall,
  testForCTokenErrorAndSend,
} from "components/pages/Fuse/Modals/PoolModal/AmountSelect";
import { handleGenericError } from "./errorHandling";


// Ethers
import { BigNumber, utils, constants } from 'ethers'

// Gets the max amount based on the input mode, asset, and balances
export const fetchMaxAmount = async (
  mode: AmountSelectMode,
  fuse: Fuse,
  address: string,
  asset: USDPricedFuseAsset,
  comptrollerAddress: string,
  isAuthed: boolean,
) => {
  if (mode === AmountSelectMode.LEND) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );

    return balance;
  }

  if (mode === AmountSelectMode.REPAY) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );
    const debt = BigNumber.from(asset.borrowBalance);

    if (balance.gt(debt)) {
      return debt;
    } else {
      return balance;
    }
  }

  if (mode === AmountSelectMode.BORROW) {
    const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);

    const { 0: err, 1: maxBorrow } = await comptroller.callStatic.getMaxBorrow(address, asset.cToken)

    if (err !== 0) {
      return maxBorrow.mul(utils.parseUnits("0.75"))
    } else {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }

  if (mode === AmountSelectMode.WITHDRAW) {
    const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);

    const { 0: err, 1: maxRedeem } = await comptroller.methods
      .getMaxRedeem(address, asset.cToken)
      .call();

    if (err !== 0) {
      return BigNumber.from(maxRedeem);
    } else {
      throw new Error("Could not fetch your max withdraw amount! Code: " + err);
    }
  }
};

export const onLendBorrowConfirm = async ({
  asset,
  borrowedAsset,
  fuse,
  address,
  lendAmount,
  borrowAmount,
  comptrollerAddress,
  setUserAction,
  isAuthed,
  toast,
}: {
  asset: USDPricedFuseAsset;
  borrowedAsset?: USDPricedFuseAsset;
  fuse: Fuse;
  address: string;
  lendAmount?: BigNumber;
  borrowAmount?: BigNumber;
  comptrollerAddress: string;
  setUserAction: (userAction: AmountSelectUserAction) => void;
  isAuthed: boolean
  toast?: any;
}) => {
  try {
    setUserAction(AmountSelectUserAction.WAITING_FOR_TRANSACTIONS);

    const isETH = isAssetETH(asset.underlyingToken);

    // Create the cTokenContract
    const cToken = createCTokenContract({ asset, fuse });

    // If a user specified they want to lend
    if (lendAmount?.gt(constants.Zero)) {
      // If asset is ERC20, check for approval and/or approve.
      if (!isETH) {
        const token = createERC20Contract({
          fuse,
          tokenAddress: asset.underlyingToken,
        });

        // Check if User has approved their underlying ERC20 to be used in the CToken contract.
        const hasApprovedEnough = await checkHasApprovedEnough({
          fuse,
          token,
          userAddress: address,
          approveForAddress: cToken.options.address,
          approvedForAmount: lendAmount,
        });

        // If token isnt approved for this CToken yet, approve it for MAX_APPROVAL_AMOUNT
        if (!hasApprovedEnough) {
          setUserAction(AmountSelectUserAction.WAITING_FOR_LEND_APPROVAL);

          await token.methods
            .approve(cToken.options.address, MAX_APPROVAL_AMOUNT)
            .send({ from: address });
        }
      }

      // By default, we enable the asset as collateral.
      const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);

      // If we've already supplied this as collateral before, then we don't need to submit a new tx for this
      if (!asset.membership) {
        setUserAction(AmountSelectUserAction.WAITING_FOR_ENTER_MARKETS);
        // Don't await this, we don't care if it gets executed first!
        comptroller.methods
          .enterMarkets([asset.cToken])
          .send({ from: address });
      }

      setUserAction(AmountSelectUserAction.WAITING_FOR_LEND);

      // We have to handle constructing/sending the mint transaction differently if the asset is ETH or an ERC20.
      if (isETH) {
        const call = cToken.methods.mint(); //


        // If they are supplying their whole balance, we have to subtract an estimate of the gas cost.
        if (
          lendAmount === (await fuse.provider.getBalance(address))
        ) {
          // Get the estimated gas for this call
          const { gasWEI, gasPrice, estimatedGas } = await fetchGasForCall(
            call,
            lendAmount,
            fuse,
            address
          );

          // Send the call with fullAmount - estimatedGas
          await call.send({
            from: address,
            value: lendAmount.sub(gasWEI),
            gasPrice,
            gas: estimatedGas,
          });
        } else {
          // Supplying a custom amount of ETH
          await call.send({
            from: address,
            value: lendAmount,
          });
        }
      } else {
        //  Supplying ERC20
        await testForCTokenErrorAndSend(
          cToken.callStatic.mint,
          lendAmount,
          cToken.mint,
          "Cannot deposit this amount right now!"
        );
      }
    }

    // If we specified a borrow
    if (!borrowAmount?.isZero() && borrowedAsset) {
      const borrowedCToken = createCTokenContract({
        asset: borrowedAsset,
        fuse,
      });

      setUserAction(AmountSelectUserAction.WAITING_FOR_BORROW);

      // Then initiate the borrow tx.
      await testForCTokenErrorAndSend(
        borrowedCToken.callStatic.borrow,
        borrowAmount,
        borrowedCToken.borrow,
        "Cannot borrow this amount right now!"
      );
    }

    setUserAction(AmountSelectUserAction.NO_ACTION);
  } catch (e) {
    toast && handleGenericError(e, toast);
    setUserAction(AmountSelectUserAction.NO_ACTION);
  }
};

// Sends a TX to enable an asset as collateral ("Enter Markets")
export const enableAssetAsCollateral = ({
  comptrollerAddress,
  fuse,
  asset,
  address,
}: {
  comptrollerAddress: string;
  fuse: Fuse;
  asset: USDPricedFuseAsset;
  address: string;
}) => {};
