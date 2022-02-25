import { utils } from "ethers";

// CErc20 contract ABI
const abi = new utils.Interface(require("./contracts/CErc20.json"));

const CErc20 = { abi };

export default CErc20;
