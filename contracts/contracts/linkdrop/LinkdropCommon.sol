pragma solidity ^0.5.6;

import "../interfaces/ILinkdropCommon.sol";
import "../storage/LinkdropStorage.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropCommon is ILinkdropCommon, LinkdropStorage {

    /**
    * @dev Function called only once to set owner, linkdrop master, contract version and chain id
    * @param _owner Owner address
    * @param _linkdropMaster Address corresponding to master key
    * @param _version Contract version
    * @param _chainId Network id
    */
    function initialize
    (
        address _owner,
        address payable _linkdropMaster,
        uint _version,
        uint _chainId
    )
    public
    returns (bool)
    {
        require(!_initialized, "Already initialized");
        owner = _owner;
        linkdropMaster = _linkdropMaster;
        isLinkdropSigner[linkdropMaster] = true;
        version = _version;
        chainId = _chainId;
        _initialized = true;
        return true;
    }

    modifier onlyLinkdropMaster() {
        require(msg.sender == linkdropMaster, "Only linkdrop master");
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
    * @dev Function to cancel a link, can only be called by linkdrop master
    * @param _linkId Address corresponding to link key
    * @return True if success
    */
    function cancel(address _linkId) external onlyLinkdropMaster returns (bool) {
        require(!isClaimedLink(_linkId), "Claimed link");
        _canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    /**
    * @dev Function to withdraw eth to linkdrop master, can only be called by linkdrop master
    * @return True if success
    */
    function withdraw() external onlyLinkdropMaster returns (bool) {
        linkdropMaster.transfer(address(this).balance);
        return true;
    }

    /**
    * @dev Function to pause contract, can only be called by linkdrop master
    * @return True if success
    */
    function pause() external onlyLinkdropMaster whenNotPaused returns (bool) {
        _paused = true;
        emit Paused(now);
        return true;
    }

    /**
    * @dev Function to unpause contract, can only be called by linkdrop master
    * @return True if success
    */
    function unpause() external onlyLinkdropMaster returns (bool) {
        require(paused(), "Unpaused");
        _paused = false;
        emit Unpaused(now);
        return true;
    }

    /**
    * @dev Function to add new signing key, can only be called by linkdrop master
    * @param _linkdropSigner Address corresponding to signing key
    * @return True if success
    */
    function addSigner(address _linkdropSigner) external onlyLinkdropMaster returns (bool) {
        require(_linkdropSigner != address(0), "Invalid address");
        isLinkdropSigner[_linkdropSigner] = true;
        return true;
    }

    /**
    * @dev Function to remove signing key, can only be called by linkdrop master
    * @param _linkdropSigner Address corresponding to signing key
    * @return True if success
    */
    function removeSigner(address _linkdropSigner) external onlyLinkdropMaster returns (bool) {
        require(_linkdropSigner != address(0), "Invalid address");
        isLinkdropSigner[_linkdropSigner] = false;
        return true;
    }

    /**
    * @dev Function to destroy this contract, can only be called by owner (factory) or linkdrop master
    * Withdraws all the remaining ETH to linkdrop master
    */
    function destroy() external {
        require (msg.sender == owner || msg.sender == linkdropMaster, "Only owner or linkdrop master");
        selfdestruct(linkdropMaster);
    }

    /**
    * @dev Function for other contracts to be able to fetch the mastercopy version
    * @return Master copy version
    */
    function getMasterCopyVersion() external view returns (uint) {
        return version;
    }

    /**
    * @dev Fallback function to accept ETH
    */
    function () external payable {}

}