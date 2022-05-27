var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Ethers
import { BigNumber, Contract, utils, ContractFactory, constants, } from "ethers";
import FUSE_ADDRESSES from "./addresses/index";
// ABIs
import fusePoolDirectoryAbi from "./contracts/abi/FusepoolDirectory.json";
import fusePoolLensAbi from "./contracts/abi/FusePoolLens.json";
import fuseSafeLiquidatorAbi from "./contracts/abi/FuseSafeLiquidator.json";
import fuseFeeDistributorAbi from "./contracts/abi/FuseFeeDistributor.json";
import fusePoolLensSecondaryAbi from "./contracts/abi/FusePoolLensSecondary.json";
// Contracts
import Compound from "./contracts/compound-protocol.min.json";
import Oracle from "./contracts/oracles.min.json";
// InterestRate Models
import JumpRateModel from "./irm/JumpRateModel";
import JumpRateModelV2 from "./irm/JumpRateModelV2";
import DAIInterestRateModelV2 from "./irm/DAIInterestRateModelV2";
import WhitePaperInterestRateModel from "./irm/WhitePaperInterestRateModel";
import uniswapV3PoolAbiSlim from "./contracts/abi/UniswapV3Pool.slim.json";
// Types
import { Interface } from "@ethersproject/abi";
import { isSupportedChainId } from "../utils/networks";
import { FusePoolDirectory__factory, InitializableClones__factory, } from "./contracts/types";
export default class Fuse {
    constructor(web3Provider, chainId) {
        this.provider = web3Provider;
        this.constants = constants;
        // Set the addresses based on ChainId
        if (!isSupportedChainId(chainId)) {
            throw new Error(`unsupported chainid: ${chainId}`);
        }
        this.addresses = FUSE_ADDRESSES[chainId];
        this.compoundContracts = Compound.contracts;
        this.oracleContracts = Oracle.contracts;
        this.contracts = {
            FusePoolDirectory: new Contract(this.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryAbi, this.provider),
            FusePoolLens: new Contract(this.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS, fusePoolLensAbi, this.provider),
            FusePoolLensSecondary: new Contract(this.addresses.FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS, fusePoolLensSecondaryAbi, this.provider),
            FuseSafeLiquidator: new Contract(this.addresses.FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS, fuseSafeLiquidatorAbi, this.provider),
            FuseFeeDistributor: new Contract(this.addresses.FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS, fuseFeeDistributorAbi, this.provider),
        };
        this.deployPool = function (poolName, enforceWhitelist, closeFactor, liquidationIncentive, priceOracle, // Contract address OR name of Price Oracle in
        priceOracleConf, options, // We might need to add sender as argument. Getting address from options will colide with the override arguments in ethers contract method calls. It doesnt take address.
        whitelist // An array of whitelisted addresses
        ) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("0: Inside deployPool");
                // 1. Deploy new price oracle via SDK if requested
                // Here, if you pass in a STRING for `priceOracle` it will search for it in Fuse.ORACLES and deploy that oracle from scratch using the priceOracleConf you pass in.
                // Most likely though, you will pass in an ADDRESS for `priceOracle` because the UI already deploys a priceOracle before you deploy a pool.
                // In the case that `priceOracle` is an ADDRESS, YOU WILL SKIP THIS STEP and go straight into pool deployment using the priceOracle address.
                let priceOracleAddress = priceOracle;
                if (this.addresses.DEPLOYABLE_ORACLES.indexOf(priceOracle) >= 0) {
                    try {
                        priceOracleAddress = (yield this.deployPriceOracle(priceOracle, priceOracleConf, options)).address; // TODO: anchorMantissa / anchorPeriod
                    }
                    catch (error) {
                        throw Error("Deployment of price oracle failed: " +
                            (error.message ? error.message : error));
                    }
                }
                console.log("1: Inside deployPool");
                // 2. Deploy Comptroller implementation if necessary
                // Todo - Only works in dev mode. Production will always be deployed
                let comptrollerImplementationAddress = this.addresses.COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS;
                if (!comptrollerImplementationAddress) {
                    const comptrollerContract = new ContractFactory(JSON.parse(this.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi), this.contracts["contracts/Comptroller.sol:Comptroller"].bin, this.provider.getSigner());
                    const deployedComptroller = yield comptrollerContract.deploy(Object.assign({}, options));
                    comptrollerImplementationAddress = deployedComptroller.options.address;
                }
                console.log("2: Inside deployPool");
                //3. Register new pool with FusePoolDirectory
                let receipt;
                try {
                    // const contract = this.contracts.FusePoolDirectory.connect(
                    //   this.provider.getSigner()
                    // );
                    let contract = FusePoolDirectory__factory.connect(this.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, this.provider.getSigner());
                    console.log("3: Register new pool", {
                        contract,
                        poolName,
                        comptrollerImplementationAddress,
                        enforceWhitelist,
                        closeFactor,
                        liquidationIncentive,
                        priceOracleAddress,
                        options,
                    });
                    let tx = yield contract.deployPool(poolName, comptrollerImplementationAddress, enforceWhitelist, closeFactor, liquidationIncentive, priceOracleAddress, options);
                    receipt = yield tx.wait(1);
                    // receipt = await contract.deployPool(
                    //   poolName,
                    //   comptrollerImplementationAddress,
                    //   enforceWhitelist,
                    //   closeFactor,
                    //   maxAssets,
                    //   liquidationIncentive,
                    //   priceOracleAddress
                    // );
                }
                catch (error) {
                    throw Error("Deployment and registration of new Fuse pool failed: " +
                        (error.message ? error.message : error));
                }
                console.log("3: Inside deployPool");
                //4. Compute Unitroller address
                const saltsHash = utils.solidityKeccak256(["address", "string", "uint"], [options.from, poolName, receipt.blockNumber]);
                const byteCodeHash = utils.keccak256("0x" + this.compoundContracts["contracts/Unitroller.sol:Unitroller"].bin);
                let poolAddress = utils.getCreate2Address(this.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, saltsHash, byteCodeHash);
                let unitroller = new Contract(poolAddress, JSON.parse(this.compoundContracts["contracts/Unitroller.sol:Unitroller"].abi), this.provider.getSigner());
                // Accept admin status via Unitroller
                try {
                    yield unitroller._acceptAdmin(options);
                }
                catch (error) {
                    throw Error("Accepting admin status failed: " +
                        (error.message ? error.message : error));
                }
                // Whitelist
                if (enforceWhitelist) {
                    let comptroller = new Contract(poolAddress, JSON.parse(this.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi), this.provider.getSigner());
                    // Already enforced so now we just need to add the addresses
                    yield comptroller._setWhitelistStatuses(whitelist, Array(whitelist.length).fill(true));
                }
                return [
                    poolAddress,
                    comptrollerImplementationAddress,
                    priceOracleAddress,
                ];
            });
        };
        this.deployPriceOracle = function (model, // TODO: find a way to use this.ORACLES
        conf, // This conf depends on which oracle model we're deploying
        options) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                console.log(model, conf, options, "inside DeployPrice");
                if (!model)
                    model = "MasterPriceOracle";
                if (!conf)
                    conf = {};
                let deployArgs = [];
                let priceOracleContract;
                let deployedPriceOracle;
                let oracleFactoryContract;
                switch (model) {
                    // Keep MasterPriceOracle
                    case "MasterPriceOracle":
                        console.log("0.) In MasterPriceOracle");
                        // let initializableClones = new Contract(
                        //   this.addresses.INITIALIZABLE_CLONES_CONTRACT_ADDRESS,
                        //   initializableClonesAbi,
                        //   this.provider.getSigner()
                        // );
                        let initializableClones = InitializableClones__factory.connect(this.addresses.INITIALIZABLE_CLONES_CONTRACT_ADDRESS, this.provider.getSigner());
                        console.log("1.) In MasterPriceOracle", { initializableClones });
                        let masterPriceOracle = {
                            interface: new Interface(Oracle.contracts["MasterPriceOracle"].abi),
                        };
                        console.log("2.) In MasterPriceOracle", { masterPriceOracle });
                        // let masterPriceOracle = new MasterPriceOracle__factory(this.provider.getSigner())
                        deployArgs = [
                            conf.underlyings ? conf.underlyings : [],
                            conf.oracles ? conf.oracles : [],
                            conf.defaultOracle
                                ? conf.defaultOracle
                                : "0x0000000000000000000000000000000000000000",
                            conf.admin ? conf.admin : options.from,
                            conf.canAdminOverwrite ? true : false,
                        ];
                        let initializerData = masterPriceOracle.interface.encodeFunctionData("initialize", deployArgs);
                        console.log("3.) In MasterPriceOracle", { initializerData }, this.addresses.MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS);
                        let tx = yield initializableClones.clone(this.addresses.MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS, initializerData);
                        const receipt = yield tx.wait(1);
                        console.log("4: In MasterPriceOracle", { receipt });
                        const deployedAddress = (_c = (_b = (_a = receipt === null || receipt === void 0 ? void 0 : receipt.events) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.args) === null || _c === void 0 ? void 0 : _c.instance;
                        console.log("5: In MasterPriceOracle", { deployedAddress });
                        deployedPriceOracle = deployedAddress;
                        break;
                    // Keep: Univ3 TWAP V2
                    case "UniswapV3TwapPriceOracleV2":
                        // Input validation
                        if (!conf.uniswapV3Factory)
                            conf.uniswapV3Factory = this.addresses.UNISWAP_V3_FACTORY_ADDRESS;
                        if ([500, 3000, 10000].indexOf(parseInt(conf.feeTier)) < 0)
                            throw Error("Invalid fee tier passed to UniswapV3TwapPriceOracleV2 deployment.");
                        // Check for existing oracle
                        oracleFactoryContract = new Contract(this.addresses.UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS, this.oracleContracts.UniswapV3TwapPriceOracleV2Factory.abi, this.provider.getSigner());
                        deployedPriceOracle = yield oracleFactoryContract
                            .oracles(conf.uniswapV3Factory, conf.feeTier, conf.baseToken);
                        // Deploy if oracle does not exist
                        if (deployedPriceOracle == "0x0000000000000000000000000000000000000000") {
                            yield oracleFactoryContract.deploy(conf.uniswapV3Factory, conf.feeTier, conf.baseToken);
                            deployedPriceOracle = yield oracleFactoryContract.oracles(conf.uniswapV3Factory, conf.feeTier, conf.baseToken);
                        }
                        break;
                    // Keep UniV2 Twap V2
                    case "UniswapTwapPriceOracleV2":
                        // Input validation
                        if (!conf.uniswapV2Factory)
                            conf.uniswapV2Factory = this.addresses.UNISWAP_V2_FACTORY_ADDRESS;
                        // Check for existing oracle
                        oracleFactoryContract = new Contract(this.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS, this.oracleContracts.UniswapTwapPriceOracleV2Factory.abi, this.provider.getSigner());
                        deployedPriceOracle = yield oracleFactoryContract.oracles(conf.uniswapV2Factory, conf.baseToken);
                        // Deploy if oracle does not exist
                        if (deployedPriceOracle === "0x0000000000000000000000000000000000000000") {
                            yield oracleFactoryContract.deploy(conf.uniswapV2Factory, conf.baseToken);
                            deployedPriceOracle = yield oracleFactoryContract.oracles(conf.uniswapV2Factory, conf.baseToken);
                        }
                        return deployedPriceOracle;
                    // TODO : Delete all these after the tests gets moved into the contracts repo
                    // ChainlinkPriceOracle
                    case "ChainlinkPriceOracle":
                        deployArgs = [
                            conf.maxSecondsBeforePriceIsStale
                                ? conf.maxSecondsBeforePriceIsStale
                                : 0,
                        ];
                        priceOracleContract = new ContractFactory(this.oracleContracts["ChainlinkPriceOracle"].abi, this.oracleContracts["ChainlinkPriceOracle"].bin, this.provider.getSigner());
                        deployedPriceOracle = yield priceOracleContract.deploy(deployArgs, Object.assign({}, options));
                        break;
                    // UniswapLpTokenPriceOracle
                    case "UniswapLpTokenPriceOracle":
                        deployArgs = [conf.useRootOracle ? true : false];
                        priceOracleContract = new ContractFactory(this.oracleContracts["UniswapLpTokenPriceOracle"].abi, this.oracleContracts["UniswapLpTokenPriceOracle"].bin, this.provider.getSigner());
                        deployedPriceOracle = priceOracleContract.deploy(deployArgs, Object.assign({}, options));
                        break;
                    // UniswapTwapPriceOracle - Uniswap V2 TWAPs
                    case "UniswapTwapPriceOracle":
                        // Input Validation
                        if (!conf.uniswapV2Factory)
                            conf.uniswapV2Factory = this.addresses.UNISWAP_V2_FACTORY_ADDRESS;
                        deployArgs = [
                            this.addresses.UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS,
                            conf.uniswapV2Factory,
                        ]; // Default to official Uniswap V2 factory
                        // Deploy Oracle
                        priceOracleContract = new ContractFactory(this.oracleContracts["UniswapTwapPriceOracle"].abi, this.oracleContracts["UniswapTwapPriceOracle"].bin, this.provider.getSigner());
                        deployedPriceOracle = yield priceOracleContract.deploy(deployArgs, {
                            options,
                        });
                        break;
                    // Uniswap V2 TWAPs
                    case "UniswapTwapPriceOracleV2":
                        // Input validation
                        if (!conf.uniswapV2Factory)
                            conf.uniswapV2Factory = this.addresses.UNISWAP_V2_FACTORY_ADDRESS;
                        // Check for existing oracle
                        oracleFactoryContract = new Contract(this.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS, this.oracleContracts.UniswapTwapPriceOracleV2Factory.abi, this.provider.getSigner());
                        deployedPriceOracle = yield oracleFactoryContract.oracles(conf.uniswapV2Factory, conf.baseToken);
                        // Deploy if oracle does not exist
                        if (deployedPriceOracle === "0x0000000000000000000000000000000000000000") {
                            yield oracleFactoryContract.deploy(conf.uniswapV2Factory, conf.baseToken);
                            deployedPriceOracle = yield oracleFactoryContract.oracles(conf.uniswapV2Factory, conf.baseToken);
                        }
                        break;
                    case "ChainlinkPriceOracleV2":
                        priceOracleContract = new ContractFactory(this.oracleContracts["ChainlinkPriceOracleV2"].abi, this.oracleContracts["ChainlinkPriceOracleV2"].bin, this.provider.getSigner());
                        deployArgs = [
                            conf.admin ? conf.admin : options.from,
                            conf.canAdminOverwrite ? true : false,
                        ];
                        deployedPriceOracle = yield priceOracleContract.deploy(deployArgs, Object.assign({}, options));
                        break;
                    case "UniswapV3TwapPriceOracle":
                        // Input validation
                        if (!conf.uniswapV3Factory)
                            conf.uniswapV3Factory = this.addresses.UNISWAP_V3_FACTORY_ADDRESS;
                        if ([500, 3000, 10000].indexOf(parseInt(conf.feeTier)) < 0)
                            throw Error("Invalid fee tier passed to UniswapV3TwapPriceOracle deployment.");
                        // Deploy oracle
                        deployArgs = [conf.uniswapV3Factory, conf.feeTier]; // Default to official Uniswap V3 factory
                        priceOracleContract = new ContractFactory(this.oracleContracts["UniswapV3TwapPriceOracle"].abi, this.oracleContracts["UniswapV3TwapPriceOracle"].bin, this.provider.getSigner());
                        deployedPriceOracle = yield priceOracleContract.deploy(deployArgs, Object.assign({}, options));
                        break;
                    case "FixedTokenPriceOracle":
                        priceOracleContract = new ContractFactory(this.oracleContracts["FixedTokenPriceOracle"].abi, this.oracleContracts["FixedTokenPriceOracle"].bin, this.provider.getSigner());
                        deployArgs = [conf.baseToken];
                        deployedPriceOracle = yield priceOracleContract.deploy(deployArgs, Object.assign({}, options));
                        break;
                    // Delete
                    case "SimplePriceOracle":
                        priceOracleContract = new ContractFactory(JSON.parse(this.contracts["contracts/SimplePriceOracle.sol:SimplePriceOracle"].abi), this.contracts["contracts/SimplePriceOracle.sol:SimplePriceOracle"].bin, this.provider.getSigner());
                        deployedPriceOracle = yield priceOracleContract.deploy(Object.assign({}, options));
                        break;
                    default:
                        priceOracleContract = new ContractFactory(this.oracleContracts[model].abi, this.oracleContracts[model].bin, this.provider.getSigner());
                        deployedPriceOracle = yield priceOracleContract.deploy(Object.assign({}, options));
                        break;
                }
                return deployedPriceOracle;
            });
        };
        this.deployComptroller = function (closeFactor, maxAssets, liquidationIncentive, priceOracle, // Contract address
        implementationAddress, // Address of comptroller if its already deployed
        options) {
            return __awaiter(this, void 0, void 0, function* () {
                let deployedComptroller;
                // 1. Deploy comptroller if necessary
                if (!implementationAddress) {
                    const comptrollerContract = new Contract(JSON.parse(this.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi), this.compoundContracts["contracts/Comptroller.sol:Comptroller"].bin, this.provider.getSigner());
                    deployedComptroller = yield comptrollerContract.deploy(...options);
                    implementationAddress = deployedComptroller.options.address;
                }
                // 2. Get Unitroller to set the comptroller implementation address for the pool
                const unitrollerContract = new ContractFactory(JSON.parse(this.compoundContracts["contracts/Unitroller.sol:Unitroller"].abi), this.compoundContracts["contracts/Unitroller.sol:Unitroller"].bin, this.provider.getSigner());
                const deployedUnitroller = yield unitrollerContract.deploy(Object.assign({}, options));
                yield deployedUnitroller._setPendingImplementation(deployedComptroller.options.address, Object.assign({}, options));
                // Comptroller becomes unitroller.
                yield deployedComptroller._become(deployedUnitroller.address, Object.assign({}, options));
                deployedComptroller.address = deployedUnitroller.address;
                // Set comptroller configuration
                if (closeFactor)
                    yield deployedComptroller._setCloseFactor(closeFactor, Object.assign({}, options));
                if (maxAssets)
                    yield deployedComptroller._setMaxAssets(maxAssets, Object.assign({}, options));
                if (liquidationIncentive)
                    yield deployedComptroller.methods._setLiquidationIncentive(liquidationIncentive, Object.assign({}, options));
                if (priceOracle)
                    yield deployedComptroller._setPriceOracle(priceOracle, Object.assign({}, options));
                return [deployedUnitroller.options.address, implementationAddress];
            });
        };
        this.deployAsset = function (conf, collateralFactor, reserveFactor, // Amount of accrue interest that will go to the pool's reserves. Usually 0.1
        adminFee, options, bypassPriceFeedCheck // ?
        ) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Inside this.deployAsset", {
                    conf,
                    collateralFactor,
                    reserveFactor,
                    adminFee,
                    options,
                    bypassPriceFeedCheck,
                });
                // Deploy new interest rate model via SDK if requested
                if ([
                    "WhitePaperInterestRateModel",
                    "JumpRateModel",
                    "JumpRateModelV2",
                    "ReactiveJumpRateModelV2",
                    "DAIInterestRateModelV2",
                ].indexOf(conf.interestRateModel) >= 0) {
                    try {
                        conf.interestRateModel = yield this.deployInterestRateModel(conf.interestRateModel, conf.interestRateModelConf, options); // TODO: anchorMantissa
                    }
                    catch (error) {
                        throw Error("Deployment of interest rate model failed: " +
                            (error.message ? error.message : error));
                    }
                }
                // Deploy new asset to existing pool via SDK
                try {
                    var [assetAddress, implementationAddress, receipt] = yield this.deployCToken(conf, collateralFactor, reserveFactor, adminFee, options, bypassPriceFeedCheck);
                }
                catch (error) {
                    throw Error("Deployment of asset to Fuse pool failed: " +
                        (error.message ? error.message : error));
                }
                return [
                    assetAddress,
                    implementationAddress,
                    conf.interestRateModel,
                    receipt,
                ];
            });
        };
        this.deployInterestRateModel = function (model, conf, options) {
            return __awaiter(this, void 0, void 0, function* () {
                // Default model = JumpRateModel
                if (!model) {
                    model = "JumpRateModel";
                }
                // Get deployArgs
                let deployArgs = [];
                switch (model) {
                    case "JumpRateModel":
                        if (!conf)
                            conf = {
                                baseRatePerYear: "20000000000000000",
                                multiplierPerYear: "200000000000000000",
                                jumpMultiplierPerYear: "2000000000000000000",
                                kink: "900000000000000000",
                            };
                        deployArgs = [
                            conf.baseRatePerYear,
                            conf.multiplierPerYear,
                            conf.jumpMultiplierPerYear,
                            conf.kink,
                        ];
                        break;
                    case "DAIInterestRateModelV2":
                        if (!conf)
                            conf = {
                                jumpMultiplierPerYear: "2000000000000000000",
                                kink: "900000000000000000",
                            };
                        deployArgs = [
                            conf.jumpMultiplierPerYear,
                            conf.kink,
                            this.addresses.DAI_POT,
                            this.addresses.DAI_JUG,
                        ];
                        break;
                    case "WhitePaperInterestRateModel":
                        if (!conf)
                            conf = {
                                baseRatePerYear: "20000000000000000",
                                multiplierPerYear: "200000000000000000",
                            };
                        deployArgs = [conf.baseRatePerYear, conf.multiplierPerYear];
                        break;
                }
                // Deploy InterestRateModel
                const interestRateModelContract = new ContractFactory(JSON.parse(this.compoundContracts["contracts/" + model + ".sol:" + model].abi), this.compoundContracts["contracts/" + model + ".sol:" + model].bin, this.provider.getSigner());
                const deployedInterestRateModel = yield interestRateModelContract.deploy(deployArgs, Object.assign({}, options));
                return deployedInterestRateModel.options.address;
            });
        };
        this.deployCToken = function (conf, collateralFactor, reserveFactor, adminFee, options, bypassPriceFeedCheck) {
            return __awaiter(this, void 0, void 0, function* () {
                // BigNumbers
                // TOdo - pass these in as BN by default
                const reserveFactorBN = BigNumber.from(reserveFactor);
                const adminFeeBN = BigNumber.from(adminFee);
                const collateralFactorBN = BigNumber.from(collateralFactor); // TODO: find out if this is a number or string. If its a number, parseUnits will not work. Also parse Units works if number is between 0 - 0.9
                console.log("1: Inside this.deployCToken", {
                    reserveFactorBN,
                    adminFeeBN,
                    collateralFactorBN,
                });
                // Check collateral factor
                if (collateralFactorBN.lt(constants.Zero) ||
                    collateralFactorBN.gt(utils.parseEther("0.9")))
                    throw Error("Collateral factor must range from 0 to 0.9.");
                // Check reserve factor + admin fee + Fuse fee
                if (!reserveFactorBN.gte(constants.Zero))
                    throw Error("Reserve factor cannot be negative.");
                if (!adminFeeBN.gte(constants.Zero))
                    throw Error("Admin fee cannot be negative.");
                // If reserveFactor or adminFee is greater than zero, we get fuse fee.
                // Sum of reserveFactor and adminFee should not be greater than fuse fee. ? i think
                if (reserveFactorBN.gt(constants.Zero) || adminFeeBN.gt(constants.Zero)) {
                    const fuseFee = yield this.contracts.FuseFeeDistributor.callStatic.interestFeeRate();
                    if (reserveFactorBN
                        .add(adminFeeBN)
                        .add(BigNumber.from(fuseFee))
                        .gt(constants.WeiPerEther))
                        throw Error("Sum of reserve factor and admin fee should range from 0 to " +
                            (1 - parseInt(fuseFee) / 1e18) +
                            ".");
                }
                return conf.underlying !== undefined &&
                    conf.underlying !== null &&
                    conf.underlying.length > 0 &&
                    !BigNumber.from(conf.underlying).isZero()
                    ? yield this.deployCErc20(conf, collateralFactor, reserveFactor, adminFee, options, bypassPriceFeedCheck, this.addresses.CERC20_DELEGATE_CONTRACT_ADDRESS
                        ? this.addresses.CERC20_DELEGATE_CONTRACT_ADDRESS
                        : undefined)
                    : yield this.deployCEther(conf, collateralFactor, reserveFactor, adminFee, this.addresses.CETHER_DELEGATE_CONTRACT_ADDRESS
                        ? this.addresses.CETHER_DELEGATE_CONTRACT_ADDRESS
                        : null, options);
            });
        };
        this.deployCEther = function (conf, collateralFactor, reserveFactor, adminFee, implementationAddress, options) {
            return __awaiter(this, void 0, void 0, function* () {
                // Deploy CEtherDelegate implementation contract if necessary
                if (!implementationAddress) {
                    const cEtherDelegateFactory = new ContractFactory(JSON.parse(this.compoundContracts["contracts/CEtherDelegate.sol:CEtherDelegate"].abi), this.compoundContracts["contracts/CEtherDelegate.sol:CEtherDelegate"].bin, this.provider.getSigner());
                    const cEtherDelegateDeployed = yield cEtherDelegateFactory.deploy();
                    implementationAddress = cEtherDelegateDeployed.address;
                }
                // Deploy CEtherDelegator proxy contract
                const deployArgs = [
                    conf.comptroller,
                    conf.interestRateModel,
                    conf.name,
                    conf.symbol,
                    implementationAddress,
                    "0x00",
                    reserveFactor ? reserveFactor.toString() : 0,
                    adminFee ? adminFee.toString() : 0,
                ];
                console.log("1. deployCEther", { deployArgs });
                const abiCoder = new utils.AbiCoder();
                const constructorData = abiCoder.encode([
                    "address",
                    "address",
                    "string",
                    "string",
                    "address",
                    "bytes",
                    "uint256",
                    "uint256",
                ], deployArgs);
                console.log("2. deployCEther", { constructorData });
                const comptroller = new Contract(conf.comptroller, JSON.parse(this.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi), this.provider.getSigner());
                console.log("3. deployCEther", { comptroller });
                try {
                    const errorCode = yield comptroller.callStatic._deployMarket(true, constructorData, collateralFactor);
                    if (errorCode != constants.Zero)
                        throw ("Failed to deploy market with error code: " +
                            Fuse.COMPTROLLER_ERROR_CODES[errorCode]);
                }
                catch (err) {
                    console.error(err);
                }
                console.log("4. deployCEther", { constructorData, collateralFactor });
                const receipt = yield comptroller._deployMarket(true, constructorData, collateralFactor);
                console.log("5. receipt");
                const saltsHash = utils.solidityKeccak256(["address", "address", "uint"], [
                    conf.comptroller,
                    "0x0000000000000000000000000000000000000000",
                    receipt.blockNumber,
                ]);
                const byteCodeHash = utils.keccak256("0x" +
                    this.compoundContracts["contracts/CEtherDelegator.sol:CEtherDelegator"].bin);
                const cEtherDelegatorAddress = utils.getCreate2Address(this.addresses.FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS, saltsHash, byteCodeHash);
                // Return cToken proxy and implementation contract addresses
                return [cEtherDelegatorAddress, implementationAddress, receipt];
            });
        };
        this.deployCErc20 = function (conf, collateralFactor, reserveFactor, adminFee, options, bypassPriceFeedCheck, implementationAddress // cERC20Delegate implementation
        ) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("1: Inside deployCerc20:", {
                    conf,
                    collateralFactor,
                    reserveFactor,
                    adminFee,
                    options,
                    bypassPriceFeedCheck,
                    implementationAddress,
                });
                // Get Comptroller
                let comptroller = new Contract(conf.comptroller, JSON.parse(this.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi), this.provider.getSigner());
                console.log("2: Inside deployCerc20:", {
                    comptroller,
                });
                // Check for price feed assuming !bypassPriceFeedCheck
                // if (!bypassPriceFeedCheck)
                //   await this.checkForCErc20PriceFeed(comptroller, conf);
                // Deploy CErc20Delegate implementation contract if necessary
                if (!implementationAddress) {
                    console.log("3: inside this.deployCERC20", {
                        implementationAddress,
                        conf,
                    });
                    if (!conf.delegateContractName) {
                        conf.delegateContractName = "CErc20Delegate";
                    }
                    const cErc20Delegate = new ContractFactory(JSON.parse(this.compoundContracts["contracts/" +
                        conf.delegateContractName +
                        ".sol:" +
                        conf.delegateContractName].abi), this.compoundContracts["contracts/" +
                        conf.delegateContractName +
                        ".sol:" +
                        conf.delegateContractName].bin, this.provider.getSigner());
                    console.log("3.1: inside this.deployCERC20", {
                        cErc20Delegate,
                    });
                    const cErc20DelegateDeployed = yield cErc20Delegate.deploy();
                    console.log("3.2: inside this.deployCERC20", {
                        cErc20DelegateDeployed,
                    });
                    implementationAddress = cErc20DelegateDeployed.address;
                }
                console.log("4: inside this.deployCERC20");
                let deployArgs = [
                    conf.underlying,
                    conf.comptroller,
                    conf.interestRateModel,
                    conf.name,
                    conf.symbol,
                    implementationAddress,
                    "0x00",
                    reserveFactor ? reserveFactor.toString() : 0,
                    adminFee ? adminFee.toString() : 0,
                ];
                console.log("5: inside this.deployCERC20", { deployArgs });
                const constructorData = new utils.AbiCoder().encode([
                    "address",
                    "address",
                    "address",
                    "string",
                    "string",
                    "address",
                    "bytes",
                    "uint256",
                    "uint256",
                ], deployArgs);
                console.log("6: Inside deployCErc20", {
                    constructorData,
                    deployArgs,
                    comptroller,
                    collateralFactor,
                });
                // try {
                //   let args = [false, constructorData, collateralFactor];
                //   // abiEncoded = ethers.j;
                //   const populatedTX = await comptroller.populateTransaction._deployMarket(
                //     false,
                //     constructorData,
                //     collateralFactor
                //   );
                //   console.log("7: Inside deployCErc20", { populatedTX, args });
                //   const errorCode = await comptroller.callStatic._deployMarket(
                //     false,
                //     constructorData,
                //     collateralFactor
                //   );
                //   console.log("7: Inside deployCErc20", { errorCode });
                //   if (errorCode.toString() !== "0")
                //     throw (
                //       "Failed to deploy market with error code: " +
                //       Fuse.COMPTROLLER_ERROR_CODES[errorCode]
                //     );
                // } catch (err: any) {
                //   console.log({ err });
                //   throw "deployCERC20: staticCallFailed on deployMarket: " + err?.message;
                // }
                const tx = yield comptroller._deployMarket(false, constructorData, collateralFactor);
                const receipt = yield tx.wait(1);
                console.log("8: Inside deployCErc20", { receipt });
                const saltsHash = utils.solidityKeccak256(["address", "address", "uint"], [conf.comptroller, conf.underlying, receipt.blockNumber]);
                const byteCodeHash = utils.keccak256("0x" +
                    this.compoundContracts["contracts/Unitroller.sol:Unitroller"].bin +
                    constructorData.substring(2));
                console.log("9: Inside deployCErc20", { saltsHash, byteCodeHash });
                const cErc20DelegatorAddress = utils.getCreate2Address(this.addresses.FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS, saltsHash, byteCodeHash);
                console.log("10: Inside deployCErc20", { cErc20DelegatorAddress });
                // Return cToken proxy and implementation contract addresses
                return [cErc20DelegatorAddress, implementationAddress, receipt];
            });
        };
        this.identifyPriceOracle = function (priceOracleAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                // Get PriceOracle type from runtime bytecode hash
                const runtimeBytecodeHash = utils.keccak256(yield this.provider.getCode(priceOracleAddress));
                for (const oracleContractName of Object.keys(this.addresses.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES)) {
                    const valueOrArr = this.addresses.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES[oracleContractName];
                    if (Array.isArray(valueOrArr)) {
                        for (const potentialHash of valueOrArr)
                            if (runtimeBytecodeHash == potentialHash)
                                return oracleContractName;
                    }
                    else {
                        if (runtimeBytecodeHash == valueOrArr)
                            return oracleContractName;
                    }
                }
                return null;
            });
        };
        this.identifyInterestRateModel = function (interestRateModelAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                // Get interest rate model type from runtime bytecode hash and init class
                const interestRateModels = {
                    JumpRateModel: JumpRateModel,
                    JumpRateModelV2: JumpRateModelV2,
                    DAIInterestRateModelV2: DAIInterestRateModelV2,
                    WhitePaperInterestRateModel: WhitePaperInterestRateModel,
                };
                const runtimeBytecodeHash = utils.keccak256(yield this.provider.getCode(interestRateModelAddress));
                // Find ONE interes ratemodel and return thath
                // compare runtimeByrecodeHash with
                //
                let irm;
                outerLoop: for (const model of Object.keys(interestRateModels)) {
                    if (interestRateModels[model].RUNTIME_BYTECODE_HASHES !== undefined) {
                        for (const hash of interestRateModels[model]
                            .RUNTIME_BYTECODE_HASHES) {
                            if (runtimeBytecodeHash === hash) {
                                irm = new interestRateModels[model]();
                                console.log(irm);
                                break outerLoop;
                            }
                        }
                    }
                    else if (runtimeBytecodeHash ===
                        interestRateModels[model].RUNTIME_BYTECODE_HASH) {
                        irm = new interestRateModels[model]();
                        break;
                    }
                }
                console.log(irm, "WHY");
                return irm;
            });
        };
        this.getInterestRateModel = function (assetAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                // Get interest rate model address from asset address
                const assetContract = new Contract(assetAddress, JSON.parse(this.compoundContracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi), this.provider);
                const interestRateModelAddress = yield assetContract.callStatic.interestRateModel();
                const interestRateModel = yield this.identifyInterestRateModel(interestRateModelAddress);
                yield interestRateModel.init(interestRateModelAddress, assetAddress, this.provider);
                return interestRateModel;
            });
        };
        this.getPriceOracle = function (oracleAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                // Get price oracle contract name from runtime bytecode hash
                const runtimeBytecodeHash = utils.keccak256(yield this.provider.getCode(oracleAddress));
                console.log("this.getPriceOracle()", { runtimeBytecodeHash });
                for (const model of Object.keys(this.addresses.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES)) {
                    if (runtimeBytecodeHash ===
                        this.addresses.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES[model])
                        return model;
                }
                return null;
            });
        };
        this.deployRewardsDistributor = function (rewardToken, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const distributor = new ContractFactory(JSON.parse(this.compoundContracts["contracts/RewardsDistributorDelegator.sol:RewardsDistributorDelegator"].abi), this.compoundContracts["contracts/RewardsDistributorDelegator.sol:RewardsDistributorDelegator"].bin, this.provider.getSigner());
                const deployedDistributor = yield distributor.deploy(options.from, rewardToken, this.addresses.REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS);
                // const rdAddress = distributor.options.address;
                return deployedDistributor;
            });
        };
        this.checkCardinality = function (uniswapV3Pool) {
            return __awaiter(this, void 0, void 0, function* () {
                var uniswapV3PoolContract = new Contract(uniswapV3Pool, uniswapV3PoolAbiSlim, this.provider);
                const shouldPrime = (yield uniswapV3PoolContract.callStatic.slot0())
                    .observationCardinalityNext < 64;
                return shouldPrime;
            });
        };
        this.primeUniswapV3Oracle = function (uniswapV3Pool, options) {
            return __awaiter(this, void 0, void 0, function* () {
                var uniswapV3PoolContract = new Contract(uniswapV3Pool, uniswapV3PoolAbiSlim, this.provider.getSigner());
                yield uniswapV3PoolContract
                    .increaseObservationCardinalityNext(64);
            });
        };
        this.identifyInterestRateModelName = (irmAddress) => {
            let name = "";
            Object.entries(this.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES).forEach(([key, value]) => {
                if (value === irmAddress) {
                    name = key;
                }
            });
            return name;
        };
    }
}
// static ADDRESSES = FUSE_ADDRESSES;
// static FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS =
//   "0x835482FE0532f169024d5E9410199369aAD5C77E";
// static FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS =
//   "0xf0f3a1494ae00b5350535b7777abb2f499fc13d4";
// static FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS =
//   "0xa731585ab05fC9f83555cf9Bff8F58ee94e18F85";
// static FUSE_POOL_LENS_CONTRACT_ADDRESS =
//   "0x6Dc585Ad66A10214Ef0502492B0CC02F0e836eec";
// static FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS =
//   "0xc76190E04012f26A364228Cfc41690429C44165d";
// static COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS =
//   "0xe16db319d9da7ce40b666dd2e365a4b8b3c18217"; // v1.0.0: 0x94b2200d28932679def4a7d08596a229553a994e; v1.0.1 (with _unsupportMarket): 0x8A78A9D35c9C61F9E0Ff526C5d88eC28354543fE
// static CERC20_DELEGATE_CONTRACT_ADDRESS =
//   "0x67db14e73c2dce786b5bbbfa4d010deab4bbfcf9"; // v1.0.0: 0x67e70eeb9dd170f7b4a9ef620720c9069d5e706c; v1.0.2 (for V2 yVaults): 0x2b3dd0ae288c13a730f6c422e2262a9d3da79ed1
// static CETHER_DELEGATE_CONTRACT_ADDRESS =
//   "0xd77e28a1b9a9cfe1fc2eee70e391c05d25853cbf"; // v1.0.0: 0x60884c8faad1b30b1c76100da92b76ed3af849ba
// static REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS =
//   "0x220f93183a69d1598e8405310cb361cff504146f";
// static MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS =
//   "0xb3c8ee7309be658c186f986388c2377da436d8fb";
// static INITIALIZABLE_CLONES_CONTRACT_ADDRESS =
//   "0x91ce5566dc3170898c5aee4ae4dd314654b47415";
// static OPEN_ORACLE_PRICE_DATA_CONTRACT_ADDRESS =
//   "0xc629c26dced4277419cde234012f8160a0278a79"; // UniswapAnchoredView NOT IN USE
// static COINBASE_PRO_REPORTER_ADDRESS =
//   "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"; // UniswapAnchoredView NOT IN USE
// static PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES = {
//   ChainlinkPriceOracle: "0xe102421A85D9C0e71C0Ef1870DaC658EB43E1493",
//   ChainlinkPriceOracleV2: "0xb0602af43Ca042550ca9DA3c33bA3aC375d20Df4",
//   ChainlinkPriceOracleV3: "0x058c345D3240001088b6280e008F9e78b3B2112d",
//   // PreferredPriceOracle: "", // TODO: Set correct mainnet address after deployment
//   // UniswapAnchoredView: "", // NOT IN USE
//   // UniswapView: "", // NOT IN USE
//   // Keep3rPriceOracle_Uniswap: "0xb90de476d438b37a4a143bf729a9b2237e544af6", // NO LONGER IN USE
//   // Keep3rPriceOracle_SushiSwap: "0x08d415f90ccfb971dfbfdd6266f9a7cb1c166fc0", // NO LONGER IN USE
//   // Keep3rV2PriceOracle_Uniswap: "0xd6a8cac634e59c00a3d4163f839d068458e39869", // NO LONGER IN USE
//   UniswapTwapPriceOracle_Uniswap:
//     "0xCd8f1c72Ff98bFE3B307869dDf66f5124D57D3a9",
//   UniswapTwapPriceOracle_SushiSwap:
//     "0xfD4B4552c26CeBC54cD80B1BDABEE2AC3E7eB324",
//   UniswapLpTokenPriceOracle: "0x50f42c004bd9b0e5acc65c33da133fbfbe86c7c0",
//   UniswapV3TwapPriceOracle_Uniswap_3000:
//     "0x80829b8A344741E28ae70374Be02Ec9d4b51CD89",
//   UniswapV3TwapPriceOracle_Uniswap_10000:
//     "0xF8731EB567c4C7693cF497849247668c91C9Ed36",
//   UniswapV3TwapPriceOracleV2_Uniswap_500_USDC:
//     "0x29490a6F5B4A999601378547Fe681d04d877D29b",
//   UniswapV3TwapPriceOracleV2_Uniswap_3000_USDC:
//     "0xf3a36BB3B627A5C8c36BA0714Fe035A401E86B78",
//   UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC:
//     "0x3288a2d5f11FcBefbf77754e073cAD2C10325dE2",
//   // RecursivePriceOracle: "", // TODO: Set correct mainnet address after deployment
//   YVaultV1PriceOracle: "0xb04be6165cf1879310e48f8900ad8c647b9b5c5d", // NOT CURRENTLY IN USE
//   YVaultV2PriceOracle: "0xb669d0319fb9de553e5c206e6fbebd58512b668b",
//   // AlphaHomoraV1PriceOracle: "", // TODO: Set correct mainnet address after deployment
//   // AlphaHomoraV2PriceOracle: "", // TODO: Set correct mainnet address after deployment
//   // SynthetixPriceOracle: "", // TODO: Set correct mainnet address after deployment
//   // BalancerLpTokenPriceOracle: "", // TODO: Set correct mainnet address after deployment
//   MasterPriceOracle: "0x1887118E49e0F4A78Bd71B792a49dE03504A764D",
//   CurveLpTokenPriceOracle: "0x43c534203339bbf15f62b8dde91e7d14195e7a60",
//   CurveLiquidityGaugeV2PriceOracle:
//     "0xd9eefdb09d75ca848433079ea72ef609a1c1ea21",
//   FixedEthPriceOracle: "0xffc9ec4adbf75a537e4d233720f06f0df01fb7f5",
//   FixedEurPriceOracle: "0x817158553F4391B0d53d242fC332f2eF82463e2a",
//   WSTEthPriceOracle: "0xb11de4c003c80dc36a810254b433d727ac71c517",
//   FixedTokenPriceOracle_OHM: "0x71FE48562B816D03Ce9e2bbD5aB28674A8807CC5",
//   UniswapTwapPriceOracleV2_SushiSwap_DAI:
//     "0x72fd4c801f5845ab672a12bce1b05bdba1fd851a", // v1.1.2
//   UniswapTwapPriceOracleV2_SushiSwap_CRV:
//     "0x552163f2a63f82bb47b686ffc665ddb3ceaca0ea", // v1.1.3
//   UniswapTwapPriceOracleV2_SushiSwap_USDC:
//     "0x9ee412a83a52f033d23a0b7e2e030382b3e53208", // v1.1.3
//   UniswapTwapPriceOracleV2_Uniswap_FRAX:
//     "0x6127e381756796fb978bc872556bf790f14cde98", // v1.1.3
//   SushiBarPriceOracle: "0x290E0f31e96e13f9c0DB14fD328a3C2A94557245",
//   BadgerPriceOracle: "0xd0C86943e594640c4598086a2359A0e70b80eF8D",
//   HarvestPriceOracle: "0x8D364609cd2716172016838fF9FBC7fBcAC91792",
//   StakedSdtPriceOracle: "0x5447c825ee330015418c1a0d840c4a1b5a7176cc",
//   TokemakPoolTAssetPriceOracle: "0xd806782b31EC52FcB7f2a009d7D045bB732431Fb",
//   MStablePriceOracle: "0xeb988f5492C86584f8D8f1B8662188D5A9BfE357",
// };
// static UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS =
//   "0xa170dba2cd1f68cdd7567cf70184d5492d2e8138";
// static UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS =
//   "0xf1860b3714f0163838cf9ee3adc287507824ebdb";
// static UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS = ""; // TODO: Set correct mainnet address after deployment
// static UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS =
//   "0x8Eed20f31E7d434648fF51114446b3CfFD1FF9F1"; // TODO: Set correct mainnet address after deployment
// static DAI_POT = "0x197e90f9fad81970ba7976f33cbd77088e5d7cf7"; // DAIInterestRateModelV2 NOT IN USE
// static DAI_JUG = "0x19c0976f590d67707e62397c87829d896dc0f1f1"; // DAIInterestRateModelV2 NOT IN USE
// static UNISWAP_V2_FACTORY_ADDRESS =
//   "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
// static UNISWAP_V2_PAIR_INIT_CODE_HASH =
//   "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
// static SUSHISWAP_FACTORY_ADDRESS =
//   "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac";
// static UNISWAP_V3_FACTORY_ADDRESS =
//   "0x1f98431c8ad98523631ae4a59f267346ea31f984";
// static WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
// static PRICE_ORACLE_RUNTIME_BYTECODE_HASHES = {
//   ChainlinkPriceOracle:
//     "0x7a2a5633a99e8abb759f0b52e87875181704b8e29f6567d4a92f12c3f956d313",
//   ChainlinkPriceOracleV2:
//     "0x8d2bcaa1429031ae2b19a4516e5fdc68fb9346f158efb642fcf9590c09de2175",
//   ChainlinkPriceOracleV3:
//     "0x4b3bef9f57e381dc6b6e32bff270ce8a72d8aae541cb7c686b09555de3526d39",
//   UniswapTwapPriceOracle_Uniswap:
//     "0xa2537dcbd2b55b1a690db3b83fa1042f86b21ec3e1557f918bc3930b6bbb9244",
//   UniswapTwapPriceOracle_SushiSwap:
//     "0x9b11abfe7bfc1dcef0b1bc513959f1172cfe2cb595c5131b9cabc3b6448d89ac",
//   UniswapV3TwapPriceOracle_Uniswap_3000:
//     "0xb300f7f64110b952340e896d33f133482de6715f1b8b7e0acbd2416e0e6593c1",
//   UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC:
//     "0xc301f891f1f905e68d1c5df5202cf0eec2ee8abcf3a510d5bd00d46f7dea01b4",
//   UniswapV3TwapPriceOracleV2:
//     "0xc844372c8856a5f9569721d3aca38c7804bae2ae4e296605e683aa8d1601e538", // v1.2.0
//   YVaultV1PriceOracle:
//     "0xd0dda181a4eb699a966b23edb883cff43377297439822b1b0f99b06af2002cc3",
//   YVaultV2PriceOracle:
//     "0x177c22cc7d05280cea84a36782303d17246783be7b8c0b6f9731bb9002ffcc68",
//   // fuse-contracts@v1.0.0
//   MasterPriceOracleV1:
//     "0xfa1349af05af40ffb5e66605a209dbbdc8355ba7dda76b2be10bafdf5ffd1dc6",
//   // fuse-contracts@v1.2.0
//   MasterPriceOracleV2:
//     "0xdfa5aa37efea3b16d143a12c4ae7006f3e29768b3e375b59842c7ecd3809f1d1",
//   // fuse-contracts@v1.2.1
//   MasterPriceOracleV3:
//     "0xe4199a03b164ca492d19d655b85fdf8cc14cf2da6ddedd236712552b7676b03d",
//   CurveLpTokenPriceOracle:
//     "0x6742ae836b1f7df0cfd9b858c89d89da3ee814c28c5ee9709a371bcf9dfd2145",
//   CurveLiquidityGaugeV2PriceOracle:
//     "0xfcf0d93de474152898668c4ebd963e0237bfc46c3d5f0ce51b7045b60c831734",
//   FixedEthPriceOracle:
//     "0xcb669c93632a1c991adced5f4d97202aa219fab3d5d86ebd28f4f62ad7aa6cb3",
//   FixedEurPriceOracle:
//     "0x678dbe9f2399a44e89edc934dc17f6d4ee7004d9cbcee83c0fa0ef43de924b84",
//   WSTEthPriceOracle:
//     "0x11daa8dfb8957304aa7d926ce6876c523c7567b4052962e65e7d6a324ddcb4cc",
//   FixedTokenPriceOracle_OHM:
//     "0x136d369f53594c2f10e3ff3f14eaaf0bada4a63964f3cfeda3923e3531e407dc",
//   UniswapTwapPriceOracleV2_SushiSwap_DAI:
//     "0xb4d279232ab52a2fcaee6dc47db486a733c24a499ade9d7de1b0d417d4730817",
//   SushiBarPriceOracle:
//     "0x3736e8b6c11fcd413c0b60c3291a3a2e2ebe496a2780f3c45790a123f5ee9705",
// };
// static ORACLES = [
//   "SimplePriceOracle",
//   "PreferredPriceOracle",
//   "ChainlinkPriceOracle",
//   // "Keep3rPriceOracle",
//   "MasterPriceOracle",
//   // "UniswapAnchoredView",
//   // "UniswapView",
//   "UniswapLpTokenPriceOracle",
//   "RecursivePriceOracle",
//   "YVaultV1PriceOracle",
//   "YVaultV2PriceOracle",
//   "AlphaHomoraV1PriceOracle",
//   "SynthetixPriceOracle",
//   "ChainlinkPriceOracleV2",
//   "CurveLpTokenPriceOracle",
//   "CurveLiquidityGaugeV2PriceOracle",
//   "FixedEthPriceOracle",
//   "FixedEurPriceOracle",
//   "FixedTokenPriceOracle",
//   "WSTEthPriceOracle",
//   "UniswapTwapPriceOracle",
//   "UniswapTwapPriceOracleV2",
//   "UniswapV3TwapPriceOracle",
//   "UniswapV3TwapPriceOracleV2",
//   "SushiBarPriceOracle",
// ];
// static PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES = {
//   JumpRateModel_Compound_Stables:
//     "0x640dce7c7c6349e254b20eccfa2bb902b354c317",
//   JumpRateModel_Compound_UNI: "0xc35DB333EF7ce4F246DE9DE11Cc1929d6AA11672",
//   JumpRateModel_Cream_Stables_Majors:
//     "0xb579d2761470bba14018959d6dffcc681c09c04b",
//   JumpRateModel_Cream_Gov_Seeds: "0xcdC0a449E011249482824efFcfA05c883d36CfC7",
//   WhitePaperInterestRateModel_Compound_ETH:
//     "0x14ee0270C80bEd60bDC117d4F218DeE0A4909F28",
//   WhitePaperInterestRateModel_Compound_WBTC:
//     "0x7ecAf96C79c2B263AFe4f486eC9a74F8e563E0a6",
//   JumpRateModel_Fei_FEI: "0x8f47be5692180079931e2f983db6996647aba0a5",
//   JumpRateModel_Fei_TRIBE: "0x075538650a9c69ac8019507a7dd1bd879b12c1d7",
//   JumpRateModel_Fei_ETH: "0xbab47e4b692195bf064923178a90ef999a15f819",
//   JumpRateModel_Fei_DAI: "0xede47399e2aa8f076d40dc52896331cba8bd40f7",
//   JumpRateModel_Olympus_Majors: "0xe1d35fae219e4d74fe11cb4246990784a4fe6680",
//   Custom_JumpRateModel: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   Custom_JumpRateModel1: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
// };
Fuse.COMPTROLLER_ERROR_CODES = [
    "NO_ERROR",
    "UNAUTHORIZED",
    "COMPTROLLER_MISMATCH",
    "INSUFFICIENT_SHORTFALL",
    "INSUFFICIENT_LIQUIDITY",
    "INVALID_CLOSE_FACTOR",
    "INVALID_COLLATERAL_FACTOR",
    "INVALID_LIQUIDATION_INCENTIVE",
    "MARKET_NOT_ENTERED",
    "MARKET_NOT_LISTED",
    "MARKET_ALREADY_LISTED",
    "MATH_ERROR",
    "NONZERO_BORROW_BALANCE",
    "PRICE_ERROR",
    "REJECTION",
    "SNAPSHOT_ERROR",
    "TOO_MANY_ASSETS",
    "TOO_MUCH_REPAY",
    "SUPPLIER_NOT_WHITELISTED",
    "BORROW_BELOW_MIN",
    "SUPPLY_ABOVE_MAX",
    "NONZERO_TOTAL_SUPPLY",
];
Fuse.CTOKEN_ERROR_CODES = [
    "NO_ERROR",
    "UNAUTHORIZED",
    "BAD_INPUT",
    "COMPTROLLER_REJECTION",
    "COMPTROLLER_CALCULATION_ERROR",
    "INTEREST_RATE_MODEL_ERROR",
    "INVALID_ACCOUNT_PAIR",
    "INVALID_CLOSE_AMOUNT_REQUESTED",
    "INVALID_COLLATERAL_FACTOR",
    "MATH_ERROR",
    "MARKET_NOT_FRESH",
    "MARKET_NOT_LISTED",
    "TOKEN_INSUFFICIENT_ALLOWANCE",
    "TOKEN_INSUFFICIENT_BALANCE",
    "TOKEN_INSUFFICIENT_CASH",
    "TOKEN_TRANSFER_IN_FAILED",
    "TOKEN_TRANSFER_OUT_FAILED",
    "UTILIZATION_ABOVE_MAX",
];
