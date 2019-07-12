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
    * @param _campaignId Campaign id
    * @return True if deployed
    */
    function isDeployed(address _linkdropMaster, uint _campaignId) public view returns (bool) {
        return (deployed[salt(_linkdropMaster, _campaignId)] != address(0));
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkdropMaster Address of lindkrop master
    * @param _campaignId Campaign id
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address payable _linkdropMaster, uint _campaignId, address _linkId) public view returns (bool) {

        if (!isDeployed(_linkdropMaster, _campaignId)) {
            return false;
        }
        else {
            address payable proxy = address(uint160(deployed[salt(_linkdropMaster, _campaignId)]));
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function deployProxy(uint _campaignId)
    public
    returns (address payable proxy)
    {
        proxy = _deployProxy(msg.sender, _campaignId);
    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender and add a new signing key
    * @param _campaignId Campaign id
    * @param _signer Address corresponding to signing key
    * @return Proxy contract address
    */
    function deployProxyWithSigner(uint _campaignId, address _signer)
    public
    returns (address payable proxy)
    {
        proxy = deployProxy(_campaignId);
        ILinkdropCommon(proxy).addSigner(_signer);
    }

    /**
    * @dev Internal function to deploy a proxy contract for linkdrop master
    * @param _linkdropMaster Address of linkdrop master
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function _deployProxy(address payable _linkdropMaster, uint _campaignId)
    internal
    returns (address payable proxy)
    {

        require(!isDeployed(_linkdropMaster, _campaignId), "Deployed");
        require(_linkdropMaster != address(0), "Invalid linkdrop master address");

        bytes32 salt = salt(_linkdropMaster, _campaignId);
        bytes memory initcode = getInitcode();

        assembly {
            proxy := create2(0, add(initcode, 0x20), mload(initcode), salt)
            if iszero(extcodesize(proxy)) { revert(0, 0) }
        }

        deployed[salt] = proxy;

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
    * @param _campaignId Campaign id
    * @return True if destroyed successfully
    */
    function destroyProxy(uint _campaignId)
    public
    returns (bool)
    {
        address payable proxyOwner = msg.sender;
        require(isDeployed(proxyOwner, _campaignId), "Not deployed");
        address payable proxy = address(uint160(deployed[salt(msg.sender, _campaignId)]));
        ILinkdropCommon(proxy).destroy();
        delete deployed[salt(msg.sender, _campaignId)];
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
    * @param _linkdropMaster Address of linkdrop master
    * @param _campaignId Campaign id
    * @return Master copy version
    */
    function getProxyMasterCopyVersion(address _linkdropMaster, uint _campaignId) external view returns (uint) {

        if (!isDeployed(_linkdropMaster, _campaignId)) {
            return masterCopyVersion;
        }
        else {
            address payable proxy = address(uint160(deployed[salt(_linkdropMaster, _campaignId)]));
            return ILinkdropCommon(proxy).getMasterCopyVersion();
        }
    }

    /**
     * @dev Function to hash `_linkdropMaster` and `_campaignId` params. Used as salt when deploying with create2
     * @param _linkdropMaster Address of linkdrop master
     * @param _campaignId Campaign id
     * @return Hash of passed arguments
     */
    function salt(address _linkdropMaster, uint _campaignId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_linkdropMaster, _campaignId));
    }

}