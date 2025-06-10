import { HardhatUserConfig } from 'hardhat/config';
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  paths: {
    sources: "./code",  // Tells Hardhat where your contracts are ( default: "./contracts" )
    artifacts: "./artifacts",
  },
  defaultNetwork: 'bscTestnet',
  networks: {
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: '0.8.28',
};

export default config;
