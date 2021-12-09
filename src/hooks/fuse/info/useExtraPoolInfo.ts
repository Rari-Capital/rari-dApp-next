import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { createComptroller } from "utils/createComptroller";

// Todo - fix this some reason some `whitelist` dont work
export const useExtraPoolInfo = (comptrollerAddress: string) => {
    const { fuse, address } = useRari();
  
    const { data } = useQuery(comptrollerAddress + " extraPoolInfo", async () => {
      const comptroller = createComptroller(comptrollerAddress, fuse);
  
      const whitelist: any[] = [];
  
      const { 0: admin, 1: upgradeable } =
        await fuse.contracts.FusePoolLensSecondary.getPoolOwnership(
          comptrollerAddress,
        );
  
      const oracle = await fuse.getPriceOracle(
        await comptroller.callStatic.oracle()
      );
  
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
  