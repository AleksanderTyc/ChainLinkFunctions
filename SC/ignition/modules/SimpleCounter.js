// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleCounterModule = buildModule("SimpleCounterModule", (m) => {
  const contractSimpleCounter = m.contract("SimpleCounter");
  return { contractSimpleCounter };
});

export default SimpleCounterModule;
