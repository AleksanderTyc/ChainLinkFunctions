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

async function getBalance(walletAddress) {
    const dtNow = new Date();
    console.log(`D1111 * ${dtNow.toISOString().substring(11, 23)} * getBalance * walletAddress ${walletAddress}`);
    try {
        const primitiveValue = await window.ethereum.request(
            {
                method: "eth_getBalance",
                params: [walletAddress]
            }
        );
        const formattedValue = ethers.formatEther(primitiveValue);
        return formattedValue;
    }
    catch (err) {
        const dtNow = new Date();
        console.log(`D1129 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * error *`, err);
        throw new Error(`* E * ABIGetter * eth_call * ${err.message}`);
    }
}

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
        const dtNow = new Date();
        console.log(`D1029 * ${dtNow.toISOString().substring(11, 23)} * ABIGetter * error *`, err);
        throw new Error(`* E * ABIGetter * eth_call * ${err.message}`);
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

function cSetClaimStatus(contractAddress, cStatus = 2) {
    const item = TemperatureInsurer_ABI.find(contractFunction => 'call_setClaimStatus' === contractFunction.callSign);

    return new Promise((resolve, reject) => {
        try {
            const cdr = ethers.AbiCoder.defaultAbiCoder();
            const encodedData = cdr.encode(['uint256'], [cStatus]).substring(2);
            resolve(window.ethereum.request(
                {
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: window.ethereum.selectedAddress,
                            to: contractAddress,
                            data: item.evmSignature + encodedData
                            /*
                            > cdr.encode(['uint256'],[1]);
                            '0x4785920d0000000000000000000000000000000000000000000000000000000000000001'
                            > cdr.encode(['uint256'],[272400000000000000000n]);
                            '0x00000000000000000000000000000000000000000000000ec44f34c350680000'
                            > cdr.encode(['string'],['53.122261976193464']);
                            '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001235332e3132323236313937363139333436340000000000000000000000000000'
                            -- i.e. 0x
                            0000000000000000000000000000000000000000000000000000000000000020
                            0000000000000000000000000000000000000000000000000000000000000012
                            35332e3132323236313937363139333436340000000000000000000000000000
                            > cdr.encode(['string', 'string'],['53.122261976193464', '17.123']);
                            '0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001235332e3132323236313937363139333436340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000631372e3132330000000000000000000000000000000000000000000000000000'
                            -- i.e. 0x
                            0000000000000000000000000000000000000000000000000000000000000040
                            0000000000000000000000000000000000000000000000000000000000000080
                            0000000000000000000000000000000000000000000000000000000000000012
                            35332e3132323236313937363139333436340000000000000000000000000000
                            0000000000000000000000000000000000000000000000000000000000000006
                            31372e3132330000000000000000000000000000000000000000000000000000'
                            */
                            // chainId: "0x7a69" // 31337 HardHat
                        }]

                }
            ));
        }
        catch (err) {
            reject(err);
        }
    }
    );
}

function cClaim(contractAddress) {
    const item = TemperatureInsurer_ABI.find(contractFunction => 'call_claim' === contractFunction.callSign);

    const dtNow = new Date();
    console.log(`D1121 * ${dtNow.toISOString().substring(11, 23)} * cClaim * selectedAddress ${window.ethereum.selectedAddress}`);

    return new Promise((resolve, reject) => {
        try {
            resolve(window.ethereum.request(
                {
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: window.ethereum.selectedAddress,
                            to: contractAddress,
                            data: item.evmSignature
                            // chainId: "0x7a69" // 31337 HardHat
                        }]
                }
            ));
        }
        catch (err) {
            reject(err);
        }
    }
    );
}

export {
    ABIGetter,
    getBalance,
    cSetClaimStatus,
    cClaim
};
