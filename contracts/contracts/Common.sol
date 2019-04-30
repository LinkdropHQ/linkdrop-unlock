pragma solidity >= 0.5.6;
import "./interfaces/ICommon.sol";
import "./Storage.sol";

contract Common is ICommon, Storage {

    // =================================================================================================================
    //                                         Common
    // =================================================================================================================

    /**
    * @dev Function to set the linkdrop sender, can only be called once
    * @param _sender Linkdrop sender's address
    */

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
    
    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimedTo[_linkId] != address(0); 
    }

    /**
    * @dev Indicates whether a link is canceled or not
    * @param _linkId Address corresponding to link key
    * @return True if canceled
    */
    function isCanceledLink(address _linkId) public view returns (bool) {
        return _canceled[_linkId];
    }

    /**
    * @dev Indicates whether a contract is paused or not
    * @return True if paused
    */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
    * @dev Function to cancel a link, can only be called by linkdrop sender
    * @param _linkId Address corresponding to link key
    * @return True if success
    */
    function cancel(address _linkId) external onlySender returns (bool) {
        require(isClaimedLink(_linkId) == false, "Claimed link");
        _canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    /**
    * @dev Function to withdraw ethers kept on this contract to sender, can only be called by linkdrop sender
    * @return True if success
    */
    function withdraw() external onlySender returns (bool) {
        SENDER.transfer(address(this).balance);
        return true;
    }

    /**
    * @dev Function to pause contract, can only be called by linkdrop sender
    * @return True if success
    */
    function pause() external onlySender whenNotPaused returns (bool) {
        _paused = true;
        emit Paused(now);
        return true;
    }

    /**
    * @dev Function to unpause contract, can only be called by linkdrop sender
    * @return True if success
    */
    function unpause() external onlySender returns (bool) {
        require(paused(), "Unpaused");
        _paused = false;
        emit Unpaused(now);
        return true;
    }

    /**
    * @dev Fallback function to accept ethers
    */
    function () external payable {}

}