pragma solidity >= 0.5.6;

contract Storage {

    // Address of implementation contract, where proxy will route functions
    address payable public masterCopy;

    // Address of linkdrop sender
    address payable public sender;

    // Indicates who the link is claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link is canceled or not
    mapping (address => bool) internal _canceled;

    // Indicates whether the initializer function has been called or not
    bool internal _initialized;

    // Indicates whether the contract is paused or not
    bool internal _paused;

    // Events
    event Canceled(address linkId, uint timestamp);
    event ClaimedERC20(address indexed linkId, uint ethAmount, address indexed token, uint tokenAmount, address receiver, uint timestamp);
    event ClaimedERC721(address indexed linkId, address indexed nft, uint tokenId, address receiver, uint timestamp);
    event Paused(uint timestamp);
    event Unpaused(uint timestamp);
    
}