pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";
import "./approve/LinkdropFactoryERC20Approve.sol";
import "./approve/LinkdropFactoryERC721Approve.sol";

contract LinkdropFactory is LinkdropFactoryERC20, LinkdropFactoryERC721, LinkdropFactoryERC20Approve, LinkdropFactoryERC721Approve {

    /**
    * @dev Constructor that sets factory owner, bootstap initcode, and initial contract bytecode to install
    * @param _masterCopy Linkdrop mastercopy contract address to calculate bytecode from
    * @param _chainId Chain id
    */
    constructor(address _masterCopy, uint _chainId) public {
        owner = msg.sender;
        _initcode = (hex"6352c7420d6000526103ff60206004601c335afa6040516060f3");
        setBytecode(_masterCopy);
        chainId = _chainId;
    }

}