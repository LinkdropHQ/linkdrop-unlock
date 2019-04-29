pragma solidity >= 0.5.6;

contract Storage {

    // Address of linkdrop sender
    address payable public SENDER;

    // Indicates who the link is claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link is canceled or not
    mapping (address => bool) internal _canceled;

    // Address of implementation contract, where proxy will route functions
    address payable public masterCopy;

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