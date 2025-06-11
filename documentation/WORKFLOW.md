# Step-by-step workflow

1. Create an NFT Image
- Design an image with "42" clearly visible

2. Set Up Development Environment
```
npm install hardhat
npm install @openzeppelin/contracts
npm install dotenv
npm install ethers
npx hardhat init
```

3. Implement Smart Contract
- Create code/nft.sol
- Compile: `npx hardhat compile`

4. Configure Deployment
- Set up `hardhat.config.ts` for BSC Testnet
- Add netowrk configuration

5. Deploy contract:
```
npx hardhat run deployment/deploy.ts --network bscTestnet
```

6. Mint NFT:
```
cd /mint
npm run dev
open localhost:PORT in browser
Upload image and mint
```

7. Vertify ownership:
`Enter NFT id to the input field and check for the ownership. The ID should be your wallet`