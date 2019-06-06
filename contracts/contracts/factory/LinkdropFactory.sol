pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";
import "./approve/LinkdropFactoryERC20Approve.sol";
import "./approve/LinkdropFactoryERC721Approve.sol";

contract LinkdropFactory is LinkdropFactoryERC20, LinkdropFactoryERC721, LinkdropFactoryERC20Approve, LinkdropFactoryERC721Approve {

    /**
    * @dev Constructor that sets bootstap initcode, factory owner, chainId and master copy
    * @param _masterCopy Linkdrop mastercopy contract address to calculate bytecode from
    * @param _chainId Chain id
    */
    constructor(address payable _masterCopy, uint _chainId) public {
        _initcode = (hex"6352c7420d6000526103ff60206004601c335afa6040516060f3");
        owner = msg.sender;
        chainId = _chainId;
        setMasterCopy(_masterCopy);
    }

}