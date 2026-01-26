function UpdateStatus(props) {
    return (
        <section>
        <div id="hbar"></div>
        <h1 className="h-white">Force-update Status</h1>
        <form action={props.handler}>
            <p>
                <label htmlFor='inpStatus'>New Status:</label>
                <input id='inpStatus' name='nameStatus' type='number' required min={0} max={100} defaultValue={props.defaultStatus} />
            </p>
            <input className="btn-gen" type='submit' value='Set' />
        </form>
    </section>
);
}

export { UpdateStatus };
