let simpleCounter = 0;

/* BC - related */
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
const wallet = new ethers.Wallet(secrets.HARDHATn1_PRIVATE_KEY, SimpleCounter_Interface.networkProvider);

/* Sepolia (via MetaMask) */
/* TODO
const SimpleCounter_Interface = {
  networkProvider: new ethers.JsonRpcProvider(`http://127.0.0.1:8545`),
  addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  addressWallet: HARDHATn1_WALLET
};
*/

const SimpleCounter_contract = new ethers.Contract(SimpleCounter_Interface.addressContract, SimpleCounter_ABI, SimpleCounter_Interface.networkProvider);
const contractWithWallet = SimpleCounter_contract.connect(wallet);

/* BC - related - ends */

const counterDisplay = document.getElementById('counter-disp');

const btnIncrease = document.getElementById('inc-btn');
const btnUpdate = document.getElementById('upd-btn');

function increaseCounter() {
  simpleCounter += 1;
}

function getCounter() {
  return new Promise((resolve, reject) => {
    try{
      resolve(contractWithWallet.currentCount());
    }
    catch(err){
      reject(err);
    }
  });
}

function clickUpdate() {
  const promisedCounter = getCounter();
  // btnUpdate.disabled = true;
  promisedCounter.then(value => {
    counterDisplay.innerText = value;
    btnIncrease.disabled = false;
    btnIncrease.innerText = 'Increase';
  });
}

function clickIncrease() {
  btnIncrease.disabled = true;
  btnIncrease.innerText = 'Increasing...'

  increaseCounter();
  clickUpdate();
}

btnIncrease.addEventListener("click", clickIncrease);
btnIncrease.innerText = 'Increase';
btnUpdate.addEventListener("click", clickUpdate);
btnUpdate.innerText = 'Update';

clickUpdate();


/*
*/
/*
import { ethers } from "ethers";

const { ETHERSCAN_API_KEY, INFURA_API_KEY, SEPOLIA_PRIVATE_KEY, HARDHAT_WALLET, HARDHAT_PRIVATE_KEY } = require("./secrets.json");
// const PROVIDER = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
// const ADDRESS = '0x31ac9aa612ba2647280111ffa46488e07cf3fd8d';
const PROVIDER = new ethers.JsonRpcProvider(`http://127.0.0.1:8545`);
const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
// const ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const SevenTrader_ABI = [
  "function balanceOfBatch(address[] memory, uint256[] memory) public view  returns (uint256[] memory)",
  "function mint(uint256) public",
  "function burn(uint256) public",
  "function trade(uint256, uint256) public"
];

const SevenTrader_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// This works
import { ethers } from "ethers";
const PROVIDER = new ethers.JsonRpcProvider(`http://127.0.0.1:8545`);
const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const balance = PROVIDER.getBalance(ADDRESS);
balance.then(
  result => {
    let dtNow = new Date();
    console.log(`Balance object on resolve * on ${dtNow} is ${ethers.formatEther(result)}.`);
  }
);
// This works ends

// Will become useful when we connect to MetaMask
function Balance({ balanceETH }) {
  const balance = PROVIDER.getBalance(ADDRESS);
  balance.then(
    result => {
      const balanceField = document.getElementById("currentETHBalance");
      const currHTML = balanceField.innerHTML;
      let dtNow = new Date();
      console.log(`balance object on resolve * on ${dtNow} currHTML is ${currHTML}.`);
      balanceField.innerHTML = `Current ETH Balance is ${ethers.formatEther(result)} ETH.`;
    }
  );
}

// Example transaction
const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY, PROVIDER);

const SevenTrader_contract = new ethers.Contract(SevenTrader_address, SevenTrader_ABI, PROVIDER);
const contractWithWallet = SevenTrader_contract.connect(wallet);

const mintBase = contractWithWallet.mint(tokenId);
mintBase.then(
  result => {
    let newTokenBalances = tokenBalances.slice();
    newTokenBalances[tokenId] += 1;
    setTokenBalances(newTokenBalances);
  }
)
  .catch(
    result => {
      let dtNow = new Date();
      alert(`mintBase error * on ${dtNow} result is ${result}.`);
      setIsError(result);
    }
  )
  .finally(
    () => {
      setIsLoading(false);
    }
  );
// Example transaction ends


// Here we can see how little I understood of JS, React and handling async/await and Promise:
const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY, PROVIDER);

const SevenTrader_contract = new ethers.Contract(SevenTrader_address, SevenTrader_ABI, PROVIDER);
const contractWithWallet = SevenTrader_contract.connect(wallet);

const tokenBalances = await contractWithWallet.balanceOfBatch(
  [ADDRESS, ADDRESS, ADDRESS, ADDRESS, ADDRESS, ADDRESS, ADDRESS],
  [0, 1, 2, 3, 4, 5, 6]
);
let newTokenBalances = [];
tokenBalances.forEach(element => { newTokenBalances.push(Number(element)); });
setTokenBalances(newTokenBalances);
// ends
*/
/*
*/
