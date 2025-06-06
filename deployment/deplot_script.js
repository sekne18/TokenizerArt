const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("42Lijan");
  const myNFT = await MyNFT.deploy();
  
  await myNFT.deployed();
  console.log("42Lijan deployed to:", myNFT.address);
  
  // Save address to file
  const fs = require("fs");
  fs.writeFileSync("./deployment/contract_address.txt", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });