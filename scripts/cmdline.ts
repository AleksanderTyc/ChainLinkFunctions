// https://nodejs.org/docs/latest/api/process.html#processargv

import process from 'node:process';

const arrArgV: Array<string> = process.argv;

arrArgV.forEach((arg: string, index: number): void => {
    console.log(`* I * arg #${index}: ${arg}`);
});

// Execute with:
// repository/scripts$ node --loader ts-node/esm ./cmdline.ts ala ma kota
