pragma solidity ^0.5.6;

import "./CloneFactory.sol";
import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage, CloneFactory {

    /**
    * @dev Indicates whether a proxy contract for linkdrop signer is deployed or not
    * @param _linkdropSigner Address of lindkrop signer
    * @return True if deployed
    */
    function isDeployed(address _linkdropSigner) public view returns (bool) {
        return (_deployed[_linkdropSigner] != address(0));
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkdropSigner Address of lindkrop signer
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address payable _linkdropSigner, address _linkId) public view returns (bool) {

        if (!isDeployed(_linkdropSigner)) {
            return false;
        }
        else {
            address payable proxy = address(uint160(_deployed[_linkdropSigner]));
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for linkdrop signer
    * @param _linkdropSigner Address of linkdrop signer
    * @return Proxy contract address
    */
    function deployProxy(address payable _linkdropSigner)
    public
    returns (address payable)
    {

        // Create clone of the mastercopy
        address payable proxy = createClone(masterCopy, keccak256(abi.encodePacked(_linkdropSigner)));

        _deployed[_linkdropSigner] = proxy;

        // Initialize linkdrop signer in newly deployed proxy contract
        require(ILinkdropCommon(proxy).initializer(_linkdropSigner), "Failed to initialize");
        emit Deployed(proxy, keccak256(abi.encodePacked(_linkdropSigner)), now);

        return proxy;
    }


}