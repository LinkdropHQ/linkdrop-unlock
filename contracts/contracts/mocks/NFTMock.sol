pragma solidity ^0.5.1;
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";

contract NFTMock is ERC721Metadata {
    
    //mints 100 NFTs to deployer
    constructor() public ERC721Metadata("NFTMock", "NFT") {
        for (uint i = 0; i < 100; i++) {
            super._mint(msg.sender, i);
        }
    }
    
}