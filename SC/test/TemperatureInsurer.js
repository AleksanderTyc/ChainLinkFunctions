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
    });
    describe("Setting a claim", function () {
        let tx = null;
        let miningResult = null;

        it("S1. Only owner (first HardHat wallet) can set the claim", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);
            await expect(contractTemperatureInsurer.connect(otherAccount).setClaim(276n * 10n ** 18n)).to.be.revertedWith("E21: Only Owner allowed to setClaim");
        });
        it("S3. Setting the claim above adverse temperature does not change the claimStatus (i.e. stays at 1)", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaim(276n * 10n ** 18n);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(1);
        });
        it("S5. Setting the claim below adverse temperature sets claimStatus to 2", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            // initiate the transaction
            tx = await contractTemperatureInsurer.connect(owner).setClaim(256n * 10n ** 18n);
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractTemperatureInsurer.claimStatus()).to.equal(2);
        });
        it("S4. Setting the claim above adverse temperature does not emit event", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            await expect(contractTemperatureInsurer.connect(owner).setClaim(276n * 10n ** 18n))
                .to.not.emit(contractTemperatureInsurer, "Adverse");
        });
        it("S6. Setting the claim below adverse temperature emits event", async function () {
            const { contractTemperatureInsurer, owner, otherAccount } = await loadFixture(insureTemperatureInsurerFixture);

            await expect(contractTemperatureInsurer.connect(owner).setClaim(266n * 10n ** 18n))
                .to.emit(contractTemperatureInsurer, "Adverse")
                .withArgs(owner.address, 266n * 10n ** 18n);
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
            const balanceDiffCheck = (balanceBefore - balanceAfter - 11n * 10n ** 17n) < 10n ** 15n;

            expect(balanceDiffCheck).to.be.true;
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
