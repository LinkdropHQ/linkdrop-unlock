pragma solidity ^0.5.6;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract RelayerManager is Ownable {

    mapping (address => bool) public isRelayer;

    event RelayerAdded(address indexed relayer);

    event RelayerRemoved(address indexed relayer);

    function addRelayer(address _relayer) external onlyOwner returns (bool) {
        require(_relayer != address(0) && !isRelayer[_relayer], "Invalid address");
        isRelayer[_relayer] = true;
        emit RelayerAdded(_relayer);
        return true;
    }

    function removeRelayer(address _relayer) external onlyOwner returns (bool) {
        require(isRelayer[_relayer], "Invalid address");
        isRelayer[_relayer] = false;
        emit RelayerRemoved(_relayer);
        return true;
    }

}