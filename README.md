# Chasing Lion 42 NFT 🦁✨

Welcome to the **Chasing Lion 42** project – an artistic representation of a lion chasing the number 42, built as part of the TokenizeArt exercise on BNB Chain.

## 📌 Project Overview

This NFT was created to fulfill the mandatory requirements of the Web3 NFT development subject from 42. The image contains the number 42 and is hosted on IPFS. The token was minted using a ERC721 compliant smart contract on the BNB Testnet.

- **NFT Name:** Chasing Lion 42
- **Artist:** jsekne
- **Image:** Stored on IPFS
- **Standard:** ERC721
- **Network:** BNB Chain Testnet

## 🧠 Rationale Behind Choices

### 🔗 Blockchain
BNB Chain was chosen due to its robust support for NFTs via the ERC721 standard, fast transaction speeds, and cost-effectiveness.

### 🛠️ Tools Used
- **Hardhat** for smart contract development and deployment.
- **Remix IDE** for contract testing.
- **IPFS** via Pinata for decentralized image hosting.
- **MetaMask** to interact with BNB Testnet.

### 📷 Image Design
The image creatively embeds the number **42** in a surreal digital artwork where a lion chases a mysterious glowing "42" in the savannah. This symbolizes pursuit of knowledge and curiosity.

## 🚀 Features

- ERC721 compliant NFT
- Fully on-chain metadata and ownership tracking
- IPFS-hosted media
- Owner verification via `ownerOf` function

## 📁 Repository Structure
.
├── README.md
├── code/ # Smart contract files
├── deployment/ # Deployment scripts and config
├── mint/ # Minting scripts or proofs
├── documentation/ # Whitepaper and technical documentation


## ✅ How to Deploy

1. Clone the repo
2. Install dependencies (`npm install`)
3. Set up Hardhat and configure BNB testnet
4. Run `npx hardhat run scripts/deploy.js --network testnet`

## ✅ Minting

After deployment, mint your NFT using:

```
npx hardhat run scripts/mint.js --network testnet
ownerOf(tokenId);
```