import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: [PRIVATE_KEY]
    }
  } 
};

export default config;
