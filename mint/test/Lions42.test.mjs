import { expect } from "chai";
import hardhat from "hardhat";

const { ethers } = hardhat;

describe("Lions42", function () {
  let Lions42, lions42, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Lions42 = await ethers.getContractFactory("Lions42");
    lions42 = await Lions42.deploy(owner.address);
  });

  it("Should allow the owner to mint a token", async function () {
    await lions42.connect(owner).mint(addr1.address);
    expect(await lions42.totalSupply()).to.equal(1n);
    expect(await lions42.ownerOf(1n)).to.equal(addr1.address);
  });

  it("Should reject minting if not owner", async function () {
    await expect(lions42.connect(addr1).mint(addr1.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should set and use baseURL correctly in tokenURI", async function () {
    await lions42.connect(owner).mint(addr1.address);
    await lions42.connect(owner).setBaseURL("https://example.com/meta/");
    expect(await lions42.tokenURI(1n)).to.equal("https://example.com/meta/1.json");
  });

  it("Should fail tokenURI lookup for nonexistent token", async function () {
    await expect(lions42.tokenURI(1n)).to.be.revertedWith("Query for nonexistent token");
  });

  it("Should withdraw funds to owner", async function () {
    await owner.sendTransaction({
      to: lions42.getAddress(),
      value: parseEther("1"),
    });

    const balanceBefore = await ethers.provider.getBalance(owner.address);
    const tx = await lions42.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const balanceAfter = await ethers.provider.getBalance(owner.address);

    // Allow for gas difference
    expect(balanceAfter).to.be.closeTo(
      balanceBefore + parseEther("1") - gasUsed,
      parseEther("0.01")
    );
  });
});
