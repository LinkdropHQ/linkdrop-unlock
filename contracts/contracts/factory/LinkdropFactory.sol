pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";
import "./approve/LinkdropFactoryERC20Approve.sol";
import "./approve/LinkdropFactoryERC721Approve.sol";

contract LinkdropFactory is LinkdropFactoryERC20, LinkdropFactoryERC721, LinkdropFactoryERC20Approve, LinkdropFactoryERC721Approve {

    /**
    * @dev Constructor that sets factory owner, bootstap initcode, and initial contract bytecode to install
    * @param __initcode Static bootstrap initcode to fetch the runtime bytecode. Used to generate repeatable contract addresses
    * @param __bytecode Initial contract bytecode to install
    */
    constructor(bytes memory __initcode, bytes memory __bytecode) public {
        owner = msg.sender;
        _initcode = __initcode;
        updateBytecode(__bytecode);
    }

}