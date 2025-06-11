import { useState } from 'react';
import './App.css';
import { Web3Provider } from '@ethersproject/providers';
import { uploadToIPFS } from './ipfs';
import { CONTRACT_ADDRESS, OWNER_ADDRESS } from './constants';
import { Contract } from 'ethers';
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

      const { metadataUrl, imageUrl } = await uploadToIPFS(file, artistLogin);

      setStatus(`✅ Uploaded. Metadata URI: ${metadataUrl}`);
      console.log('Image:', imageUrl);
      console.log('Metadata:', metadataUrl);

      setStatus('🚀 Sending mint transaction...');

      if (!window.ethereum) throw new Error('MetaMask not detected');

      const provider = new Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, Lions42.abi, signer as any);

      // const price = parseEther('0.01'); // Update if your price differs

      const tx = await contract.mint(OWNER_ADDRESS);
      console.log('Transaction hash:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);

      if (receipt.status === 1) {
        setStatus('✅ Minted successfully!');
        await new Promise(resolve => setTimeout(resolve, 500));
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

      setStatus(`❌ Error: ${errorMessage.split(':')[1]}`);
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

      const provider = new Web3Provider(window.ethereum);
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
