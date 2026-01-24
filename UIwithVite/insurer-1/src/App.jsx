import React from 'react';

/* BC - related */
import {
    ABIGetter,
    getBalance,
    cInsure,
    cSetClaim,
    cSetAdverseTemperature,
    cSetClaimStatus,
    cClaim,
    cResetContract,
    checkTxIndex
} from './TemperatureInsurer_ABI';

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
    const [cPremium, setCPremium] = React.useState("");
    const [cAdverseTemperature, setAdverseTemperature] = React.useState(0);
    const [cInsured, setCInsured] = React.useState("");
    const [cLatitude, setCLatitude] = React.useState("");
    const [cLongitude, setCLongitude] = React.useState("");
    const [cCurrTemperature, setCurrTemperature] = React.useState(0);
    const [cClaimStatus, setCClaimStatus] = React.useState("");


    function refreshContractData(accounts = [window.ethereum.selectedAddress]) {
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
        getBalance(TemperatureInsurer_Interface.addressContract).then(
            result => setCPremium(result)
        );
        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_adverseTemperature").then(
            result => setAdverseTemperature((Number(result / (10n ** 15n)) / 1000 - 274).toFixed(1))
        );
        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_latitude").then(
            result => setCLatitude(result)
        );
        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_longitude").then(
            result => setCLongitude(result)
        );
        ABIGetter(TemperatureInsurer_Interface.addressContract, "get_temperature").then(
            result => setCurrTemperature((Number(result / (10n ** 15n)) / 1000 - 274).toFixed(1))
        );
    }

    function handleAccountChange(accounts) {
        dtNowW = new Date();
        console.log(`A240 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange`);
        if (accounts.length > 0) {
            console.log(`A241 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange * accounts[0] ${accounts[0]}`);
            console.log(`A242 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange * accounts`, accounts);
            console.log(`A243 * ${dtNowW.toISOString().substring(11, 23)} * handleAccountChange * selectedAddress ${window.ethereum.selectedAddress}`);
            setWalletAddress(accounts[0]);
            setAppStatus('Connected');
            refreshContractData(accounts);
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

    function monitorTXMined(
        TXPromise,
        descOperation,
        labelOperation
    ) {
        TXPromise.then(txReturn => {
            const dtNow = new Date();
            console.log(`TXM1 * ${dtNow.toISOString().substring(11, 23)} * ${descOperation} * txReturn`, txReturn.transactionIndex);
            if (txReturn.transactionIndex === null) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => resolve(checkTxIndex(txReturn.hash)), 5000)
                });
            } else {
                return txReturn;
            }
        })
            .then(txReturn => {
                const dtNow = new Date();
                console.log(`TXM2 * ${dtNow.toISOString().substring(11, 23)} * ${descOperation} * txReturn`, txReturn.transactionIndex);
                if (txReturn.transactionIndex === null) {
                    alert(`${labelOperation} * ${dtNow.toISOString().substring(11, 23)} * Transaction is still mining, please monitor`);
                } else {
                    alert(`${labelOperation} * ${dtNow.toISOString().substring(11, 23)} * Transaction mined`);
                }
                refreshContractData();
            })
            .catch(error => {
                const dtNow = new Date();
                console.error(`TXM9 * ${dtNow.toISOString().substring(11, 23)} * ${descOperation} * error`, error);
            });
    }

    function submitBuy(formData) {
        const formLatitude = formData.get('nameLatitude');
        const formLongitude = formData.get('nameLongitude');
        dtNowW = new Date();
        console.log(`A411 * ${dtNowW.toISOString().substring(11, 23)} * submitBuy * formLatitude ${formLatitude}`);
        console.log(`A412 * ${dtNowW.toISOString().substring(11, 23)} * submitBuy * formLongitude ${formLongitude}`);
        setCStatus(currStatus => currStatus + ' ... updating');
        monitorTXMined(
            cInsure(TemperatureInsurer_Interface.addressContract, formLatitude, formLongitude)
                .then(result => {
                    const dtNow = new Date();
                    console.log(`A4111 * ${dtNow.toISOString().substring(11, 23)} * submitBuy * result`, result);
                    return checkTxIndex(result);
                }),
                "submitBuy",
                "Contract Purchase"
        );
    }

    function updStatusWithTemp(formData) {
        const formTemperature = formData.get('nameStatusTemp');
        dtNowW = new Date();
        console.log(`A421 * ${dtNowW.toISOString().substring(11, 23)} * updStatusWithTemp * formTemperature ${formTemperature}`);
        const calcTemperature = BigInt((274 + Number(formTemperature)) * 1000) * 10n ** 15n;
        console.log(`A422 * ${dtNowW.toISOString().substring(11, 23)} * updStatusWithTemp * calcTemperature ${calcTemperature}`);
        setCStatus(currStatus => currStatus + ' ... updating');
        monitorTXMined(
            cSetClaim(TemperatureInsurer_Interface.addressContract, calcTemperature)
            .then(result => {
                const dtNow = new Date();
                console.log(`A4211 * ${dtNow.toISOString().substring(11, 23)} * updStatusWithTemp * result`, result);
                return checkTxIndex(result);
            }),
            "updStatusWithTemp",
            "Update Status with Temperature"
    );
    /*
            .then(txReturn => {
                const dtNow = new Date();
                console.log(`A4212 * ${dtNow.toISOString().substring(11, 23)} * updStatusWithTemp * txReturn`, txReturn.transactionIndex);
                if (txReturn.transactionIndex === null) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => resolve(checkTxIndex(txReturn.hash)), 5000)
                    });
                } else {
                    return txReturn;
                }
            })
            .then(txReturn => {
                const dtNow = new Date();
                console.log(`A4213 * ${dtNow.toISOString().substring(11, 23)} * updStatusWithTemp * txReturn`, txReturn.transactionIndex);
                if (txReturn.transactionIndex === null) {
                    alert(`Update Status with Temperature * ${dtNow.toISOString().substring(11, 23)} * Transaction is still mining, please monitor`);
                } else {
                    alert(`Update Status with Temperature * ${dtNow.toISOString().substring(11, 23)} * Transaction mined`);
                }
                refreshContractData();
            })
            .catch(error => {
                const dtNow = new Date();
                console.log(`A4219 * ${dtNow.toISOString().substring(11, 23)} * updStatusWithTemp * error`, error);
            });
            */
    }

    function updAdvTemp(formData) {
        const formTemperature = formData.get('nameAdvTemp');
        dtNowW = new Date();
        console.log(`A431 * ${dtNowW.toISOString().substring(11, 23)} * updAdvTemp * formTemperature ${formTemperature}`);
        const calcTemperature = BigInt((274 + Number(formTemperature)) * 1000) * 10n ** 15n;
        console.log(`A432 * ${dtNowW.toISOString().substring(11, 23)} * updAdvTemp * calcTemperature ${calcTemperature}`);
        cSetAdverseTemperature(TemperatureInsurer_Interface.addressContract, calcTemperature)
            .then(result => {
                const dtNow = new Date();
                console.log(`A4311 * ${dtNow.toISOString().substring(11, 23)} * updAdvTemp * result`, result);
            })
            .catch(error => {
                const dtNow = new Date();
                console.log(`A4319 * ${dtNow.toISOString().substring(11, 23)} * updAdvTemp * error`, error);
            });
    }

    function updStatus(formData) {
        const formObject = formData.get('nameStatus');
        cSetClaimStatus(TemperatureInsurer_Interface.addressContract, BigInt(formObject))
            .then(result => {
                const dtNow = new Date();
                console.log(`A4411 * ${dtNow.toISOString().substring(11, 23)} * updStatus * result`, result);
            })
            .catch(error => {
                const dtNow = new Date();
                console.error(`A4419 * ${dtNow.toISOString().substring(11, 23)} * updStatus * error`, error);
            });
    }

    function submitClaim() {
        dtNowW = new Date();
        console.log(`A451 * ${dtNowW.toISOString().substring(11, 23)} * submitClaim`);
        cClaim(TemperatureInsurer_Interface.addressContract)
            .then(result => {
                const dtNow = new Date();
                console.log(`A4511 * ${dtNow.toISOString().substring(11, 23)} * submitClaim * result`, result);
            })
            .catch(error => {
                const dtNow = new Date();
                console.error(`A4519 * ${dtNow.toISOString().substring(11, 23)} * submitClaim * error`, error);
            });
    }

    function submitReset() {
        dtNowW = new Date();
        console.log(`A461 * ${dtNowW.toISOString().substring(11, 23)} * submitReset`);
        cResetContract(TemperatureInsurer_Interface.addressContract)
            .then(result => {
                const dtNow = new Date();
                console.log(`A4611 * ${dtNow.toISOString().substring(11, 23)} * submitReset * result`, result);
            })
            .catch(error => {
                const dtNow = new Date();
                console.error(`A4619 * ${dtNow.toISOString().substring(11, 23)} * submitReset * error`, error);
            });
    }

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
            <h1 className="h-white">Temperature Insurer</h1>
            <div className="d-grid gap-2">
                <button ref={refConnW} id="actionBtn" onClick={() => { connectWallet(); }}>Connect Wallet</button>
            </div>
            <div id="hbar"></div>
            <h4 className="application-status">
                Application Status / Role: {appStatus}
            </h4>
            {appStatus !== "Install Metamask" && appStatus !== "Not connected" &&
                <p>
                    MM selected address: {walletAddress.length > 0 ? walletAddress : "Not connected"}
                </p>
            }
            <div id="hbar"></div>
            <h1 className="h-white">Contract Data</h1>
            {appStatus !== "Install Metamask" && appStatus !== "Not connected" &&
                <>
                    <p>
                        Owner: {cOwner}
                    </p>
                    <p>
                        Contract Status: {cStatus}
                    </p>
                    <p>
                        Adverse Temperature: {cAdverseTemperature}
                    </p>
                    <p>
                        Insured: {cInsured}
                    </p>
                    <p>
                        Premium: {cPremium}
                    </p>
                    <p>
                        Latitude: {cLatitude}
                    </p>
                    <p>
                        Longitude: {cLongitude}
                    </p>
                    <p>
                        Current Temperature: {cCurrTemperature}
                    </p>
                    <p>
                        Claim Status: {cClaimStatus}
                    </p>
                </>
            }
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Update Adverse Temperature</h1>
                <form action={updAdvTemp}>
                    <p>
                        <label htmlFor='inpAdvTemp'>New Adverse Temperature:</label>
                        <input id='inpAdvTemp' name='nameAdvTemp' type='number' required min={-80} max={50} step={0.1} defaultValue={-2.5} />
                    </p>
                    <input className="btn-gen" type='submit' value='Set' />
                </form>
            </section>
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Force-update Status</h1>
                <form action={updStatus}>
                    <p>
                        <label htmlFor='inpStatus'>New Status:</label>
                        <input id='inpStatus' name='nameStatus' type='number' required min={0} max={100} defaultValue={2} />
                    </p>
                    <input className="btn-gen" type='submit' value='Set' />
                </form>
            </section>
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Update Status with Temperature</h1>
                <form action={updStatusWithTemp}>
                    <p>
                        <label htmlFor='inpStatusTemp'>New Current Temperature:</label>
                        <input id='inpStatusTemp' name='nameStatusTemp' type='number' required min={-80} max={50} step={0.1} defaultValue={9.5} />
                    </p>
                    <input className="btn-gen" type='submit' value='Set' />
                </form>
            </section>
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Contract Purchase</h1>
                <form action={submitBuy}>
                    <p>
                        <label htmlFor='inpLatitude'>Latitude insured:</label>
                        <input id='inpLatitude' name='nameLatitude' type='number' required min={-90} max={90} step={0.0000000000001} defaultValue={53.1222619761935} />
                    </p>
                    <p>
                        <label htmlFor='inpLongitude'>Longitude insured:</label>
                        <input id='inpLongitude' name='nameLongitude' type='number' required min={-180} max={180} step={0.0000000000001} defaultValue={17.9989758234834} />
                    </p>
                    <input className="btn-gen" type='submit' value='Buy' />
                </form>
            </section>
            <section>
                <div id="hbar"></div>
                <div id="passwds-cont">
                    <button id="inc-btn" onClick={submitReset}>Contract Reset</button>
                    <button id="upd-btn" onClick={submitClaim}>Claim</button>
                </div>
            </section>
        </div>
    );
}

export default App;
/*
                        <h4 className="balanceDisplay">
                            Wallet Balance: {walletAddress.length > 0 ? userBalance : "Not connected"}
                        </h4>
*/
