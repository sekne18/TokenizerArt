import { useState } from 'react';
import './App.css';
// import { Web3Provider } from '@ethersproject/providers';
import { uploadToWeb3 } from './ipfs';
import { CONTRACT_ADDRESS } from './constants';
import { Contract, ethers } from 'ethers';
import Lions42 from '../../artifacts/code/NFT.sol/Lions42.json';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [artistLogin, setArtistLogin] = useState('');
  const [status, setStatus] = useState('');
  const [minting, setMinting] = useState(false);
  const [tokenIdToCheck, setTokenIdToCheck] = useState('');
  const [nftOwner, setNftOwner] = useState('');
  const [isCheckingOwner, setIsCheckingOwner] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleMint = async () => {
    if (!file || !artistLogin) {
      alert('Please upload an image and enter artist login.');
      return;
    }

    try {
      setMinting(true);
      setStatus('📤 Uploading to IPFS...');

      if (!window.ethereum) throw new Error('MetaMask not detected');
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, Lions42.abi, signer as any);

      // Get total supply (current number of minted tokens)
      const totalSupply = await contract.totalSupply();

      // Next token ID will be totalSupply + 1
      const nextTokenId = Number(totalSupply) + 1;
      const { metadataUrl, imageUrl } = await uploadToWeb3(file, nextTokenId, artistLogin);

      // Set base URI BEFORE minting
      const setUriTx = await contract.setBaseURL(metadataUrl);
      await setUriTx.wait(1); // Wait for confirmation

      setStatus(`✅ Uploaded. Metadata URI: ${metadataUrl}`);
      setStatus('🚀 Sending mint transaction...');
      const address = await signer.getAddress();
      const tx = await contract.mint(address);
      const receipt = await tx.wait(1);

      if (receipt.status === 1) {
        setStatus('✅ Minted successfully!');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Full error:', err);
      let errorMessage = err.message;

      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }

      let parsedMessage = errorMessage;

      if (errorMessage.includes(':')) {
        const parts = errorMessage.split(':');
        parsedMessage = parts.slice(1).join(':').trim();
      }

      setStatus(`❌ Error: ${parsedMessage}`);
    } finally {
      setMinting(false);
    }
  };

  const handleCheckOwner = async () => {
    if (!tokenIdToCheck) {
      alert('Please enter a token ID');
      return;
    }

    try {
      setIsCheckingOwner(true);
      setStatus('🔍 Checking NFT owner...');

      if (!window.ethereum) throw new Error('MetaMask not detected');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, Lions42.abi, provider as any);

      // Convert tokenId to number or BigNumber depending on your contract
      const owner = await contract.ownerOf(tokenIdToCheck);
      setNftOwner(owner);
      setStatus(`✅ Owner of token ${tokenIdToCheck}: ${owner}`);
    } catch (err: any) {
      console.error('Error checking owner:', err);
      setStatus(`❌ Error: ${err.message.split(':')[0]}`);
      setNftOwner('');
    } finally {
      setIsCheckingOwner(false);
    }
  };

  return (
    <div className="app">
      <h1>Upload & Mint NFT via Local IPFS</h1>

      {/* File Upload - Styled to match theme */}
      <div className="upload-container">
        <label className="file-input-label">
          <span className="upload-icon">🖼️</span>
          <span>{file ? file.name : 'Choose NFT Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden-input"
          />
        </label>
      </div>

      {/* Artist Login Input */}
      <div className="input-container">
        <label className="input-label">Artist Login</label>
        <input
          type="text"
          value={artistLogin}
          onChange={(e) => setArtistLogin(e.target.value)}
          className="neon-input"
        />
        {/* <span className="input-icon">👨‍🎨</span> */}
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={minting}
        className="mint-button"
      >
        {minting ? (
          <>
            <span className="spinner"></span>
            Minting...
          </>
        ) : (
          '🔥 Upload & Mint'
        )}
      </button>

      {/* Owner Check Section */}
      <div className="owner-check-section">
        <h2>Check NFT Owner</h2>
        <div className="input-container">
          <label className="input-label">Token ID</label>
          <input
            type="text"
            value={tokenIdToCheck}
            onChange={(e) => setTokenIdToCheck(e.target.value)}
            className="neon-input"
            placeholder="Enter Token ID"
          />
        </div>
        <button
          onClick={handleCheckOwner}
          disabled={isCheckingOwner}
          className="check-owner-button"
        >
          {isCheckingOwner ? (
            <>
              <span className="spinner"></span>
              Checking...
            </>
          ) : (
            '🔍 Check Owner'
          )}
        </button>
        {nftOwner && (
          <div className="owner-result">
            <p>Owner Address:</p>
            <p className="owner-address">{nftOwner}</p>
            <p>Token ID: {tokenIdToCheck}</p>
          </div>
        )}
      </div>

      {/* Status Message */}
      <p className="status-message">{status}</p>
    </div>
  );
}

export default App
