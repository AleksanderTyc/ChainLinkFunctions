// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleCounter {
    uint256 public currentCount;

    event Counted(uint256 currentCount);

    function increase() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        currentCount += 1;
        emit Counted(currentCount);
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

eth_call returns primitive data (256 bit blocks). In order for it to be used properly in JS, the result then needs to be ABI-decoded:
> ethers.id("owner()").substring(0,10)
'0x8da5cb5b'
> const r1 = await ethers.provider.send("eth_call", [{to:'0x5FbDB2315678afecb367f032d93F642f64180aa3', data:"0x8da5cb5b"}]);
> r1
'0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266'
> const cdr = ethers.AbiCoder.defaultAbiCoder();
> cdr.decode(["address"], r1);
Result(1) [ '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' ]
> const [owner, otherAccount] = await ethers.getSigners();
> owner.address === cdr.decode(["address"], r1)[0];
true
> BigInt(r1);
1390849295786071768276380950238675083608645509734n
*/

/* Listening to event
1. Event topics:
1.0. Event's signature, e.g.
ethers.id('Counted(uint256)');
-- '0x15df0a6785153dfd625c8af51397704c7ddaff0690e5076243b5e52f4a0d5409'
1.1. Every indexed parameter becomes a topic - its value will be stored as emitted event's argument.
https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378
2. Retrieve all event logs related to a specific contract, or satisfying specific topics.
const filter =  cTested.filters.Counted(null); // null means "no filtering here" - it is not indexed anyway.
cTested.queryFilter(filter).then(event => console.log(event));
The log is an Array of Objects EventLog, each of which provides:
- EventLog.address // contract's address
- EventLog.transactionHash
- EventLog.args // array of event's arguments
- EventLog.topics // array of event's topics, the first (index 0) being the event's signature
https://rareskills.io/post/ethereum-events search for "Example 2: Filtering an ERC20 approval for a specific address".
3. It is also possible to retrieve events related to a specific transaction.
https://nulldog.com/hardhat-get-events-from-transaction-receipts
*/
