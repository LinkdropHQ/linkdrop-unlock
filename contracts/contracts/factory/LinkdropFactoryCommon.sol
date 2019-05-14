pragma solidity ^0.5.6;

import "./CloneFactory.sol";
import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage, CloneFactory {

    /**
    * @dev Constructor that sets the linkdrop mastercopy address
    * @param _masterCopy Address of linkdrop implementation contract
    */
    constructor(address payable _masterCopy)
    public
    {
        masterCopy = _masterCopy;
    }

    /**
    * @dev Indicates whether a proxy contract for sender is deployed or not
    * @param _sender Address of lindkrop sender
    * @return True if deployed
    */
    function isDeployed(address _sender) public view returns (bool) {
        return (_deployed[_sender] != address(0));
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _sender Address of lindkrop sender
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address payable _sender, address _linkId) public view returns (bool) {

        if (!isDeployed(_sender)) {
            return false;
        }
        else {
            address payable proxy = address(uint160(_deployed[_sender]));
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for sender
    * @param _sender Address of linkdrop sender
    * @return Proxy contract address
    */
    function deployProxy(address payable _sender)
    public
    returns (address payable)
    {

        // Create clone of the mastercopy
        address payable proxy = createClone(masterCopy, keccak256(abi.encodePacked(_sender)));

        _deployed[_sender] = proxy;

        // Initialize sender in newly deployed proxy contract
        require(ILinkdropCommon(proxy).initializer(_sender), "Failed to initialize");
        emit Deployed(proxy, keccak256(abi.encodePacked(_sender)), now);

        return proxy;
    }


}