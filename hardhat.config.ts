import { HardhatUserConfig } from 'hardhat/config';
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from 'dotenv';
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

if (!process.env.ETHERSCAN_API_KEY || !process.env.WALLET_API_KEY || !process.env.INFURA_API_KEY) { 
  throw new Error("Please set your environment variables in a .env file");
}

const config: HardhatUserConfig = {
  paths: {
    sources: "./code",  // Tells Hardhat where your contracts are ( default: "./contracts" )
    tests: "./mint/test",  // Tells Hardhat where your tests are ( default: "./test" )
    artifacts: "./artifacts",
  },
  defaultNetwork: 'sepolia',
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY, 
      chainId: 11155111,
      accounts: [process.env.WALLET_API_KEY]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  solidity: '0.8.28',
};

export default config;
