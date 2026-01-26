function UpdateAdverseTemperature(props) {
    return (
        <section>
            <div id="hbar"></div>
            <h1 className="h-white">Update Adverse Temperature</h1>
            <form action={props.handler}>
                <p>
                    <label htmlFor='inpAdvTemp'>New Adverse Temperature:</label>
                    <input id='inpAdvTemp' name='nameAdvTemp' type='number' required min={-80} max={50} step={0.1} defaultValue={props.defaultTemp} />
                </p>
                <input className="btn-gen" type='submit' value='Set' />
            </form>
        </section>
    );
}

export { UpdateAdverseTemperature };
