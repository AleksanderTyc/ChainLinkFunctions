// Renamed from .ts to .cts after this error message:
/*
ChainLinkFunctions/repository$ npx hardhat compile
Error HH19: Your project is an ESM project (you have "type": "module" set in your package.json) but your Hardhat config file uses the .js extension.

Rename the file to use the .cjs to fix this problem.
*/

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

export default config;
