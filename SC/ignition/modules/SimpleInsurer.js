// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SimpleInsurerModule = buildModule("SimpleInsurerModule", (m) => {
  const contractSimpleInsurer = m.contract("SimpleInsurer");
  return { contractSimpleInsurer };
});

module.exports = SimpleInsurerModule;
