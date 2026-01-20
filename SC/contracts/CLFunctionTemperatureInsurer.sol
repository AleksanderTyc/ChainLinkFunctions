// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {
    FunctionsClient
} from "@chainlink/contracts@1.5.0/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

import {
    FunctionsRequest
} from "@chainlink/contracts@1.5.0/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {
    ConfirmedOwner
} from "@chainlink/contracts@1.5.0/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here:
 * https://docs.chain.link/resources/link-token-contracts/
 */

/**
 * @title GettingStartedFunctionsConsumer
 * @notice This is an example contract to show how to make HTTP requests using Chainlink
 * @dev This contract uses hardcoded values and should not be used in production.
 */
contract CLFunctionTemperatureInsurer is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        uint256 temperature,
        bytes response,
        bytes err
    );

    // Adverse event temperature threshold
    uint256 public adverseTemperature;

    // Event to record adverse event
    event Adverse(address indexed sender, uint256 temperature);

    // Router address - Hardcoded for Sepolia
    // Check to get the router address for your supported network
    // https://docs.chain.link/chainlink-functions/supported-networks
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    // JavaScript source code
    // Fetch character name from the Star Wars API.
    // Documentation: https://swapi.info/people
    string source =
        "const lat = args[0] === undefined ? 53.122261976193464 : Number(args[0]);"
        "const lng = args[1] === undefined ? 17.99897582348337 : Number(args[1]);"
        "const req = await Functions.makeHttpRequest({"
        " url: `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m`"
        " });"
        "if (req.error) {"
        "    throw new Error(`* E * makeHttpRequest, error ${req.error}`);"
        "} else {"
        "    return Functions.encodeUint256(BigInt(Math.floor(1000*(274+req.data.current.temperature_2m))) * 10n ** 15n);"
        "}";

    //Callback gas limit
    uint32 gasLimit = 300_000;

    // donID - Hardcoded for Sepolia
    // Check to get the donID for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // State variable to store the returned temperature information
    uint256 public temperature;

    /**
     * @notice Initializes the contract with the Chainlink router address and sets the contract owner
     */
    constructor(
        uint256 _adverseTemperature
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        adverseTemperature = _adverseTemperature;
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        temperature = abi.decode(response, (uint256));
        if (
            (claimStatus == 1) &&
            (temperature < adverseTemperature) &&
            (err.length == 0)
        ) {
            claimStatus = 2;
            emit Adverse(msg.sender, temperature);
        }

        s_lastError = err;

        // Emit an event to log the response
        emit Response(requestId, temperature, s_lastResponse, s_lastError);
    }

    uint256 public claimStatus;

    address public insured;
    string public latitude;
    string public longitude;

    function insure(
        string calldata _latitude,
        string calldata _longitude
    ) public payable {
        require(msg.value > 0, "E14: Zero premium");
        require(bytes(_latitude).length > 0, "E12: Insured latitude empty");
        require(bytes(_longitude).length > 0, "E13: Insured longitude empty");
        require(msg.sender != owner(), "E11: Insured is Owner");

        insured = msg.sender;
        claimStatus = 1;
        latitude = _latitude;
        longitude = _longitude;
    }

    function setAdverseTemperature(
        uint256 _adverseTemperature
    ) public onlyOwner {
        adverseTemperature = _adverseTemperature;
    }

    function setClaimStatus(uint256 _claimStatus) public onlyOwner {
        claimStatus = _claimStatus;
        emit Adverse(msg.sender, temperature);
    }

    function claim() public {
        require(msg.sender == insured, "E31: Only Insured can claim");
        require(claimStatus >= 2, "E32: No claim available");

        (bool result, ) = insured.call{value: address(this).balance}("");
        if (result) {
            result;
        }
        claimStatus = 0;
    }

    function resetContract() public onlyOwner {
        adverseTemperature = 272 * 10 ** 18;
        claimStatus = 0;
        insured = address(0);
        latitude = "";
        longitude = "";
    }
}

/*
// Check if latitude or longitude are missing. Set to default if so.
// lat: 53.122261976193464, lng: 17.99897582348337
const lat = args[0] === undefined ? 53.122261976193464 : Number(args[0]);
const lng = args[1] === undefined ? 17.99897582348337 : Number(args[1]);

console.log(`* I * lat is ${lat}, type ${typeof lat}`);
console.log(`* I * lng is ${lng}, type ${typeof lng}`);

// Make an HTTP request to the open-meteo API with the parameters
const req = await Functions.makeHttpRequest({ url: `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m` });

if (req.error) {
    throw new Error(`* E * makeHttpRequest, error ${req.error}`);
} else {
    const data = req.data;
    // console.log( '* I * handleResponse * data', data);
    console.log('* I * handleResponse * data.latitude', data.latitude);
    console.log('* I * handleResponse * data.longitude', data.longitude);
    console.log('* I * handleResponse * data.time', data.current.time);
    console.log('* I * handleResponse * data.temperature_2m', data.current.temperature_2m);

    const tempAsBigInt = BigInt(Math.floor(1000*(274+data.current.temperature_2m))) * 10n ** 15n;
    console.log('* I * handleResponse * tempAsBigInt', tempAsBigInt);
    // return Functions.encodeString(tempAsBigInt);
    // return Functions.encodeUint256(tempAsBigInt);
    return Functions.encodeUint256(BigInt(Math.floor(1000*(274+data.current.temperature_2m))) * 10n ** 15n);
}
// Moscow
* I * handleResponse * data.latitude 55.75
* I * handleResponse * data.longitude 37.625
* I * handleResponse * data.time 2026-01-15T17:30
* I * handleResponse * data.temperature_2m -9.9
* I * handleResponse * tempAsBigInt 264_100_000_000_000_000_000n
// New York
* I * lat is 40.7127, type number
* I * lng is -74, type number
* I * handleResponse * data.latitude 40.710335
* I * handleResponse * data.longitude -73.99308
* I * handleResponse * data.time 2026-01-15T20:30
* I * handleResponse * data.temperature_2m 1.5
* I * handleResponse * tempAsBigInt 275_500_000_000_000_000_000n
// Bydgoszcz
* I * lat is 53.122261976193464, type number
* I * lng is 17.99897582348337, type number
* I * handleResponse * data.latitude 53.12
* I * handleResponse * data.longitude 17.999998
* I * handleResponse * data.time 2026-01-15T20:30
* I * handleResponse * data.temperature_2m 0.1
* I * handleResponse * tempAsBigInt 274_100_000_000_000_000_000n
*/
