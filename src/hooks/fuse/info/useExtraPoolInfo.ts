import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { createComptroller, createOracle } from "utils/createComptroller";

// Todo - fix this some reason some `whitelist` dont work
export const useExtraPoolInfo = (comptrollerAddress: string) => {
  const { fuse, address } = useRari();

  const { data } = useQuery(comptrollerAddress + " extraPoolInfo", async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const whitelist: any[] = [];

    const { 0: admin, 1: upgradeable } =
      await fuse.contracts.FusePoolLensSecondary.callStatic.getPoolOwnership(
        comptrollerAddress
      );

    const oracle = await fuse.getPriceOracle(
      await comptroller.callStatic.oracle()
    );

    console.log("useExtraPoolInfo", { oracle });

    const closeFactor = await comptroller.callStatic.closeFactorMantissa();
    const liquidationIncentive =
      await comptroller.callStatic.liquidationIncentiveMantissa();

    const enforceWhitelist = await comptroller.callStatic.enforceWhitelist();

    // const whitelist = await comptroller.callStatic.getWhitelist({
    //   gasLimit: constants.WeiPerEther,
    // });

    const obj = {
      admin,
      upgradeable,
      enforceWhitelist,
      whitelist,
      isPowerfulAdmin:
        admin.toLowerCase() === address.toLowerCase() && upgradeable,
      oracle,
      closeFactor,
      liquidationIncentive,
    };

    return obj;
  });

  return data;
};

export const useExtraPoolInfo2 = (
  comptrollerAddress: string,
  oracleAddress: string
) => {
  const { fuse, address } = useRari();

  const { data } = useQuery(comptrollerAddress + " extraPoolInfo", async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const poolOracle = createOracle(oracleAddress, fuse, "MasterPriceOracle");

    let defaultOracle = undefined;
    try {
      defaultOracle = await poolOracle.methods.defaultOracle().call();
    } catch (err) {
      console.error("Error querying for defaultOracle");
    }

    const [
      { 0: admin, 1: upgradeable },
      closeFactor,
      liquidationIncentive,
      enforceWhitelist,
      whitelist,
      adminHasRights,
      pendingAdmin,
    ] = await Promise.all([
      fuse.contracts.FusePoolLensSecondary.callStatic.getPoolOwnership(
        comptrollerAddress
      ),

      comptroller.callStatic.closeFactorMantissa(),

      comptroller.callStatic.liquidationIncentiveMantissa(),

      (() => {
        try {
          return comptroller.methods.enforceWhitelist().call();
        } catch (e) {
          return false;
        }
      })(),

      (() => {
        try {
          return comptroller.methods.getWhitelist().call();
        } catch (_) {
          return [];
        }
      })(),

      comptroller.methods.adminHasRights().call(),
      comptroller.methods.pendingAdmin().call(),
    ]);

    return {
      admin,
      upgradeable,
      enforceWhitelist,
      whitelist: whitelist as string[],
      isPowerfulAdmin:
        admin.toLowerCase() === address.toLowerCase() && upgradeable,
      closeFactor,
      liquidationIncentive,
      adminHasRights,
      pendingAdmin,
      defaultOracle,
    };
  });

  return data;
};
