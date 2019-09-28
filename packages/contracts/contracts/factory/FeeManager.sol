pragma solidity ^0.5.6;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract FeeManager is Ownable {

    event FeeChanged(address proxy, uint fee);

    mapping (address => uint) fees;

    uint public standardFee = 0.002 ether;

    function getFee(address _proxy) external view returns (uint) {
        return fees[_proxy];
    }

    function setFee(address _proxy, uint _fee) external onlyOwner returns (bool) {
        _setFee(_proxy, _fee);
        return true;
    }

    function _setFee(address _proxy, uint _fee) internal {
        fees[_proxy] = _fee;
        emit FeeChanged(_proxy, _fee);
    }

    function setStandardFee(uint _fee) external onlyOwner {
        standardFee = _fee;
    }

}