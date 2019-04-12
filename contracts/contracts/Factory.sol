pragma solidity >= 0.5.0;

import "./Storage.sol";

interface ILinkdrop {
    function initializer(address payable _sender, address payable _implementations) external;
}

contract Factory is Storage { 

    event Deployed(address payable proxy, bytes32 salt, uint timestamp);
    bytes public code;

    // Initialize the master code
    constructor(bytes memory _code, address payable _implementation) 
    public 
    {
        code = _code;
        implementation = _implementation;
    }

    function getSalt(address payable sender) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(sender));
    }

    function computeProxyAddress
    (
        address payable sender
    ) 
    external view 
    returns (address deploymentAddress) 
    {
    // variable for checking code size of any pre-existing contract at address.
    uint256 existingContractSize;
    bytes32 salt = getSalt(sender);
    bytes32 codeHash = keccak256(abi.encodePacked(code));

    // determine the address where the contract will be deployed.
    deploymentAddress = address(
      uint160(                      // downcast to match the address type.
        uint256(                    // convert to uint to truncate upper digits.
          keccak256(                // compute the CREATE2 hash using 4 inputs.
            abi.encodePacked(       // pack all inputs to the hash together.
              hex"ff",              // start with 0xff to distinguish from RLP.
              address(this),        // this contract will be the caller.
              salt,                 // pass in the supplied salt value.
              codeHash          // pass in the hash of initialization code.
            )
          )
        )
      )
    );

    // determine if any contract code already exists at the computed address.
    assembly { // solhint-disable-line
      existingContractSize := extcodesize(deploymentAddress)
    }

    // if so, return null address to signify failure. (detect selfdestructed?)
    if (existingContractSize > 0) {
      return address(0);
    }
  }

    
    // Deploy new proxy contract
    function deployProxy(address payable _sender) 
    external 
    returns (address payable) 
    {

        address payable proxy;

        bytes memory _code = code;
        bytes32 salt = getSalt(_sender);
        assembly {
            proxy := create2(0, add(_code, 0x20), mload(_code), salt)
            if iszero(extcodesize(proxy)) {revert(0, 0)}
        }
        
        // Initialize sender in newly deployed contract
        ILinkdrop(proxy).initializer(_sender, implementation);
        emit Deployed(proxy, salt, now);
        return proxy;

    }
  
}