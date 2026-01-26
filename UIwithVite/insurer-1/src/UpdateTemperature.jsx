function UpdateTemperature(props) {
    return (
        <section>
            <div id="hbar"></div>
            <h1 className="h-white">Update Status with Temperature</h1>
            <form action={props.handler}>
                <p>
                    <label htmlFor='inpStatusTemp'>New Current Temperature:</label>
                    <input id='inpStatusTemp' name='nameStatusTemp' type='number' required min={-80} max={50} step={0.1} defaultValue={props.defaultTemp} />
                </p>
                <input className="btn-gen" type='submit' value='Set' />
            </form>
        </section>
    );
}

export { UpdateTemperature };
