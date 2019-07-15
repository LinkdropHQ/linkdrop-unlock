pragma solidity ^0.5.6;
import "../registry/Registry.sol";

contract LinkdropFactoryStorage {

    Registry public registry;

    // Address of factory owner
    address payable public owner;

    // Current version of mastercopy contract
    uint public masterCopyVersion;

    // Contract bytecode to be installed when deploying proxy
    bytes internal _bytecode;

    // Bootstrap initcode to fetch the actual contract bytecode. Used to generate repeatable contract addresses
    bytes internal _initcode;

    // Network id
    uint public chainId;

    // Maps hash(sender address, campaign id) to its corresponding proxy address
    mapping (bytes32 => address) public deployed;

    // Events
    event Deployed(address payable owner, address payable proxy, bytes32 salt, uint timestamp);
    event Destroyed(address payable owner, address payable proxy, uint timestamp);
    event SetMasterCopy(address masterCopy, uint version, uint timestamp);

}