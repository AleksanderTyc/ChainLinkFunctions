/*
Rubbish, requires module
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

import SimpleCounterModule from "../ignition/modules/SimpleCounter.js";
*/

const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require('hardhat');

const SimpleCounterModule = require('../ignition/modules/SimpleCounter.js');

describe("SimpleCounter", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySimpleCounterFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    // const SimpleCounter = await hre.ethers.getContractFactory("SimpleCounter");
    // const contractSimpleCounter = await SimpleCounter.deploy();
    const { contractSimpleCounter } = await hre.ignition.deploy(SimpleCounterModule);

    return { contractSimpleCounter, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the counter to 0 (zero) initially", async function () {
      const { contractSimpleCounter, owner, otherAccount } = await loadFixture(deploySimpleCounterFixture);
      expect(await contractSimpleCounter.currentCount()).to.equal(0);
    });
  });

  describe("Counter Increase", function () {
    it("Should set the counter to 1 (one) after the increase function is called", async function () {
      let tx = null;
      let miningResult = null;
      const { contractSimpleCounter, owner, otherAccount } = await loadFixture(deploySimpleCounterFixture);

      // initiate the transaction - deploy salted wallet contract
      tx = await contractSimpleCounter.increase();
      // wait until mined
      miningResult = await tx.wait();

      expect(await contractSimpleCounter.currentCount()).to.equal(1);
    });

    it("Should set the counter to 1 (one) after the increase function is called by other wallet", async function () {
      let tx = null;
      let miningResult = null;
      const { contractSimpleCounter, owner, otherAccount } = await loadFixture(deploySimpleCounterFixture);

      // initiate the transaction - deploy salted wallet contract
      tx = await contractSimpleCounter.connect(otherAccount).increase();
      // wait until mined
      miningResult = await tx.wait();

      expect(await contractSimpleCounter.currentCount()).to.equal(1);
    });
  });

});
