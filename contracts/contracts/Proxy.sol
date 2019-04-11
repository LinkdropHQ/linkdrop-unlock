pragma solidity >= 0.5.0;
import "./Storage.sol";

contract Proxy is Storage { 
    
    constructor() public {
        owner = msg.sender; //This is going to be factory
    }

    function initializer
    (   
        address payable _sender
    ) 
    public
    {
        require(msg.sender == owner, "Only owner has rights");
        require(initialized == false, "Initializer can only be called once");
        SENDER = _sender;
        initialized = true;
    }


    function setImplementation (address payable _implementation) external {
        require(msg.sender == SENDER, "Only sender has rights");
        implementation = _implementation;
    }

    /**
    * @dev Fallback function allowing to perform a delegatecall to the given implementation.
    * This function will return whatever the implementation call returns
    */
    function () payable external {
        address payable _impl = implementation;
        require(_impl != address(0), "Wrong implementation address");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

}