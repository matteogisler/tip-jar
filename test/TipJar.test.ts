import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { TipJar } from "../typechain-types";
import { parseEther } from "ethers";

describe("TipJar", () => {
  let owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;
  let tipJar: TipJar;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("TipJar", owner);
    tipJar = (await factory.deploy()) as TipJar;
    await tipJar.waitForDeployment();
  });

  it("starts with zero balance", async () => {
    expect(await tipJar.getTotalTips()).to.equal(0n);
  });

  it("lets someone tip and records it", async () => {
    const tipAmount = parseEther("1.0");
    await tipJar.connect(alice).tip({ value: tipAmount });
    expect(await tipJar.getTotalTips()).to.equal(tipAmount);
    expect(await tipJar.tipsReceived(alice.address)).to.equal(tipAmount);
  });

  it("only owner can withdraw", async () => {
    const halfEth = parseEther("0.5");
    await tipJar.connect(bob).tip({ value: halfEth });
    await expect(tipJar.connect(alice).withdraw()).to.be.revertedWith("Only Owner");
    await expect(() => tipJar.connect(owner).withdraw())
      .to.changeEtherBalances([owner, tipJar], [halfEth, -halfEth]);
  });
});
