pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20Approve.sol";
import "./LinkdropFactoryERC721Approve.sol";

contract LinkdropFactoryApprove is LinkdropFactoryERC20Approve, LinkdropFactoryERC721Approve {

    /**
    * @dev Constructor that sets the linkdrop mastercopy address
    * @param _masterCopy Address of linkdrop implementation contract
    */
    constructor(address payable _masterCopy) public {
        masterCopy = _masterCopy;
    }

}