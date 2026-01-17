import React from 'react';

/* BC - related */
import { ABIGetter } from './TemperatureInsurer_ABI';

/* MetaMask */
/*
const TemperatureInsurer_Interface = {
    networkProvider: new ethers.JsonRpcProvider(`http://127.0.0.1:8545`),
    addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    addressWallet: secrets.HARDHATn1_WALLET
};
*/
const TemperatureInsurer_Interface = {
    addressContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
};
/* BC - related - ends */

function App() {
    let dtNowW = null;

    const [appStatus, setAppStatus] = React.useState('Install Metamask');

    const refConnW = React.useRef(null);


    const [walletAddress, setWalletAddress] = React.useState("");

    const [cStatus, setCStatus] = React.useState("");
    const [cOwner, setCOwner] = React.useState("");
    const [cClaimStatus, setCClaimStatus] = React.useState("");
    const [cAdverseTemperature, setAdverseTemperature] = React.useState("");
    const [cInsured, setCInsured] = React.useState("");
    const [cLatitude, setCLatitude] = React.useState("");
    const [cLongitude, setCLongitude] = React.useState("");


    function handleAccountChange(accounts) {
        dtNowW = new Date();
        console.log(`A240 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange`);
        if (accounts.length > 0) {
            console.log(`A241 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange * ${accounts[0]}`);
            setWalletAddress(accounts[0]);
            setAppStatus('Connected');

            Promise.all(
                [
                    ABIGetter(TemperatureInsurer_Interface.addressContract, "get_owner").then(
                        result => {
                            setCOwner(result);
                            return result;
                        }
                    ),
                    ABIGetter(TemperatureInsurer_Interface.addressContract, "get_claimStatus").then(
                        result => {
                            setCClaimStatus(result);
                            return result;
                        }
                    ),
                    ABIGetter(TemperatureInsurer_Interface.addressContract, "get_insured").then(
                        result => {
                            setCInsured(result);
                            return result;
                        }
                    )
                ]
            ).then(
                result => {
                    const dtNow = new Date();
                    console.log(`A251 * ${dtNow.toISOString().substring(11, 23)} * Promise.all * result`, result);
                    if (result[0].toLowerCase() === accounts[0].toLowerCase()) {
                        setAppStatus('Owner');
                        switch (result[1]) {
                            case 0n:
                                setCStatus('Contract Available');
                                break;
                            case 1n:
                                setCStatus('Contract Purchased');
                                break;
                            default:
                                setCStatus('Contract Claimable');
                        }
                    } else if (result[2].toLowerCase() === accounts[0].toLowerCase()) {
                        setAppStatus('Insured');
                        switch (result[1]) {
                            case 0n:
                            case 1n:
                                setCStatus('Claim not Available');
                                break;
                            default:
                                setCStatus('Claim Available');
                        }
                    } else {
                        setAppStatus('3rd Party');
                        switch (result[1]) {
                            case 0n:
                                setCStatus('Contract Available');
                                break;
                            default:
                                setCStatus('Contract Not Available');
                        }
                    }

                }
            ).catch(
                error => {
                    const dtNow = new Date();
                    console.log(`A259 * ${dtNow.toISOString().substring(11, 23)} * Promise.all * error`, error.message);
                }
            );
            /*
                        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_owner").then(
                            result => {
                                setCOwner(result);
                                return result;
                                if (result.toLowerCase() === accounts[0].toLowerCase()) {
                                    setAppStatus('Owner');
                                }
                            }
                        );
                        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_claimStatus").then(
                            result => setCClaimStatus(result)
                        );
                        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_insured").then(
                            result => setCInsured(result)
                        );
                        */
            ABIGetter(TemperatureInsurer_Interface.addressContract, "get_adverseTemperature").then(
                result => setAdverseTemperature((Number(result / (10n ** 15n)) / 1000 - 274).toFixed(1))
            );
            ABIGetter(TemperatureInsurer_Interface.addressContract, "get_latitude").then(
                result => setCLatitude(result)
            );
            ABIGetter(TemperatureInsurer_Interface.addressContract, "get_longitude").then(
                result => setCLongitude(result)
            );
        } else {
            console.log(`A249 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange * accounts is empty`);
            setWalletAddress("");
        }
        return accounts;
    }

    function connectWallet() {
        dtNowW = new Date();
        console.log(`A220 * ${dtNowW.toISOString().substring(11, 23)} * connectWallet`);
        try {
            /* MetaMask is installed - otherwise the button would be disabled - no way to call this function */
            const accounts = window.ethereum.request({ method: "eth_requestAccounts" });
            accounts
                .then(result => {
                    const dtNow = new Date();
                    console.log(`A231 * ${dtNow.toISOString().substring(11, 23)} * eth_requestAccounts result`, result);
                    handleAccountChange(result);
                })
                .catch(err => {
                    const dtNow = new Date();
                    console.error(`A239 * ${dtNow.toISOString().substring(11, 23)} * eth_requestAccounts catch ${err.message}`);
                });
        }
        catch (err) {
            dtNowW = new Date();
            console.log(`A229 * ${dtNowW.toISOString().substring(11, 23)} * connectWallet catch ${err.message}`);
        }
    };

    React.useEffect(
        () => {
            dtNowW = new Date();
            console.log(`A110 * ${dtNowW.toISOString().substring(11, 23)} * useEffect`);
            /* MetaMask */
            if ((typeof window != "undefined") && (typeof window.ethereum != "undefined")) {
                /* MetaMask is installed */
                setAppStatus('Not connected');
                try {
                    window.ethereum.request({ method: "eth_accounts" })
                        .then((accounts) => handleAccountChange(accounts));
                    window.ethereum.on("accountsChanged", handleAccountChange);
                }
                catch (err) {
                    dtNowW = new Date();
                    console.log(`A119 * ${dtNowW.toISOString().substring(11, 23)} * useEffect * error ${err.message}`);
                }
                refConnW.current.disabled = false;
            } else {
                refConnW.current.innerText = 'MM absent';
                refConnW.current.disabled = true;
            }

            return (
                () => {
                    /* MetaMask */
                    if ((typeof window != "undefined") && (typeof window.ethereum != "undefined")) {
                        window.ethereum.removeListener("accountsChanged", handleAccountChange);
                        // window.ethereum.removeListener("chainChanged", handleChainChange);
                    }
                }
            );
        }
        , []
    );
    return (
        <div id="hero">
            <h1 id="h1-white">Temperature Insurer</h1>
            <div className="d-grid gap-2">
                <button ref={refConnW} id="actionBtn" onClick={() => { connectWallet(); }}>Connect Wallet</button>
            </div>
            <div className="display-account">
                <h4 className="application-status">
                    Status: {appStatus}
                </h4>
                {appStatus !== "Install Metamask" && appStatus !== "Not connected" &&
                    <>
                        <h4 className="walletAddress">
                            Address: {walletAddress.length > 0 ? walletAddress : "Not connected"}
                        </h4>
                    </>
                }
                <h3>Contract Data</h3>
                {appStatus !== "Install Metamask" && appStatus !== "Not connected" &&
                    <>
                        <h4 className="walletAddress">
                            Owner: {cOwner}
                        </h4>
                        <h4 className="walletAddress">
                            Contract Status: {cStatus}
                        </h4>
                        <h4 className="walletAddress">
                            Claim Status: {cClaimStatus}
                        </h4>
                        <h4 className="walletAddress">
                            Adverse Temperature: {cAdverseTemperature}
                        </h4>
                        <h4 className="walletAddress">
                            Insured: {cInsured}
                        </h4>
                        <h4 className="walletAddress">
                            Latitude: {cLatitude}
                        </h4>
                        <h4 className="walletAddress">
                            Longitude: {cLongitude}
                        </h4>
                    </>
                }
            </div>
        </div>
    );
}

export default App;
/*
                        <h4 className="balanceDisplay">
                            Wallet Balance: {walletAddress.length > 0 ? userBalance : "Not connected"}
                        </h4>
*/
