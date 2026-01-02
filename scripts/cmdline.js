import process from 'node:process';

const arrArgV = process.argv;

arrArgV.forEach((arg, index) => {
    console.log(`* I * arg #${index}: ${arg}`);
});

// Execute with:
// repository/scripts$ node cmdline.js ala ma kota
