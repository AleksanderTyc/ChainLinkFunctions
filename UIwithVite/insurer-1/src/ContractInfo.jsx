function ContractInfo(props) {
    if (props.pAppStatus !== "Install Metamask" && props.pAppStatus !== "Not connected") {
        return (
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Contract Data</h1>
                <p>
                    Owner: {props.pOwner}
                </p>
                <p>
                    Contract Status: {props.pStatus}
                </p>
                <p>
                    Adverse Temperature: {props.pAdverseTemperature}
                </p>
                <p>
                    Insured: {props.pInsured}
                </p>
                <p>
                    Premium: {props.pPremium}
                </p>
                <p>
                    Latitude: {props.pLatitude}
                </p>
                <p>
                    Longitude: {props.pLongitude}
                </p>
                <p>
                    Current Temperature: {props.pCurrTemperature}
                </p>
                <p>
                    Claim Status: {props.pClaimStatus}
                </p>
            </section>
        );
    } else {
        return (
            <section>
                <div id="hbar"></div>
                <h1 className="h-white">Contract not connected - no data available</h1>
            </section>
        );
    }
}

export { ContractInfo };
