pragma solidity ^0.5.6;

import "../interfaces/ILinkdropERC721.sol";
import "./LinkdropFactoryCommon.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";

contract LinkdropFactoryERC721 is LinkdropFactoryCommon {

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignatureERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        address _sender,
        bytes memory _senderSignature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_weiAmount, _nftAddress, _tokenId, _expiration, _linkId)));
        address signer = ECDSA.recover(prefixedHash, _senderSignature);
        return signer == _sender;
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _signature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if signed with link key
    */
    function verifyReceiverSignatureERC721
    (
        address _linkId,
        address _receiver,
        bytes memory _signature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params, make sure the link is not claimed or canceled and proxy is allowed to spend token
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function checkClaimParamsERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        address payable _sender,
        bytes memory _senderSignature,
        address _receiver,
        bytes memory _receiverSignature,
        address _proxy
    )
    public view
    returns (bool)
    {
        // If proxy is deployed
        if (isDeployed(_sender)) {

            return ILinkdropERC721(_deployed[_sender]).checkClaimParamsERC721
            (
                _weiAmount,
                _nftAddress,
                _tokenId,
                _expiration,
                _linkId,
                _senderSignature,
                _receiver,
                _receiverSignature
            );

        }
        else {

            // Make sure nft address is not equal to address(0)
            require(_nftAddress != address(0), "Invalid nft address");

            // Make sure claim amount is available for proxy contract
            require(_proxy.balance >= _weiAmount, "Insufficient funds");

            // Make sure the token is available for proxy contract
            require(IERC721(_nftAddress).ownerOf(_tokenId) == _proxy, "Unavailable token");

            // Verify that link key is legit and signed by sender's private key
            require
            (
                verifySenderSignatureERC721(_weiAmount, _nftAddress, _tokenId, _expiration, _linkId, _sender, _senderSignature),
                "Invalid sender signature"
            );

            // Make sure the link is not expired
            require(_expiration >= now, "Expired link");

            // Verify that receiver address is signed by ephemeral key assigned to claim link (link key)
            require
            (
                verifyReceiverSignatureERC721(_linkId, _receiver, _receiverSignature),
                "Invalid receiver signature"
            );

            return true;
        }

    }

    /**
    * @dev Function to claim ETH and/or ERC721 token
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function claimERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        address payable _sender,
        bytes calldata _senderSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    returns (bool)
    {
        // Check whether the proxy is deployed for sender and deploy if not
        if (!isDeployed(_sender)) {
            deployProxy(_sender);
        }

        // Call claim function in the context of proxy contract
        ILinkdropERC721(_deployed[_sender]).claimERC721
        (
            _weiAmount,
            _nftAddress,
            _tokenId,
            _expiration,
            _linkId,
            _senderSignature,
            _receiver,
            _receiverSignature
        );

        return true;

    }

}