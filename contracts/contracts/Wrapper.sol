pragma solidity >= 0.5.0;

import "./interfaces/ILinkdrop.sol";
import "./interfaces/ILinkdropERC721.sol";
import "./Storage.sol";

contract Wrapper is ILinkdrop, ILinkdropERC721, Storage {

    /*
     *  Functions from Linkdrop.sol
     */


    // Withdraw ether
    function withdraw() external returns (bool) {}

    // Fallback function to accept ethers
    function () external payable {} 


    /*
     *  Functions from Proxy.sol
     */

    function initializer(address payable _sender) public {}
    function setImplementation (address payable _implementation) external {}

}