import { create } from 'ipfs-http-client';

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
