import { ethers } from "ethers";

import secrets from "../../src/secrets.json" with {type: "json"};

const SimpleCounter_ABI = [
    "function currentCount() public view returns (uint256)",
    "function increase() public"
];

/* Local HardHat */
const SimpleCounter_Interface = {
    networkProvider: new ethers.JsonRpcProvider(`http://127.0.0.1:8545`),
    addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    addressWallet: secrets.HARDHATn1_WALLET
};



//   const PROVIDER = new ethers.JsonRpcProvider(`http://127.0.0.1:8545`);
// const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const balance = SimpleCounter_Interface.networkProvider.getBalance(SimpleCounter_Interface.addressWallet);
balance.then(
    result => {
        let dtNow = new Date();
        console.log(`Balance object on resolve * on ${dtNow} is ${ethers.formatEther(result)}.`);
    }
);

const wallet = new ethers.Wallet(secrets.HARDHATn1_PRIVATE_KEY, SimpleCounter_Interface.networkProvider);

const SimpleCounter_contract = new ethers.Contract(SimpleCounter_Interface.addressContract, SimpleCounter_ABI, SimpleCounter_Interface.networkProvider);
const contractWithWallet = SimpleCounter_contract.connect(wallet);

const currentCounter = contractWithWallet.currentCount();
currentCounter.then(
    result => {
        let dtNow = new Date();
        console.log(`currentCount * on ${dtNow} is ${result}.`);
    }
);
