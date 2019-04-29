pragma solidity >= 0.5.6;

contract Storage {

    address payable public SENDER;

    // Indicates who the link has been claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link has been canceled
    mapping (address => bool) internal _canceled;

    // Address where proxy will route functions
    address payable public masterCopy;

    bool internal _initialized;

    bool internal _paused;

    // Events
    event Canceled(address linkId, uint timestamp);
    event Claimed(address indexed linkId, address indexed token, uint amount, address receiver, uint timestamp);
    event Paused(uint timestamp);
    event Unpaused(uint timestamp);
    
}