const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require('hardhat');

const SimpleInsurerModule = require('../ignition/modules/SimpleInsurer.js');

describe("SimpleInsurer", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploySimpleInsurerFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        // const SimpleInsurer = await hre.ethers.getContractFactory("SimpleInsurer");
        // const contractSimpleInsurer = await SimpleInsurer.deploy();
        const { contractSimpleInsurer } = await hre.ignition.deploy(SimpleInsurerModule);

        return { contractSimpleInsurer, owner, otherAccount };
    }

    async function insureSimpleInsurerFixture() {
        let tx = null;
        let miningResult = null;
        const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);

        // initiate the transaction - deploy salted wallet contract
        tx = await contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
        // wait until mined
        miningResult = await tx.wait();

        return { contractSimpleInsurer, owner, otherAccount };
    }

    async function claimSimpleInsurerFixture() {
        let tx = null;
        let miningResult = null;
        const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(insureSimpleInsurerFixture);

        // initiate the transaction - deploy salted wallet contract
        tx = await contractSimpleInsurer.connect(owner).setClaim(2);
        // wait until mined
        miningResult = await tx.wait();

        return { contractSimpleInsurer, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("D1. Should set owner to owner (first HardHat wallet)", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            expect(await contractSimpleInsurer.owner()).to.equal(owner.address);
        });
        it("D2. Should set claimStatus to 0 (zero)", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            expect(await contractSimpleInsurer.claimStatus()).to.equal(0);
        });
    });

    describe("Insurance", function () {
        let tx = null;
        let miningResult = null;

        it("I1. Insured cannot be owner", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            await expect(contractSimpleInsurer.connect(owner).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E11: Insured is Owner");
        });
        it("I2. Premium must be positive", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            await expect(contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337")).to.be.revertedWith("E14: Zero premium");
        });
        it("I3. Latitude cannot be empty", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            await expect(contractSimpleInsurer.connect(otherAccount).insure("", "17.99897582348337", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E12: Insured latitude empty");
        });
        it("I4. Longitude cannot be empty", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);
            await expect(contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "", { value: ethers.parseEther("1.1") })).to.be.revertedWith("E13: Insured longitude empty");
        });
        it("I5. claimStatus must be set to 1", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);

            // initiate the transaction - deploy salted wallet contract
            tx = await contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractSimpleInsurer.claimStatus()).to.equal(1);
        });
        it("I6. Insured must be set to caller", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);

            // initiate the transaction - deploy salted wallet contract
            tx = await contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractSimpleInsurer.insured()).to.equal(otherAccount.address);
        });
        it("I7. Latitude must be set accordingly", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);

            // initiate the transaction - deploy salted wallet contract
            tx = await contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractSimpleInsurer.latitude()).to.equal("53.122261976193464");
        });
        it("I8. Longitude must be set accordingly", async function () {
            const { contractSimpleInsurer, owner, otherAccount } = await loadFixture(deploySimpleInsurerFixture);

            // initiate the transaction - deploy salted wallet contract
            tx = await contractSimpleInsurer.connect(otherAccount).insure("53.122261976193464", "17.99897582348337", { value: ethers.parseEther("1.1") });
            // wait until mined
            miningResult = await tx.wait();

            expect(await contractSimpleInsurer.longitude()).to.equal("17.99897582348337");
        });
    });
});
