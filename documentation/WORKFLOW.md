# Step-by-step workflow

1. Create an NFT Image
- Design an image with "42" clearly visible
- Upload to IPFS (web3.storage)
- Get IPFS CID

2. Set Up Development Environment
```
npm install hardhat
npm install @openzeppelin/contracts
npx hardhat init
mkdir the-folder-structure
```

3. Implement Smart Contract
- Create code/nft.sol
- Compile: `npx hardhat compile`

4. Configure Deployment
- Set up `hardhat.config.ts` for BSC Testnet
- Add netowrk configuration

5. Deploy contract:
```
npx hardhat run deployment/deploy_script.js --network bsctestnet
```

6. Mint NFT:
`npx hardhat run mint/mint_script.js --network bsctestnet`

7. Vertify ownership:
`await contract.ownerOf(1); // Returns owner address`