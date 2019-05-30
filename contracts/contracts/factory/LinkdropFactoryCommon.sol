pragma solidity ^0.5.6;

import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/math/Safemath.sol";

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
    * @dev Function to deploy a proxy contract for linkdrop master
    * @param _linkdropMaster Address of linkdrop master
    * @return Proxy contract address
    */
    function deployProxy(address payable _linkdropMaster)
    public
    returns (address payable proxy)
    {

        bytes32 salt = keccak256(abi.encodePacked(_linkdropMaster));
        bytes memory initcode = getInitcode();

        assembly {
            proxy := create2(0, add(initcode, 0x20), mload(initcode), salt)
        }

        deployed[_linkdropMaster] = proxy;

        // Initialize linkdrop master and contract version in newly deployed proxy contract
        require(ILinkdropCommon(proxy).initializer(_linkdropMaster, version), "Failed to initialize");
        emit Deployed(_linkdropMaster, proxy, salt, now);
        return proxy;
    }

    /**
    * @dev Function to destroy proxy contract, called by proxy owner
    * @return True is destroyed succesfully
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
    * @dev Function to get initcode used to deploy proxy contracts to the same addresses
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
    * @dev Function to update the runtime bytecode. Can only be called by factory owner
    * @param __bytecode Contract bytecode to install
    * @return True if updated succesfully
    */
    function updateBytecode(bytes memory __bytecode)
    public returns (bool)
    {
        require(msg.sender == owner, "Only factory owner");
        _bytecode = __bytecode;
        version = version.add(1);
        emit UpdatedBytecode(_bytecode, version, now);
        return true;
    }

}