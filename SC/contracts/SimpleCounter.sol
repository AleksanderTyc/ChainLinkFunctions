// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleCounter {
    uint256 public currentCount;

    function increase() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        currentCount += 1;
    }
}

/* Using JSON/RPC to call increase and to obtain currentCount
const [owner, othAlice, othBob] = await ethers.getSigners();
await ethers.provider.send("eth_sendTransaction", [{from: owner.address, to:'0x5FbDB2315678afecb367f032d93F642f64180aa3', data:"0xe8927fbc"}]);
await ethers.provider.send("eth_call", [{to:'0x5FbDB2315678afecb367f032d93F642f64180aa3', data:"0xc732d201"}]);
Signatures
https://rareskills.io/post/abi-encoding
const s1currentCount = 'currentCount()';
ethers.id(s1currentCount).substring(0,10);
-- 0xc732d201
const s2increase = 'increase()';
ethers.id(s2increase).substring(0,10);
-- 0xe8927fbc
https://ethereum.stackexchange.com/questions/119583/when-to-use-abi-encode-abi-encodepacked-or-abi-encodewithsignature-in-solidity
*/
