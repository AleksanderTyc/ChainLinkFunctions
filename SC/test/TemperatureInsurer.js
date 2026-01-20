const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require('hardhat');

const TemperatureInsurerModule = require('../ignition/modules/TemperatureInsurer.js');

describe("TemperatureInsurer", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployTemperatureInsurerFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        // const TemperatureInsurer = await hre.ethers.getContractFactory("TemperatureInsurer");
        // const contractTemperatureInsurer = await TemperatureInsurer.deploy();
        const { contractTemperatureInsurer } = await hre.ignition.deploy(TemperatureInsurerModule);

        return { contractTemperatureInsurer, owner, otherAccount };
    }

    async function insureTemperatureInsurerFixture() {
        let tx = null;
        let miningResult = null;
        const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

        // initiate the transaction
        tx = await contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
        // wait until mined
        miningResult = await tx.wait();

        return { contractTemperatureInsurer, owner, otherAccount };
    }

    async function claimTemperatureInsurerFixture() {
        let tx = null;
        let miningResult = null;
        const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

        // initiate the transaction
        tx = await contractTemperatureInsurer.connect(owner).setClaim(266n * 10n ** 18n);
        // wait until mined
        miningResult = await tx.wait();

        return { contractTemperatureInsurer, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("D1. Should set owner to owner (first HardHat wallet)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            expect(await contractTemperatureInsurer.owner()).to.equal(owner.address);
        });
        it("D2. Should set claimStatus to 0 (zero)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            expect(await contractTemperatureInsurer.claimStatus()).to.equal(0);
        });
    });

    describe("Insurance", function () {
        let tx = null;
        let miningResult = null;

        it("I1. Insured cannot be owner", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(owner).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E11: Insured is Owner");
        });
        it("I2. Premium must be positive", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337")).to.be.revertedWith("E14: Zero premium");
        });
        it("I3. Latitude cannot be empty", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).insure("", "17.99897582348337", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E12: Insured latitude empty");
        });
        it("I4. Longitude cannot be empty", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E13: Insured longitude empty");
        });
        it("I5. claimStatus must be set to 1", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(1);
        });
        it("I6. Insured must be set to caller", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.insured()).to.equal(otherAccount.address);
        });
        it("I7. Latitude must be set accordingly", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.latitude()).to.equal("53.122261976193464");
        });
        it("I8. Longitude must be set accordingly", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.longitude()).to.equal("17.99897582348337");
        });
        it("I9. Only owner (first HardHat wallet) can force-set adverse temperature", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).setAdverseTemperature(102)).to.be.revertedWith("E42: Only Owner allowed to call setAdverseTemperature");
        });
        it("I10. Calling setAdverseTemperature(102) sets claim status to 102", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setAdverseTemperature(102);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.adverseTemperature()).to.equal(102);
        });
    });
    describe("Setting a claim", function () {
        let tx = null;
        let miningResult = null;

        it("S1. Only owner (first HardHat wallet) can set the claim", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).setClaim((274n+2n) * 10n ** 18n)).to.be.revertedWith("E21: Only Owner allowed to setClaim");
        });
        it("S2. Setting the claim requires the contract to be insured (claimStatus == 1)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(deployTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(owner).setClaim((274n+2n) * 10n ** 18n)).to.be.revertedWith("E22: Claim Status must be 1 when calling setClaim");
        });
        it("S3. Setting the claim above adverse temperature does not change the claimStatus (i.e. stays at 1)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaim((274n+2n) * 10n ** 18n);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(1);
        });
        it("S5. Setting the claim below adverse temperature sets claimStatus to 2", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaim((274n-18n) * 10n ** 18n);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(2);
        });
        it("S4. Setting the claim above adverse temperature does not emit event", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            await expect(contractTemperatureInsurer.connect(owner).setClaim((274n+2n) * 10n ** 18n))
                .to.not.emit(contractTemperatureInsurer, "Adverse");
        });
        it("S6. Setting the claim below adverse temperature emits event", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            await expect(contractTemperatureInsurer.connect(owner).setClaim((274n-8n) * 10n ** 18n))
                .to.emit(contractTemperatureInsurer, "Adverse")
                .withArgs(owner.address, 266n * 10n ** 18n);
        });
        it("S7. Setting the claim records temperature", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaim((274n+28n) * 10n ** 18n);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.temperature()).to.equal((274n+28n) * 10n ** 18n);
        });
        it("S11. Only owner (first HardHat wallet) can force-set claim status", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).setClaimStatus(101)).to.be.revertedWith("E41: Only Owner allowed to call setClaimStatus");
        });
        it("S12. Calling setClaimStatus(101) sets claim status to 101", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaimStatus(101);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(101);
        });
    });
    describe("Claiming", function () {
        let tx = null;
        let miningResult = null;

        it("C1. Attempt to claim prematurely fails (claimStatus must be set to 2)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).claim()).to.be.revertedWith("E32: No claim available");
        });
        it("C2. Only insured (second HardHat wallet) can claim", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(claimTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(owner).claim()).to.be.revertedWith("E31: Only Insured can claim");
        });
        it("C3. Claim is paid to Insured wallet", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(claimTemperatureInsurerFixture);

            const balanceBefore = await ethers.provider.getBalance(otherAccount.address);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(otherAccount).claim();
            // wait until mined
            miningResult = await tx.wait();
            const balanceAfter = await ethers.provider.getBalance(otherAccount.address);
            const balanceDiffCheck = ((-1n) * 10n ** 14n < (balanceAfter - balanceBefore - 11n * 10n ** 17n)) && ((balanceAfter - balanceBefore - 11n * 10n ** 17n) < 10n ** 14n);
            const balanceDiff = balanceAfter - balanceBefore - 11n * 10n ** 17n;
            console.log(`
* C3 * balanceBefore ${balanceBefore}
     * balanceAfter  ${balanceAfter}
     * balanceDiff          ${balanceDiff}
     * balanceComp          ${10n ** 14n}
*    * balanceDiffCheck ${balanceDiffCheck}`);
                
            expect(balanceDiffCheck).to.be.true;
        });
    });
    describe("Resetting the contract", function () {
        let tx = null;
        let miningResult = null;

        it("R1. Only owner (first HardHat wallet) can reset the contract", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).resetContract()).to.be.revertedWith("E51: Only Owner allowed to call resetContract");
        });
        it("R2. Upon reset, premium is transferred to owner (first HardHat wallet)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            const balanceBefore = await ethers.provider.getBalance(owner.address);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            const balanceDiff = balanceAfter - balanceBefore - 11n * 10n ** 17n;
            const balanceDiffCheck = ((-1n) * 10n ** 14n < (balanceAfter - balanceBefore - 11n * 10n ** 17n)) && ((balanceAfter - balanceBefore - 11n * 10n ** 17n) < 10n ** 14n);
            console.log(`
* R2 * balanceBefore ${balanceBefore}
     * balanceAfter  ${balanceAfter}
     * balanceDiff          ${balanceDiff}
     * balanceComp          ${10n ** 14n}
*    * balanceDiffCheck ${balanceDiffCheck}`);

            expect(balanceDiffCheck).to.be.true;
        });
        it("R3. Upon reset, claim status is set to 0", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(0);
        });
        it("R4. Upon reset, insured is set to address(0)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.insured()).to.equal("0x0000000000000000000000000000000000000000");
        });
        it("R5. Upon reset, adverseTemperature is set to 272E+18 (i.e. -2C)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.adverseTemperature()).to.equal((274n-2n) * 10n ** 18n);
        });
        it("R6. Upon reset, latitude is set to empty", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.latitude()).to.equal("");
        });
        it("R7. Upon reset, longitude is set to empty", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.longitude()).to.equal("");
        });
        it("R8. Upon reset, temperature is set to 0", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).resetContract();
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.temperature()).to.equal(0);
        });
    });
});

/* Test for event emitted
  it("Should emit MyEventWithData", async function () {
    const EventEmitter = await ethers.getContractFactory("EventEmitter");
    const eventEmitter = await EventEmitter.deploy();
    await eventEmitter.deployed();

    await expect(eventEmitter.emitMyEventWithData(42, "foo"))
      .to.emit(eventEmitter, "MyEventWithData")
      .withArgs(42, "foo");
  });
https://ethereum.stackexchange.com/questions/110004/testing-for-emitted-events-in-hardhat
*/

/*
* C3 * balanceBefore 9_998_899_795_867_389_688_556
     * balanceAfter  9_999_999_746_603_967_702_592
     * balanceDiff      -2_199_950_736_578_014_036
     * balanceComp         1000000000000000
*    * balanceDiffCheck false
      1) C3. Claim is paid to Insured wallet
    Resetting the contract
      ✔ R1. Only owner (first HardHat wallet) can reset the contract

* R2 * balanceBefore 9_999_997_437_280_000_000_000
     * balanceAfter  9_999_997_374_084_731_236_260
     * balanceDiff      -1_099_936_804_731_236_260
     * balanceComp         1000000000000000
*    * balanceDiffCheck false
      2) R2. Upon reset, premium is transferred to owner (first HardHat wallet)
*/
