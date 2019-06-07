pragma solidity ^0.5.6;

contract LinkdropStorage {

    // Address of owner deploying this contract (usually factory)
    address public owner;

    // Address corresponding to linkdrop master key
    address payable public linkdropMaster;

    // Version of mastercopy contract
    uint public version;

    // Network id
    uint public chainId;

    // Indicates whether an address corresponds to linkdrop signing key
    mapping (address => bool) public isLinkdropSigner;

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
    event Claimed(address indexed linkId, uint ethAmount, address indexed token, uint tokenAmount, address receiver, uint timestamp);
    event ClaimedERC721(address indexed linkId, uint ethAmount, address indexed nft, uint tokenId, address receiver, uint timestamp);
    event Paused(uint timestamp);
    event Unpaused(uint timestamp);
    event AddedSigningKey(address linkdropSigner, uint timestamp);
    event RemovedSigningKey(address linkdropSigner, uint timestamp);

}