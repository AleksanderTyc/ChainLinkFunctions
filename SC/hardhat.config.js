require("@nomicfoundation/hardhat-toolbox");

const { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } = require("hardhat/builtin-tasks/task-names");
const { subtask } = require("hardhat/config");

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
  async (_, __, runSuper) => {
    const paths = await runSuper();
    // Filter out any undesired contracts, e.g. CLFunctionTemperatureInsurer.sol
    return paths.filter(
      p => !p.endsWith("CLFunctionTemperatureInsurer.sol")
    );
  }
);
// https://www.mexc.com/en-NG/news/90452

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};
