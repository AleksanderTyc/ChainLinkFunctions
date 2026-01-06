let simpleCounter = 0;

const counterDisplay = document.getElementById('counter-disp');

const btnIncrease = document.getElementById('inc-btn');
const btnUpdate = document.getElementById('upd-btn');

function increaseCounter() {
    simpleCounter += 1;
}

function getCounter() {
    return new Promise((resolve, reject) => { resolve(simpleCounter); });
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
