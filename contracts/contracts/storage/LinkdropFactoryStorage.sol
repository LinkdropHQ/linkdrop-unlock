pragma solidity ^0.5.6;

contract LinkdropFactoryStorage {

    // Address of implementation contract, where proxy will route functions
    address payable public masterCopy;

    // Maps sender address to its corresponding proxy address
    mapping (address => address) internal _deployed;

    // Events
    event Deployed(address payable proxy, bytes32 salt, uint timestamp);

}