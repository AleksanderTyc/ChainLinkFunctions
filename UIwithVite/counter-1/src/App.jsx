import React from 'react';

/* BC - related */
import { ethers } from "ethers";

// import secrets from "../../src/secrets.json" with {type: "json"};
import secrets from "../../../src/secrets.json" with {type: "json"};

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

function getCounter() {
  return new Promise((resolve, reject) => {
    try {
      resolve(contractWithWallet.currentCount());
    }
    catch (err) {
      reject(err);
    }
  });
}


function App() {
  const [simpleCounter, setSimpleCounter] = React.useState(0);
  const refDisp = React.useRef(null);
  const refBtnInc = React.useRef(null);
  const refBtnUpd = React.useRef(null);
  /*
    function increaseCounter() {
      setSimpleCounter(curr => curr + 1);
    }
  
    function getCounter() {
      return new Promise((resolve, reject) => {
        try {
          resolve(simpleCounter);
        }
        catch (err) {
          reject(err);
        }
      });
    }
  */
  function clickUpdate() {
    const promisedCounter = getCounter();
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

  React.useEffect(
    () => {
      // refBtnInc.current.innerText = 'Increase';
      clickUpdate();
    }, []
  );

  return (
    <div id="hero">
      <h1 id="h1-white">Simple Counter Toy</h1>
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
