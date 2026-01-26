function ContractPurchase(props) {
    return (
        <section>
            <div id="hbar"></div>
            <h1 className="h-white">Contract Purchase</h1>
            <form action={props.handler}>
                <p>
                    <label htmlFor='inpLatitude'>Latitude insured:</label>
                    <input id='inpLatitude' name='nameLatitude' type='number' required min={-90} max={90} step={0.0000000000001} defaultValue={props.defaultLat} />
                </p>
                <p>
                    <label htmlFor='inpLongitude'>Longitude insured:</label>
                    <input id='inpLongitude' name='nameLongitude' type='number' required min={-180} max={180} step={0.0000000000001} defaultValue={props.defaultLong} />
                </p>
                <input className="btn-gen" type='submit' value='Buy' />
            </form>
        </section>
    );
}

export { ContractPurchase };
