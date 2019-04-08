pragma solidity ^0.5.1;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TokenMock is ERC20, ERC20Detailed {
  
    constructor() public ERC20Detailed ("Mock Token", "MCK", 18) {
        _mint(msg.sender, 1000000000);
    }
    
    function faucet() external {
        _mint(msg.sender, 100000000);
    }
    
}