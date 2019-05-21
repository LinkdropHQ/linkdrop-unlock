pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";
import "./approve/LinkdropFactoryERC20Approve.sol";
import "./approve/LinkdropFactoryERC721Approve.sol";

contract LinkdropFactory is
LinkdropFactoryERC20,
LinkdropFactoryERC721,
LinkdropFactoryERC20Approve,
LinkdropFactoryERC721Approve
{

    /**
    * @dev Constructor that sets the linkdrop mastercopy address
    * @param _masterCopy Address of linkdrop implementation contract
    */
    constructor(address payable _masterCopy) public {
        masterCopy = _masterCopy;
    }

}