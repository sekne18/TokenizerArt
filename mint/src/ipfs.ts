// ipfs.ts
import { create, Client } from '@web3-storage/w3up-client';

let cachedClient: Client | null = null;

async function getClient(): Promise<Client> {
  if (cachedClient) return cachedClient;

  const client = await create();
  const email = await import.meta.env.VITE_EMAIL;
  await client.login(email as any);

  console.log('Logged in with email:', email);

  const spaces = await client.spaces();
  if (!spaces || spaces.length === 0) {
    throw new Error('No spaces found for this account');
  }

  const space = spaces[1];
  await client.setCurrentSpace(space.did());

  cachedClient = client;
  return client;
}

export async function uploadToWeb3(
  imageFile: File,
  tokenId: number,
  artistLogin: string
): Promise<{
  CID: string;
  imageUrl: string;
}> {
  const client = await getClient();

  // Rename the image file to match the tokenId
  const renamedImageFile = new File([await imageFile.arrayBuffer()], `${tokenId}.png`, {
    type: imageFile.type || 'image/png',
  });

  // Create metadata JSON
  const metadata = {
    name: `Chasing Lion ${tokenId}`,
    description: `Chasing lion - minted by ${artistLogin}`,
    image: `${tokenId}.png`, // Reference to the image file
    author: artistLogin,
  };

  const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const metadataFile = new File([metadataBlob], `${tokenId}.json`, { type: 'application/json' });

  // Upload both files together as a folder
  const rootCid = await client.uploadDirectory([metadataFile, renamedImageFile]);

  // Construct URLs
  const CID = `https://ipfs.io/ipfs/${rootCid}/`;
  const imageUrl = `https://ipfs.io/ipfs/${rootCid}/${tokenId}.png`;

  return { CID, imageUrl };
}


/* Does work, but this only stores it localy. Lacks pinning and 24/7 hosting
const ipfs = create({ url: 'http://localhost:5001/api/v0' });

export async function uploadToIPFS(file: File, artistLogin: string) {
  try {
    const addedImage = await ipfs.add(file);
    const imageUrl = `ipfs://${addedImage.path}`;
  
    console.log(imageUrl);
  
    // Create metadata object
    const metadata = {
      name: 'Chasing lion 42',
      description: `Hungry lion chasing `,
      image: imageUrl,
      author: artistLogin
    };
  
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFile = new File([blob], 'metadata.json');
    const addedMetadata = await ipfs.add(metadataFile);
    const metadataUrl = `ipfs://${addedMetadata.path}`;
  
    return { metadataUrl, imageUrl };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}
  */
