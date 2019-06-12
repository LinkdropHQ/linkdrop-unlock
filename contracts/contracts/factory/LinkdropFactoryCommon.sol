pragma solidity ^0.5.6;

import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage {
    using SafeMath for uint;

    /**
    * @dev Indicates whether a proxy contract for linkdrop master is deployed or not
    * @param _linkdropMaster Address of linkdrop master
    * @return True if deployed
    */
    function isDeployed(address _linkdropMaster) public view returns (bool) {
        return (deployed[_linkdropMaster] != address(0));
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
            address payable proxy = address(uint160(deployed[_linkdropMaster]));
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender
    * @return Proxy contract address
    */
    function deployProxy()
    public
    returns (address payable)
    {
        address payable proxy = _deployProxy(msg.sender);
        return proxy;
    }

    /**
    * @dev Internal function to deploy a proxy contract for linkdrop master
    * @param _linkdropMaster Address of linkdrop master
    * @return Proxy contract address
    */
    function _deployProxy(address payable _linkdropMaster)
    internal
    returns (address payable)
    {

        require(!isDeployed(_linkdropMaster), "Deployed");
        require(_linkdropMaster != address(0), "Invalid linkdrop master address");

        bytes32 salt = keccak256(abi.encodePacked(_linkdropMaster));
        bytes memory initcode = getInitcode();

        address payable proxy;

        assembly {
            proxy := create2(0, add(initcode, 0x20), mload(initcode), salt)
            if iszero(extcodesize(proxy)) { revert(0, 0) }
        }

        deployed[_linkdropMaster] = proxy;

        // Initialize owner address, linkdrop master address and master copy version in proxy contract
        require
        (
            ILinkdropCommon(proxy).initialize
            (
                address(this), // Owner address
                _linkdropMaster, // Linkdrop master address
                masterCopyVersion,
                chainId
            ),
            "Failed to initialize"
        );

        emit Deployed(_linkdropMaster, proxy, salt, now);
        return proxy;
    }

    /**
    * @dev Function to destroy proxy contract, called by proxy owner
    * @return True if destroyed successfully
    */
    function destroyProxy()
    public
    returns (bool)
    {
        address payable proxyOwner = msg.sender;
        require(isDeployed(proxyOwner), "Not deployed");
        address payable proxy = address(uint160(deployed[proxyOwner]));
        ILinkdropCommon(proxy).destroy();
        delete deployed[proxyOwner];
        emit Destroyed(proxyOwner, proxy, now);
        return true;
    }

    /**
    * @dev Function to get bootstrap initcode for generating repeatable contract addresses
    * @return Static bootstrap initcode
    */
    function getInitcode()
    public view
    returns (bytes memory)
    {
        return _initcode;
    }

    /**
    * @dev Function to fetch the actual contract bytecode to install. Called by proxy when executing initcode
    * @return Contract bytecode to install
    */
    function getBytecode()
    public view
    returns (bytes memory)
    {
        return _bytecode;
    }

    /**
    * @dev Function to set new master copy and update contract bytecode to install. Can only be called by factory owner
    * @param _masterCopy Address of linkdrop mastercopy contract to calculate bytecode from
    * @return True if updated successfully
    */
    function setMasterCopy(address payable _masterCopy)
    public returns (bool)
    {
        require(msg.sender == owner, "Only factory owner");
        require(_masterCopy != address(0), "Invalid master copy address");
        masterCopyVersion = masterCopyVersion.add(1);

        require
        (
            ILinkdropCommon(_masterCopy).initialize
            (
                address(0), // Owner address
                address(0), // Linkdrop master address
                masterCopyVersion,
                chainId
            ),
            "Failed to initialize"
        );

        bytes memory bytecode = abi.encodePacked
        (
            hex"363d3d373d3d3d363d73",
            _masterCopy,
            hex"5af43d82803e903d91602b57fd5bf3"
        );

        _bytecode = bytecode;

        emit SetMasterCopy(_masterCopy, masterCopyVersion, now);
        return true;
    }

    /**
    * @dev Function to fetch the master copy version installed (or to be installed) to proxy
    * @return Master copy version
    */
    function getProxyMasterCopyVersion(address _linkdropMaster) external view returns (uint) {

        if (!isDeployed(_linkdropMaster)) {
            return masterCopyVersion;
        }
        else {
            address payable proxy = address(uint160(deployed[_linkdropMaster]));
            return ILinkdropCommon(proxy).getMasterCopyVersion();
        }
    }

}