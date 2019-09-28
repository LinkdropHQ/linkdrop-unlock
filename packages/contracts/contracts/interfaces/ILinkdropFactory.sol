pragma solidity ^0.5.6;

interface ILinkdropFactory {
    function getFee(address _proxy) external view returns (uint);
}