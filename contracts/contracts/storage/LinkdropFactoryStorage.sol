pragma solidity ^0.5.6;

contract LinkdropFactoryStorage {

    // Maps sender address to its corresponding proxy address
    mapping (address => address) internal _deployed;

    // Address of implementation contract, where proxy will route functions
    address payable public masterCopy;

    // Events
    event Deployed(address payable proxy, bytes32 salt, uint timestamp);

}