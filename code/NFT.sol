// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
    external function:
        - Gas efficiency (slightly cheaper than public).
        - Cannot be called internally (from within the same contract).

    onlyOwner:
        - Restricts access to functions to the contract owner.
        - Useful for administrative tasks like minting, setting prices, etc.
    
    ERC721Enumerable:
        - Provides enumeration of all tokens owned by an address.
        - Allows querying of total supply and token ownership.

    Possible improvements:
        - ERC721A for gas efficiency in minting multiple tokens.
        
 */
contract Lions42 is ERC721Enumerable, Ownable {
     using Strings for uint256;

    uint256 public constant MAX_TOKENS = 10;
    string private baseURL = "";
    string public baseExtension = ".json";

    constructor(address initialOwner) 
        ERC721("Chasing lion 42", "CL42")
        Ownable(initialOwner)
    {
    }

    /*
        Mint function to create a new token.
        This function can only be called by the owner of the contract.
        It mints a new token to the specified address and ensures that the total supply does not exceed MAX_TOKENS.
        
        Parameters:
            - address to: The address that will receive the newly minted token.
        
        Requirements:
            - The total supply must be less than MAX_TOKENS.
            - The function can only be called by the contract owner.
    */
    function mint(address to) external onlyOwner {
        require(totalSupply() < MAX_TOKENS, "Max supply reached");
        uint256 tokenId = totalSupply() + 1;
        _safeMint(to, tokenId);
    }

    /*
        Override the _baseURI function to return the base URL for token metadata.
        This function is used by the tokenURI function to construct the full URI for each token.
    */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Query for nonexistent token");
        return string(abi.encodePacked(baseURL, tokenId.toString(), baseExtension));
    }

    /*
        Set the base URL for the token metadata.
        This function allows the owner to update the base URL where the metadata is hosted.
        The URL should point to a location that serves JSON files for each token.
        
        Example: If baseURL is set to "https://example.com/metadata/", then
        tokenId 1 will have a metadata URL of "https://example.com/metadata/1.json".
    */
    function setBaseURL(string memory _newBaseURL) external onlyOwner {
        baseURL = _newBaseURL;
    }

    /*
        Withdraw function to transfer the contract's balance to the owner.
        This is useful for withdrawing funds collected from sales or other activities.
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
