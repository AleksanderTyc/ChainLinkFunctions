// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TemperatureInsurerModule = buildModule("TemperatureInsurerModule", (m) => {
  const contractTemperatureInsurer = m.contract("contracts/TemperatureInsurer.sol:TemperatureInsurer", [272n * 10n ** 18n]);
  return { contractTemperatureInsurer };
});

module.exports = TemperatureInsurerModule;

/*
const hre = require('hardhat');

  // Verify on local network
  hre.run("verify:verify", {
    address: contractTemperatureInsurer.address,
    constructorArguments: [272n * 10n ** 18n],
  });
ChainConfigNotFoundError: Trying to verify a contract in a network with chain id 31337, but the plugin doesn't recognize it as a supported chain.

You can manually add support for it by following these instructions: https://v2.hardhat.org/verify-custom-networks

To see the list of supported networks, run this command:

  npx hardhat verify --list-networks
*/
