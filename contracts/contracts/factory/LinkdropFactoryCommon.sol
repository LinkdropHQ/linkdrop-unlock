pragma solidity ^0.5.6;

import "./CloneFactory.sol";
import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage, CloneFactory {

    /**
    * @dev Indicates whether a proxy contract for linkdrop master is deployed or not
    * @param _linkdropMaster Address of linkdrop master
    * @return True if deployed
    */
    function isDeployed(address _linkdropMaster) public view returns (bool) {
        return (_deployed[_linkdropMaster] != address(0));
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkdropMaster Address of lindkrop signer
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address payable _linkdropMaster, address _linkId) public view returns (bool) {

        if (!isDeployed(_linkdropMaster)) {
            return false;
        }
        else {
            address payable proxy = address(uint160(_deployed[_linkdropMaster]));
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for linkdrop master
    * @param _linkdropMaster Address of linkdrop master
    * @return Proxy contract address
    */
    function deployProxy(address payable _linkdropMaster)
    public
    returns (address payable)
    {

        // Create clone of the mastercopy
        address payable proxy = createClone(masterCopy, keccak256(abi.encodePacked(_linkdropMaster)));

        _deployed[_linkdropMaster] = proxy;

        // Initialize linkdrop master in newly deployed proxy contract
        require(ILinkdropCommon(proxy).initializer(_linkdropMaster), "Failed to initialize");
        emit Deployed(proxy, keccak256(abi.encodePacked(_linkdropMaster)), now);

        return proxy;
    }


}