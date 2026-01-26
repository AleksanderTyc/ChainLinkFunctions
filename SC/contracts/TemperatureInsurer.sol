// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
@title Insurance contract, allows insured wallet to claim damage if recorded temperature drops below defined level
@author Aleks Tyc
@notice This is not a proper insurance contract.
@notice It does not implement portfolio of insured wallets (risk sharing), or risk pricing mechanisms.
@dev Implemented and tested for the purpose of porting into ChainLink Functions and Automation mechanisms.
*/
contract TemperatureInsurer {
    address public owner;
    uint256 public adverseTemperature;

    address public insured;
    string public latitude;
    string public longitude;

    uint256 public temperature;
    uint256 public claimStatus;

    /// @notice Emitted when adverse event occurs (current temperature drops below adverseTemperature)
    event Adverse(address indexed sender, uint256 temperature);

    constructor(uint256 _adverseTemperature, uint256 _temperature) {
        owner = msg.sender;
        adverseTemperature = _adverseTemperature;
        temperature = _temperature;
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

    // This is wrong - the contract should always allow updating current temperature, but...
    // it should only change status if current status is 1. This should not be a requirement, just a piece of logic.
    /// @dev obsolete, to be replaced with setTemperature and deleted
    /*
    function setClaim(uint256 _temperature) public {
        require(
            claimStatus == 1,
            "E22: Claim Status must be 1 when calling setClaim"
        );
        require(msg.sender == owner, "E21: Only Owner allowed to setClaim");
        temperature = _temperature;
        if (_temperature < adverseTemperature) {
            claimStatus = 2;
            emit Adverse(msg.sender, _temperature);
        }
    }
*/
    /**
        @notice acquire current temperature and derive claimStatus as appropriate
        @notice only Owner allowed to call
        @param _temperature new current temperature
    */
    function setTemperature(uint256 _temperature) public {
        require(msg.sender == owner, "E21: Only Owner allowed to setClaim");
        temperature = _temperature;
        if ((claimStatus == 1) && (_temperature < adverseTemperature)) {
            claimStatus = 2;
            emit Adverse(msg.sender, _temperature);
        }
    }

    function setAdverseTemperature(uint256 _adverseTemperature) public {
        require(
            msg.sender == owner,
            "E42: Only Owner allowed to call setAdverseTemperature"
        );
        adverseTemperature = _adverseTemperature;
    }

    function setClaimStatus(uint256 _claimStatus) public {
        require(
            msg.sender == owner,
            "E41: Only Owner allowed to call setClaimStatus"
        );
        claimStatus = _claimStatus;
    }

    function claim() public {
        require(msg.sender == insured, "E31: Only Insured can claim");
        require(claimStatus == 2, "E32: No claim available");

        (bool result, ) = insured.call{value: address(this).balance}("");
        if (result) {
            result;
        }
        adverseTemperature = 272 * 10 ** 18;
        claimStatus = 0;
        insured = address(0);
        latitude = "";
        longitude = "";
    }

    function resetContract() public {
        require(
            msg.sender == owner,
            "E51: Only Owner allowed to call resetContract"
        );
        (bool result, ) = owner.call{value: address(this).balance}("");
        if (result) {
            result;
        }
        adverseTemperature = 272 * 10 ** 18;
        temperature = (274 + 18) * 10 ** 18;
        claimStatus = 0;
        insured = address(0);
        latitude = "";
        longitude = "";
    }
}
