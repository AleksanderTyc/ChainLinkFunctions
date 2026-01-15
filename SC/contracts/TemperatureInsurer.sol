// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TemperatureInsurer {
    address public owner;
    uint256 public adverseTemperature;
    uint256 public claimStatus;

    address public insured;
    string public latitude;
    string public longitude;

    // Event to record adverse event
    event Adverse(address indexed sender, uint256 temperature);

    constructor(uint256 _adverseTemperature) {
        owner = msg.sender;
        adverseTemperature = _adverseTemperature;
    }

    function insure(
        string calldata _latitude,
        string calldata _longitude
    ) public payable {
        require(msg.value > 0, "E14: Zero premium");
        require(bytes(_latitude).length > 0, "E12: Insured latitude empty");
        require(bytes(_longitude).length > 0, "E13: Insured longitude empty");
        require(msg.sender != owner, "E11: Insured is Owner");

        insured = msg.sender;
        claimStatus = 1;
        latitude = _latitude;
        longitude = _longitude;
    }

    function setClaim(uint256 _temperature) public {
        require(msg.sender == owner, "E21: Only Owner allowed to setClaim");
        if (_temperature < adverseTemperature) {
            claimStatus = 2;
            emit Adverse(msg.sender, _temperature);
        }
    }

    function claim() public {
        require(msg.sender == insured, "E31: Only Insured can claim");
        require(claimStatus == 2, "E32: No claim available");

        (bool result, ) = insured.call{value: address(this).balance}("");
        if (result) {
            result;
        }
        claimStatus = 0;
    }
}
