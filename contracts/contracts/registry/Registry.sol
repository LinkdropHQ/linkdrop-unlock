pragma solidity ^0.5.6;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Registry is Ownable {

    event SetFee(address indexed target, uint fee);
    event AddedRelayer(address indexed relayer);
    event RemovedRelayer(address indexed relayer);

    mapping (address => bool) whitelisted;
    mapping (address => uint) fees;

    uint constant public standardFee = 0.0002 ether;

    function getFee(address _key) external view returns (uint) {
        return fees[_key] == 0 ? standardFee : fees[_key];
    }

    function setFee(address _proxy, uint _fee) external onlyOwner returns (bool) {
        require(_fee > 0, "Invalid fee");
        fees[_proxy] = _fee;
        emit SetFee(_proxy, _fee);
        return true;
    }

    function isWhitelistedRelayer(address _relayer) public view returns (bool) {
        return whitelisted[_relayer];
    }

    function addRelayer(address _relayer) external onlyOwner returns (bool) {
        require(_relayer != address(0), "Invalid address");
        require(!isWhitelistedRelayer(_relayer), "Whitelisted address");
        emit AddedRelayer(_relayer);
        whitelisted[_relayer] = true;

        return true;
    }

    function removeRelayer(address _relayer) external onlyOwner returns (bool) {
        require(_relayer != address(0), "Invalid address");
        require(isWhitelistedRelayer(_relayer), "Non whitelisted address");
        whitelisted[_relayer] = false;
        emit RemovedRelayer(_relayer);
        return true;
    }

}