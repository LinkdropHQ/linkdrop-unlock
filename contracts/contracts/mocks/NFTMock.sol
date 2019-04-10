pragma solidity ^0.5.1;
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract NFTMock is ERC721 {
    
    // Mint 100 NFTs to deployer
    constructor() public {
        for (uint i = 0; i < 100; i++) {
            super._mint(msg.sender, i);
        }
    }
    
}