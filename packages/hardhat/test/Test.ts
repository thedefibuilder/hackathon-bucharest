import { PreSale, PreSale__factory, Token, Token__factory } from "../typechain-types";
import { getContractAddress } from "@ethersproject/address";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import { ethers } from "hardhat";

export async function deployEverythingFixture() {
  const [owner] = await ethers.getSigners();
  const tokenFactory = new Token__factory(owner);
  const token = await tokenFactory.deploy("Barabula", "BULA", parseEther("1000"), parseEther("1000"), true);
  const paymentToken = await tokenFactory.deploy("Barabula", "BULA", parseEther("1000"), parseEther("1000"), true);

  const startTime = await ethers.provider.getBlock("latest").then(block => BigInt(block!.timestamp));
  const endTime = startTime + BigInt(60 * 60 * 24 * 7); // 7 days
  const offeringSupply = parseEther("1000");
  const offeringPrice = parseEther("0.5");
  const minParticipationAmount = parseEther("0.1");
  const maxParticipationAmount = parseEther("1");
  const sablierLockupLinear = "0x483bdd560dE53DC20f72dC66ACdB622C5075de34";
  const sablierBatch = "0x72D921E579aB7FC5D19CD398B6be24d626Ccb6e7";
  const cliffDuration = BigInt(60 * 60 * 24 * 7); // 7 days
  const vestingDuration = BigInt(60 * 60 * 24 * 30); // 30 days

  const presaleAddress = getContractAddress({
    from: owner.address,
    nonce: (await owner.getNonce()) + 1,
  });

  await token.approve(presaleAddress, offeringSupply);

  const preSaleFactory = new PreSale__factory(owner);
  const preSale = await preSaleFactory.deploy(
    {
      token: await token.getAddress(),
      paymentToken: await paymentToken.getAddress(),
      startTime,
      endTime,
      supply: offeringSupply,
      price: offeringPrice,
      minParticipationAmount,
      maxParticipationAmount,
    },
    { sablierLockupLinear, sablierBatch, cliffDuration, vestingDuration },
  );

  return {
    token,
    paymentToken,
    preSale,
    startTime,
    endTime,
    offeringSupply,
    offeringPrice,
    minParticipationAmount,
    maxParticipationAmount,
    sablierLockupLinear,
    sablierBatch,
    cliffDuration,
    vestingDuration,
  };
}

describe("Tests", function () {
  let token: Token;
  let paymentToken: Token;
  let preSale: PreSale;

  let startTime: bigint;
  let endTime: bigint;
  let offeringSupply: bigint;
  let offeringPrice: bigint;
  let minParticipationAmount: bigint;
  let maxParticipationAmount: bigint;
  let sablierLockupLinear: string;
  let sablierBatch: string;
  let cliffDuration: bigint;
  let vestingDuration: bigint;

  beforeEach(async () => {
    const fixture = await loadFixture(deployEverythingFixture);

    token = fixture.token;
    paymentToken = fixture.paymentToken;
    preSale = fixture.preSale;
    startTime = fixture.startTime;
    endTime = fixture.endTime;
    offeringSupply = fixture.offeringSupply;
    offeringPrice = fixture.offeringPrice;
    minParticipationAmount = fixture.minParticipationAmount;
    maxParticipationAmount = fixture.maxParticipationAmount;
    sablierLockupLinear = fixture.sablierLockupLinear;
    sablierBatch = fixture.sablierBatch;
    cliffDuration = fixture.cliffDuration;
    vestingDuration = fixture.vestingDuration;
  });

  describe("Deployment", function () {
    it("Should have the right name on deploy", async function () {
      expect(await token.name()).to.equal("Barabula");
    });

    it("Should deploy presale", async function () {
      expect(await preSale.offeringToken()).to.equal(await token.getAddress());
      expect(await preSale.paymentToken()).to.equal(await paymentToken.getAddress());
      expect(await preSale.startTime()).to.equal(startTime);
      expect(await preSale.endTime()).to.equal(endTime);
      expect(await preSale.offeringSupply()).to.equal(offeringSupply);
      expect(await preSale.offeringPrice()).to.equal(offeringPrice);
      expect(await preSale.minParticipationAmount()).to.equal(minParticipationAmount);
      expect(await preSale.maxParticipationAmount()).to.equal(maxParticipationAmount);
      expect(await preSale.sablierBatch()).to.equal(sablierBatch);
      expect(await preSale.sablierLockupLinear()).to.equal(sablierLockupLinear);
      expect(await preSale.cliffDuration()).to.equal(cliffDuration);
      expect(await preSale.vestingDuration()).to.equal(vestingDuration);
    });
  });

  describe("Participate", function () {
    it("should buy", async function () {
      const [user] = await ethers.getSigners();
      await paymentToken.approve(await preSale.getAddress(), parseEther("0.5"));
      await preSale.connect(user).buy(parseEther("1"));
      expect((await preSale.userInfo(user.address)).boughtAmount).to.equal(parseEther("1"));
    });

    it("should vest", async function () {
      const [user] = await ethers.getSigners();

      await paymentToken.approve(await preSale.getAddress(), parseEther("0.5"));
      await preSale.connect(user).buy(parseEther("1"));

      await time.setNextBlockTimestamp(Number(endTime) + 1);

      await preSale.claim();

      expect((await preSale.userInfo(user.address)).streamId).to.not.equal(0);
    });
  });
});
