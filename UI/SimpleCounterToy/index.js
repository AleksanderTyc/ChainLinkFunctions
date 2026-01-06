let simpleCounter = 0;

const counterDisplay = document.getElementById('counter-disp');

const btnIncrease = document.getElementById('inc-btn');
const btnUpdate = document.getElementById('upd-btn');

function increaseCounter() {
    var boogieCount = 0;
    console.log('* I * increaseCounter loop start');
    for (let index = 10; index < 10000000; index++) {
        if (Math.abs(index - Math.exp(Math.log(index))) < 0.1) {
            boogieCount += index;
        }
    }
    console.log('* I * increaseCounter loop end', boogieCount);
    if (boogieCount === 9999999 * 10000000 / 2 -45) {
        simpleCounter += 1;
    }
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
        // btnIncrease.addEventListener("click", clickIncrease);
        btnIncrease.innerText = 'Increase';
    });
}

function clickIncrease() {
    btnIncrease.disabled = true;
    btnIncrease.innerText = 'Increasing...'
    // btnIncrease.removeEventListener("click", clickIncrease);

    increaseCounter();
    clickUpdate();
}

btnIncrease.addEventListener("click", clickIncrease);
btnIncrease.innerText = 'Increase';
btnUpdate.addEventListener("click", clickUpdate);
btnUpdate.innerText = 'Update';

clickUpdate();

