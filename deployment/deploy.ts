import { ethers } from 'hardhat';

async function main() {
  const contract = await ethers.deployContract("Lions42", ["0xB822Dc2346dc10026EDf321844F8E54Ca4E80522"]); // Owner address
  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
