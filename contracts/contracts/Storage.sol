pragma solidity >= 0.5.6;

contract Storage {

    address payable public SENDER; 

    // Indicates who the link has been claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link has been canceled
    mapping (address => bool) internal canceled;

    // Address where proxy will route functions
    address payable public implementation;

    bool initialized;
    
    address public owner;

}