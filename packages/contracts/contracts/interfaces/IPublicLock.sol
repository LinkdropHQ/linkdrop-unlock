pragma solidity ^0.5.6;

interface IPublicLock {
    function purchaseFor(address _recipient)  external payable;
}