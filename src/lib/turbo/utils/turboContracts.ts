import { Contract } from "ethers";

// ABIS
import TurboRouter from "lib/turbo/abi/TurboRouter.json";
import TurboMaster from "lib/turbo/abi/TurboMaster.json";
import ERC20 from "lib/turbo/abi/ERC20.json"
import CERC20 from "lib/turbo/abi/CERC20.json"
import CERC20Delegate from "lib/turbo/abi/CERC20Delegate.json"
import FuseERC4626 from "lib/turbo/abi/FuseERC4626.json"
import TurboComptroller from "lib/turbo/abi/comptroller.json";
import TurboLens from "lib/turbo/abi/TurboLens.json";
import TurboBooster from "lib/turbo/abi/TurboBooster.json";
import TurboSafe from "lib/turbo/abi/TurboSafe.json";
import TurboAuthority from "lib/turbo/abi/Authority.json";
import FusePoolLensSecondary from "esm/Fuse/contracts/abi/FusePoolLensSecondary.json";

// Utils
import { Interface } from "ethers/lib/utils";
import { TurboAddresses } from "../utils/constants";
import { providers } from "ethers";


//** Contracts **/
export const createTurboRouter = async (provider: providers.JsonRpcProvider, id: number) => {
  const turboRouterContract = new Contract(
    TurboAddresses[id].ROUTER,
    TurboRouter.abi,
    provider
  );
  return turboRouterContract;
};


export const createTurboMaster = async (provider: providers.JsonRpcProvider, id: number) => {
  const turboMasterContract = new Contract(
    TurboAddresses[id].MASTER,
    TurboMaster.abi,
    provider
  );

  return turboMasterContract;
};

export const createTurboComptroller = (
  provider: providers.JsonRpcProvider,
  id: number
) => {
  const turboRouterContract = new Contract(
    TurboAddresses[id].COMPTROLLER,
    TurboComptroller,
    provider
  );

  return turboRouterContract;
};

export const createTurboLens = (provider: providers.Provider, chainID: number) => {
  const turboLens = new Contract(
    TurboAddresses[chainID].LENS,
    TurboLens.abi,
    provider
  );

  return turboLens;
};

export const createTurboBooster = async (
  provider: providers.Provider,
  chainID: number
) => {
  const turboBoosterContract = new Contract(
    TurboAddresses[chainID].BOOSTER,
    TurboBooster.abi,
    provider
  );

  return turboBoosterContract;
};

export const createTurboSafe = (
  provider: providers.Provider,
  turboSafe: string
) => {
  const turboSafeContract = new Contract(turboSafe, TurboSafe.abi, provider);
  return turboSafeContract;
};

export const createTurboAuthority = async (
  provider: providers.BaseProvider,
  authorityAddress: string
) => {

  const turboAuthorityContract = new Contract(
    authorityAddress,
    TurboAuthority.abi,
    provider
  );

  return turboAuthorityContract;
};

/* Token Contracts */

export const createERC20 = async (token: string, provider: providers.JsonRpcProvider) => {
  const erc20Contract = new Contract(token, ERC20.abi, provider);

  return erc20Contract;
};

export const createCERC20 = async (provider: providers.JsonRpcProvider, tokenAddress: string) => {
  const CERC20Contract = new Contract(
    tokenAddress,
    CERC20.abi,
    provider
  )

  return CERC20Contract
}

export const createFuseERC4626 = (provider: providers.JsonRpcProvider, strategyAddress: string) => {
  const FuseERC4626Contract = new Contract(
    strategyAddress,
    FuseERC4626,
    provider
  )

  return FuseERC4626Contract
}

/** Lens **/

export const createFusePoolLensSecondary = (provider: providers.JsonRpcProvider) => {
  const fusePoolLensSecondary = new Contract(
    "0xc76190E04012f26A364228Cfc41690429C44165d",
    FusePoolLensSecondary,
    provider
  )
  return fusePoolLensSecondary
}

/** Interfaces **/

// Turbo Ifaces
export const ITurboRouter = new Interface(TurboRouter.abi);
export const ITurboMaster = new Interface(TurboMaster.abi);
export const ITurboComptroller = new Interface(TurboComptroller);
export const ITurboSafe = new Interface(TurboSafe.abi);
export const ITurboBooster = new Interface(TurboBooster.abi);
export const ITurboLens = new Interface(TurboLens.abi);
export const ITurboAuthority = new Interface(TurboAuthority.abi);

// Etc Ifaces
export const IERC20 = new Interface(ERC20.abi);
export const ICERC20 = new Interface(CERC20.abi);
export const ICERC20Delegate = new Interface(CERC20Delegate);
export const IFuseERC4626 = new Interface(FuseERC4626);