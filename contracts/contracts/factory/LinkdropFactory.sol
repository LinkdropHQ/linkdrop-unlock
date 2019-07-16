pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";

contract LinkdropFactory is LinkdropFactoryERC20, LinkdropFactoryERC721 {

    /**
    * @dev Constructor that sets bootstap initcode, factory owner, chainId and master copy
    * @param _masterCopy Linkdrop mastercopy contract address to calculate bytecode from
    * @param _chainId Chain id
    */
    constructor(address payable _masterCopy, uint _chainId, Registry _registry) public {
        _initcode = (hex"6352c7420d6000526103ff60206004601c335afa6040516060f3");
        owner = msg.sender;
        chainId = _chainId;
        registry = _registry;
        setMasterCopy(_masterCopy);
    }

}