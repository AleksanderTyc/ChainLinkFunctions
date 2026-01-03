import process from 'node:process';

// Retrieve latitude and longitude from arguments
const arrArgV: Array<string> = process.argv;

// Check if latitude or longitude are missing. Set to default if so.
// lat: 53.122261976193464, lng: 17.99897582348337
const lat: number = arrArgV[2] === undefined ? 53.122261976193464 : Number(arrArgV[2]);
const lng: number = arrArgV[3] === undefined ? 17.99897582348337 : Number(arrArgV[3]);

console.log(`* I * lat is ${lat}, type ${typeof lat}`);
console.log(`* I * lng is ${lng}, type ${typeof lng}`);

// Make an HTTP request to the open-meteo API with the parameters
const req: Promise<Response> = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m`);
req
    // .then((res : Response):void => console.log(res) )
    .then((res : Response):Promise<void> => handleResponse(res) )
    .catch((err: Error):void => console.error('* E * Error fetching data', err))
    ;
/*
req
    .then(res => res.json())
    .then(data => JSON.stringify(data, null, 2))
    .then(jsonStr => console.log('* I * jsonStr is', jsonStr))
    .catch(err => console.error('* E * Error fetching data', err))
    ;
*/
// Check if the API response indicates an error

// Extract the temperature from the API response

// Originally: Return the temperature rounded and encoded as a uint256
// MyTake: Return the temperature encoded as original * 10**18 represented as uint256

async function handleResponse(response : Response):Promise<void> {
    if (response.status !== 200 ) {
        throw new Error(`* E * handleResponse, status ${response.status}, ${response.statusText}`);
    } else {
        const data = await response.json();
        // console.log( '* I * handleResponse * data', data);
        console.log( '* I * handleResponse * data.latitude', data.latitude);
        console.log( '* I * handleResponse * data.longitude', data.longitude);
        console.log( '* I * handleResponse * data.time', data.current.time);
        console.log( '* I * handleResponse * data.temperature_2m', data.current.temperature_2m);

        const tempAsBigInt = BigInt(data.current.temperature_2m * 10**18);
        console.log( '* I * handleResponse * tempAsBigInt', tempAsBigInt);
    }
    
}
