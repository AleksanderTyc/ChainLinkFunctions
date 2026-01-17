import { ethers } from "ethers";

/* Signatures
https://rareskills.io/post/abi-encoding
const s1currentCount = 'currentCount()';
ethers.id(s1currentCount).substring(0,10);
-- 0xc732d201
const s2increase = 'increase()';
ethers.id(s2increase).substring(0,10);
-- 0xe8927fbc
https://ethereum.stackexchange.com/questions/119583/when-to-use-abi-encode-abi-encodepacked-or-abi-encodewithsignature-in-solidity
*/
const TemperatureInsurer_ABI = [
    {
        solSignature: "function owner() public view returns (string)",
        callSign: "get_owner",
        returns: "address",
        evmSignature: ethers.id("owner()").substring(0, 10)
    },
    {
        solSignature: "function adverseTemperature() public view returns (uint256)",
        callSign: "get_adverseTemperature",
        returns: "uint256",
        evmSignature: ethers.id("adverseTemperature()").substring(0, 10)
    },
    {
        solSignature: "function claimStatus() public view returns (uint256)",
        callSign: "get_claimStatus",
        returns: "uint256",
        evmSignature: ethers.id("claimStatus()").substring(0, 10)
    },
    {
        solSignature: "function insured() public view returns (string)",
        callSign: "get_insured",
        returns: "address",
        evmSignature: ethers.id("insured()").substring(0, 10)
    },
    {
        solSignature: "function latitude() public view returns (string)",
        callSign: "get_latitude",
        returns: "string",
        evmSignature: ethers.id("latitude()").substring(0, 10)
    },
    {
        solSignature: "function longitude() public view returns (string)",
        callSign: "get_longitude",
        returns: "string",
        evmSignature: ethers.id("longitude()").substring(0, 10)
    },

    {
        solSignature: "function insure(string calldata,string calldata) public payable",
        callSign: "call_insure",
        evmSignature: ethers.id("insure(string calldata,string calldata)").substring(0, 10)
    },
    {
        solSignature: "function setClaim(uint256) public",
        callSign: "call_setClaim",
        evmSignature: ethers.id("setClaim(uint256)").substring(0, 10)
    },
    {
        solSignature: "function setAdverseTemperature(uint256) public",
        callSign: "call_setAdverseTemperature",
        evmSignature: ethers.id("setAdverseTemperature(uint256)").substring(0, 10)
    },
    {
        solSignature: "function setClaimStatus(uint256) public",
        callSign: "call_setClaimStatus",
        evmSignature: ethers.id("setClaimStatus(uint256)").substring(0, 10)
    },
    {
        solSignature: "function claim() public",
        callSign: "call_claim",
        evmSignature: ethers.id("claim()").substring(0, 10)
    }
];

async function ABIGetter(contractAddress, functionCallSign) {
    const dtNow = new Date();
    console.log(`D1011 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * contractAddress ${contractAddress}`);
    console.log(`D1012 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * functionCallSign ${functionCallSign}`);
    const item = TemperatureInsurer_ABI.find(contractFunction => functionCallSign === contractFunction.callSign);
    try {
        const primitiveValue = await window.ethereum.request(
            {
                method: "eth_call",
                params: [
                    {
                        to: contractAddress,
                        data: item.evmSignature
                    }]
            }
        );
        const cdr = ethers.AbiCoder.defaultAbiCoder();
        const dtNow = new Date();
        console.log(`D1021 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * Promise * cdr ${typeof cdr}`);
        console.log(`D1022 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * Promise * item.returns ${item.returns}`);
        const decodedValue = item.returns.startsWith("uint") ?
            BigInt(primitiveValue)
            : cdr.decode([item.returns], primitiveValue)[0];
        console.log(`D1023 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * Promise * decodedValue ${decodedValue}, ${typeof decodedValue}`);
        return decodedValue;
    }
    catch (err) {
        throw new Error("");
    }
}

function ABIGetter_sync(contractAddress, functionCallSign) {
    const dtNow = new Date();
    console.log(`D1011 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * contractAddress ${contractAddress}`);
    console.log(`D1012 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * functionCallSign ${functionCallSign}`);
    const item = TemperatureInsurer_ABI.find(contractFunction => functionCallSign === contractFunction.callSign);
    return new Promise((resolve, reject) => {
        try {
            const primitiveValue = window.ethereum.request(
                {
                    method: "eth_call",
                    params: [
                        {
                            to: contractAddress,
                            data: item.evmSignature
                        }]
                }
            );
            const cdr = ethers.AbiCoder.defaultAbiCoder();
            const dtNow = new Date();
            console.log(`D1021 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * Promise * cdr ${typeof cdr}`);
            console.log(`D1022 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * Promise * item.returns ${item.returns}`);
            const diag1 = cdr.decode(['address'], primitiveValue);
            // const decodedValue = item.returns.startsWith("uint") ?
            //     BigInt(primitiveValue)
            //     : cdr.decode([item.returns], primitiveValue)[0];
            // resolve(decodedValue);
            resolve(primitiveValue);
        }
        catch (err) {
            reject(err);
        }
    });
}

export {
    ABIGetter
};
