pragma solidity ^0.5.6;

import "./LinkdropERC20.sol";
import "./LinkdropERC721.sol";
import "./approve/LinkdropERC20Approve.sol";
import "./approve/LinkdropERC721Approve.sol";

contract LinkdropMastercopy is LinkdropERC20, LinkdropERC721, LinkdropERC20Approve, LinkdropERC721Approve {

}