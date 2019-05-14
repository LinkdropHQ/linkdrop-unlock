pragma solidity ^0.5.6;

import "./LinkdropCommon.sol";
import "../interfaces/ILinkdropERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";

contract LinkdropERC721 is ILinkdropERC721, LinkdropCommon {

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignatureERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_weiAmount, _nftAddress, _tokenId, _expiration, _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == sender;
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
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params and make sure the link is not claimed or canceled
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
        bytes memory _senderSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    public view
    returns (bool)
    {
        // Make sure nft address is not equal to address(0)
        require(_nftAddress != address(0), "Invalid nft address");

        // Make sure claim amount is available for proxy contract
        require(address(this).balance >= _weiAmount, "Insufficient funds");

        // Make sure token is available for this contract
        require(IERC721(_nftAddress).ownerOf(_tokenId) == address(this), "Unavailable token");

        // Make sure link is not claimed or canceled
        require(isClaimedLink(_linkId) == false, "Claimed link");
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Verify that link key is legit and signed by sender's private key
        require
        (
            verifySenderSignatureERC721(_weiAmount, _nftAddress, _tokenId, _expiration, _linkId, _senderSignature),
            "Invalid sender signature"
        );

        // Make sure link is not expired
        require(_expiration >= now, "Expired link");

        // Verify that receiver address is signed by ephemeral key assigned to claim link (link key)
        require
        (
            verifyReceiverSignatureERC721(_linkId, _receiver, _receiverSignature),
            "Invalid receiver signature"
        );

        return true;
    }

    /**
    * @dev Function to claim ETH and/or ERC721 token. Can only be called when contract is not paused
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
    function claimERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes calldata _senderSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    whenNotPaused
    returns (bool)
    {

        // Make sure params are valid
        require
        (
            checkClaimParamsERC721
            (
                _weiAmount,
                _nftAddress,
                _tokenId,
                _expiration,
                 _linkId,
                _senderSignature,
                _receiver,
                _receiverSignature
            ),
            "Invalid claim params"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require(_transfer(_weiAmount, _nftAddress, _tokenId, _receiver), "Transfer failed");

        // Log claim
        emit ClaimedERC721(_linkId, _weiAmount, _nftAddress, _tokenId, _receiver, now);

        return true;
    }

    /**
    * @dev Internal function to transfer ETH and/or ERC20 tokens
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Amount of tokens to be claimed (in atomic value)
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transfer(uint _weiAmount, address _nftAddress, uint _tokenId, address payable _receiver)
    internal returns (bool)
    {
        // Transfer ETH
        if (_weiAmount > 0) {
            _receiver.transfer(_weiAmount);
        }

        IERC721(_nftAddress).safeTransferFrom(address(this), _receiver, _tokenId);

        return true;
    }

}