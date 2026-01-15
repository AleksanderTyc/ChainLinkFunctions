// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TemperatureInsurerModule = buildModule("TemperatureInsurerModule", (m) => {
  const contractTemperatureInsurer = m.contract("contracts/TemperatureInsurer.sol:TemperatureInsurer", [272n * 10n ** 18n]);
  return { contractTemperatureInsurer };
});

module.exports = TemperatureInsurerModule;
