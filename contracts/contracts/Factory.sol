pragma solidity >= 0.5.0;
import "./CloneFactory.sol";
import "./Storage.sol";

interface ILinkdrop {
    function initializer(address payable _sender, address payable _implementation) external returns (bool);
}

contract Factory is Storage, CloneFactory { 

    event Deployed(address payable proxy, bytes32 salt, uint timestamp);

    // Initialize the master code
    constructor(address payable _implementation) 
    public 
    {
      implementation = _implementation;
    }

    // Deploy new proxy contract
    function deployProxy(address payable _sender) 
    external 
    returns (address payable) 
    {

        address payable proxy = createClone(implementation, keccak256(abi.encodePacked(_sender)));
       
        // Initialize sender in newly deployed contract
        require(ILinkdrop(proxy).initializer(_sender, implementation), "Failed to initialize");
        emit Deployed( proxy, keccak256(abi.encodePacked(_sender)), now);
        
        return proxy;

    }
  
}