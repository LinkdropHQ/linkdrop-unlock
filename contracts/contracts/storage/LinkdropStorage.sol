pragma solidity >= 0.5.6;

contract LinkdropStorage {

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
    event Claimed(address indexed linkId, address indexed token, uint amount, address receiver, uint timestamp);
    event Paused(uint timestamp);
    event Unpaused(uint timestamp);

}