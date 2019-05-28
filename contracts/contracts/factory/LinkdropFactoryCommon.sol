pragma solidity ^0.5.6;

import "./CloneFactory.sol";
import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/math/Safemath.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage, CloneFactory {
    using SafeMath for uint;

    function updateMasterCopy(address payable _masterCopy)
    external
    returns (bool)
    {
        version[_masterCopy] = version[masterCopy].add(1);
        masterCopy = _masterCopy;
        return true;
    }

    function getCurrentVersion() public view returns (uint) {
        return version[masterCopy];
    }

    function upgradeProxy()
    public
    returns (address payable)
    {
        require(isDeployed(msg.sender), "Not deployed");
        address payable proxy = address(uint160(_deployed[msg.sender]));
        //require(ILinkdropCommon(proxy).die(), "Fucked up");
        deployProxy(msg.sender);
    }

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

        // Initialize linkdrop master and contract version in newly deployed proxy contract
        require(ILinkdropCommon(proxy).initializer(_linkdropMaster, getCurrentVersion()), "Failed to initialize");
        emit Deployed(proxy, keccak256(abi.encodePacked(_linkdropMaster)), now);

        return proxy;
    }


}