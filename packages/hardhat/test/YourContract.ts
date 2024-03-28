import { Token, Token__factory } from "../typechain-types";
import { expect } from "chai";
import { parseEther } from "ethers";
import { ethers } from "hardhat";

describe("YourContract", function () {
  let yourContract: Token;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = new Token__factory(owner);
    yourContract = await yourContractFactory.deploy("Barabula", "BULA", parseEther("1000"), parseEther("1"), true);
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await yourContract.name()).to.equal("Barabula");
    });
  });
});
