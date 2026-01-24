import process from 'node:process';

const arrArgV = process.argv;

arrArgV.forEach((arg, index) => {
    console.log(`* I * arg #${index}: ${arg}`);
});

// Execute with:
// repository/scripts$ node cmdline.js ala ma kota

let intervalId = null;
let startDate = new Date();
let endDate = new Date();
endDate.setSeconds(endDate.getSeconds() +20);
console.log(`A11 * ${startDate.toISOString()} * startDate`);
console.log(`A12 * ${startDate.toISOString().substring(11, 23)} * startDate`);
console.log(`A21 * ${endDate.toISOString()} * endDate`);
console.log(`A22 * ${endDate.toISOString().substring(11, 23)} * endDate`);
console.log(`A31 * startDate < endDate * ${startDate < endDate}`);
console.log(`A32 * endDate < startDate * ${endDate < startDate}`);

let varCounter = 0;

function runInterval() {
    const currDate = new Date();
    if( endDate < currDate) {
        console.log(`A72 * ${varCounter} * runInterval * endDate < currDate * ${endDate < currDate} * clearing Interval ${intervalId}`);
        clearInterval(intervalId);
    }
    console.log(`A71 * ${varCounter} * runInterval * currDate * ${currDate.toISOString().substring(11, 23)}`);
    varCounter += 1;
}

intervalId = setInterval(runInterval, 3000);
