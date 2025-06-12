import { ethers } from 'hardhat';

async function main() {
  const contract = await ethers.deployContract("Lions42", ["0x4c6b4A2c8bb947cd15aae750ab8715B236b6A318"]);
  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
