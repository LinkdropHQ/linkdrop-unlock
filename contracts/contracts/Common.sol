pragma solidity >= 0.5.6;
import "./interfaces/ICommon.sol";
import "./Storage.sol";

contract Common is ICommon, Storage {

    // =================================================================================================================
    //                                         Common
    // =================================================================================================================

    function initializer
    (   
        address payable _sender
    ) 
    public
    returns (bool)
    {
        require(_initialized == false, "Initialized");
        SENDER = _sender;
        _initialized = true;
        return true;
    }

    modifier onlySender() {
        require(msg.sender == SENDER, "Only sender");
        _;
    }

    modifier whenNotPaused() {
        require(!paused(), "Paused");
        _;
    }
    
    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimedTo[_linkId] != address(0); 
    }

    function isCanceledLink(address _linkId) public view returns (bool) {
        return _canceled[_linkId];
    }

    function paused() public view returns (bool) {
        return _paused;
    }

    function cancel(address _linkId) external onlySender returns (bool) {
        require(isClaimedLink(_linkId) == false, "Claimed link");
        _canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    // Withdraw ether
    function withdraw() external onlySender returns (bool) {
        SENDER.transfer(address(this).balance);
        return true;
    }

    function pause() external onlySender whenNotPaused returns (bool) {
        _paused = true;
        emit Paused(now);
        return true;
    }

    function unpause() external onlySender returns (bool) {
        require(paused(), "Unpaused");
        _paused = false;
        emit Unpaused(now);
        return true;
    }

    // Fallback function to accept ethers
    function () external payable {}

}