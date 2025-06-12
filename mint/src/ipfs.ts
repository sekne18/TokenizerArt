// ipfs.ts
import type { FileLike } from '@web3-storage/w3up-client/types';
import { create, Client } from '@web3-storage/w3up-client';

let cachedClient: Client | null = null;

async function getClient(): Promise<Client> {
  if (cachedClient) return cachedClient;

  const client = await create();
  const email = await import.meta.env.VITE_EMAIL;
  console.log('Using email:', email);
  await client.login(email as any);

  console.log('Logged in with email:', email);

  const spaces = await client.spaces();
  if (!spaces || spaces.length === 0) {
    throw new Error('No spaces found for this account');
  }

  console.log('Available spaces:', spaces.map(space => space.did()));

  const space = spaces[1];
  await client.setCurrentSpace(space.did());

  cachedClient = client;
  return client;
}

export async function uploadToWeb3(
  file: FileLike,
  tokenId: number,
  artistLogin: string
): Promise<{
  folderCid: string;
  metadataUrl: string;
  imageUrl: string;
}> {
  const client = await getClient();

  // Upload image file separately to get CID
  const imageCid = await client.uploadFile(file);
  const imageUrl = `https://w3s.link/ipfs/${imageCid}`;

  const metadata = {
    name: `Chasing Lion ${tokenId}`,
    description: `Chasing lion - minted by ${artistLogin}`,
    image: imageUrl,
    author: artistLogin,
  };

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  });

  const metadataFile = new File([metadataBlob], `${tokenId}.json`, {
    type: 'application/json',
  });

  // Set webkitRelativePath to simulate folder
  Object.defineProperty(file, 'webkitRelativePath', {
    value: `collection/image-${tokenId}.png`,
  });

  Object.defineProperty(metadataFile, 'webkitRelativePath', {
    value: `collection/${tokenId}.json`,
  });

  const folderCid = await client.uploadDirectory([file as File, metadataFile]);

  const metadataUrl = `https://w3s.link/ipfs/${folderCid}/collection/${tokenId}.json`;

  return {
    folderCid: folderCid.toString(),
    metadataUrl,
    imageUrl,
  };
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
