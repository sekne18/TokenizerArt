const { ethers } = require("hardhat");
const contractAddress = require("../deployment/contract_address.txt");

async function main() {
  const [owner] = await ethers.getSigners();
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(contractAddress);
  
  // IPFS URI for your metadata
  const tokenURI = "ipfs://Qm.../metadata.json";
  
  const tx = await myNFT.mintNFT(owner.address, tokenURI);
  await tx.wait();
  console.log("NFT minted!");
}

main();