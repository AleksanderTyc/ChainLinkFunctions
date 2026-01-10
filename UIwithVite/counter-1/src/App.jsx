import React from 'react';

/* BC - related */
import { ethers } from "ethers";

// import secrets from "../../src/secrets.json" with {type: "json"};
import secrets from "../../../src/secrets.json" with {type: "json"};

/* Signatures
https://rareskills.io/post/abi-encoding
const s1currentCount = 'currentCount()';
ethers.id(s1currentCount).substring(0,10);
-- 0xc732d201
const s2increase = 'increase()';
ethers.id(s2increase).substring(0,10);
-- 0xe8927fbc
https://ethereum.stackexchange.com/questions/119583/when-to-use-abi-encode-abi-encodepacked-or-abi-encodewithsignature-in-solidity
*/
const SimpleCounter_ABI = [
  "function currentCount() public view returns (uint256)",
  "function increase() public"
];

/* Local HardHat */
/*
const SimpleCounter_Interface = {
  networkProvider: new ethers.JsonRpcProvider(`http://127.0.0.1:8545`),
  addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  addressWallet: secrets.HARDHATn1_WALLET
};
const wallet = new ethers.Wallet(secrets.HARDHATn1_PRIVATE_KEY, SimpleCounter_Interface.networkProvider);
*/

/* Sepolia (via MetaMask) */
/* TODO
const SimpleCounter_Interface = {
  networkProvider: new ethers.JsonRpcProvider(`http://127.0.0.1:8545`),
  addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  addressWallet: HARDHATn1_WALLET
};
const wallet = new ethers.Wallet(secrets.HARDHATn1_PRIVATE_KEY, SimpleCounter_Interface.networkProvider);
*/

/* HardHat or Sepolia */
/*
const SimpleCounter_contract = new ethers.Contract(SimpleCounter_Interface.addressContract, SimpleCounter_ABI, SimpleCounter_Interface.networkProvider);
const contractWithWallet = SimpleCounter_contract.connect(wallet);
*/

/* MetaMask */
const SimpleCounter_Interface = {
  addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
};

/* BC - related - ends */


function increaseCounter() {
  return new Promise((resolve, reject) => {
    try {
      resolve(contractWithWallet.increase());
    }
    catch (err) {
      reject(err);
    }
  });
}

function getCounter(walletAddress) {
  const dtNow = new Date();
  console.log(`A7201 on ${dtNow} * getCounter * walletAddress is ${walletAddress}`);
  return new Promise((resolve, reject) => {
    try {
      // resolve(contractWithWallet.currentCount());
      resolve(window.ethereum.request(
        {
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: SimpleCounter_Interface.addressContract,
              data: "0xc732d201",
              chainId: "0x7a69" // 31337 HardHat
            }]
          }
      ));
      // resolve(117);
    }
    catch (err) {
      reject(err);
    }
  });
}


function App() {
  let dtNowW = null;

  const [simpleCounter, setSimpleCounter] = React.useState(0);
  const refConnW = React.useRef(null);
  const refDisp = React.useRef(null);
  const refBtnInc = React.useRef(null);
  const refBtnUpd = React.useRef(null);

  const [walletAddress, setWalletAddress] = React.useState("");
  const [userBalance, setUserBalance] = React.useState(0);

  function clickUpdate() {
    refBtnUpd.current.innerText = 'Updating...';
    const promisedCounter = getCounter(walletAddress);
    // btnUpdate.disabled = true;
    promisedCounter.then(value => {
      console.log(`* I * clickUpdate, value ${value}`);
      setSimpleCounter(value);
      refBtnInc.current.disabled = false;
      refBtnInc.current.innerText = 'Increase';
      refBtnUpd.current.innerText = 'Update';
    });
  }

  function clickIncrease() {
    refBtnInc.current.disabled = true;
    refBtnInc.current.innerText = 'Increasing...'

    const promisedIncrease = increaseCounter();
    promisedIncrease.then(result => {
      clickUpdate();
    });
  }

  /* BC related */
  function handleChainChange(chainId) {
    const dtNow = new Date();
    console.log(`A9201 on ${dtNow} * handleChainChange * ${chainId}`);
  }

  function handleAccountChange(accounts) {
    const dtNow = new Date();
    if (accounts.length > 0) {
      console.log(`A9101 on ${dtNow} * handleAccountChange * ${accounts[0]}`);
      setWalletAddress(accounts[0]);
    } else {
      console.log(`A9102 on ${dtNow} * handleAccountChange * accounts is empty`);
      setWalletAddress("");
    }
    return accounts;
  }

  function getAccount0Balance(accounts) {
    const dtNow = new Date();
    if (accounts.length > 0) {
      window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"]
      }).then(balance => {
        const dtNow = new Date();
        console.log(`A9301 on ${dtNow} * getAccount0Balance * ${balance}`);
        setUserBalance(balance);
      });
    }
    else {
      setUserBalance(0);
    }
    return accounts;
  };

  function connectWallet() {
    try {
      /* MetaMask is installed - otherwise the button would be disabled - no way to call this function */
      const accounts = window.ethereum.request({ method: "eth_requestAccounts" });
      accounts
        .then(result => {
          const dtNow = new Date();
          console.log(`A13 on ${dtNowW} * Calling handleAccountChange`, result);
          handleAccountChange(result);
        })
        .catch(err => {
          const dtNow = new Date();
          console.error(`A121 on ${dtNowW} * ${err.message}`);
        });
    }
    catch (err) {
      dtNowW = new Date();
      console.error(`A12 on ${dtNowW} * ${err.message}`);
      // setErrorMessage(err.message);
    }
  };


  /* BC related ends */

  React.useEffect(
    () => {
      /* HardHat or Sepolia */
      /*
            clickUpdate();
      */

      /* MetaMask */
      if ((typeof window != "undefined") && (typeof window.ethereum != "undefined")) {
        /* MetaMask is installed */
        try {
          dtNowW = new Date();
          console.log(`A41 on ${dtNowW} * Registering handleAccountChange as Promise handler to eth_accounts`);
          window.ethereum.request({ method: "eth_accounts" })
            .then((accounts) => handleAccountChange(accounts))
            .then((accounts) => getAccount0Balance(accounts))
            ;

          // addWalletListener();
          dtNowW = new Date();
          console.log(`A42 on ${dtNowW} * Registering handleAccountChange as event listener to accountsChanged`);
          window.ethereum.on("accountsChanged", handleAccountChange);
          // addChainListener
          dtNowW = new Date();
          console.log(`A43 on ${dtNowW} * Registering handleChainChange as event listener to chainChanged`);
          window.ethereum.on("chainChanged", handleChainChange);

        }
        catch (err) {
          dtNowW = new Date();
          console.error(`A48 on ${dtNowW} * ${err.message}`);
        }
      }
      else {
        /* MetaMask is not installed */
        dtNowW = new Date();
        console.log(`A49 on ${dtNowW} * Please install MetaMask`);
        // setWalletAddress("");
        refConnW.current.innerText = 'MM absent';
        refConnW.current.disabled = true;
      }
      return (
        () => {
          if ((typeof window != "undefined") && (typeof window.ethereum != "undefined")) {
            const dtNow = new Date();
            console.log(`A211 on ${dtNow} * De-registering event listeners: handleAccountChange, handleChainChange`);
            window.ethereum.removeListener("accountsChanged", handleAccountChange);
            window.ethereum.removeListener("chainChanged", handleChainChange);
          }
        }
      );
    }, []
  );

  return (
    <div id="hero">
      <h1 id="h1-white">Simple Counter Toy</h1>

      <div className="d-grid gap-2">
        <button ref={refConnW} id="actionBtn" onClick={() => { connectWallet(); }}>Connect Wallet</button>
      </div>
      <div className="displayAccount">
        <h4 className="walletAddress">
          Address: {walletAddress.length > 0 ? walletAddress : "Not connected"}
        </h4>
        <h4 className="balanceDisplay">
          Wallet Balance: {walletAddress.length > 0 ? userBalance : "Not connected"}
        </h4>
      </div>

      <p>Use a counter with Smart Contract behind it.</p>
      <div ref={refDisp} className="pwds-div" id="counter-disp">{simpleCounter}</div>
      <div id="hbar"></div>
      <div id="passwds-cont">
        <button ref={refBtnInc} id="inc-btn" onClick={clickIncrease}>I</button>
        <button ref={refBtnUpd} id="upd-btn" onClick={clickUpdate}>U</button>
      </div>
    </div>
  );
}

export default App;
