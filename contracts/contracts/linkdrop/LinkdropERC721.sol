pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../interfaces/ILinkdropERC721.sol";
import "./LinkdropCommon.sol";

contract LinkdropERC721 is ILinkdropERC721, LinkdropCommon {

    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _version Linkdrop contract version
    * @param _chainId Network id
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop signer
    * @return True if signed with linkdrop signer's private key
    */
    function verifyLinkdropSignerSignatureERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        uint _version,
        uint _chainId,
        address _linkId,
        bytes memory _signature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash
        (
            keccak256
            (
                abi.encodePacked
                (
                    _weiAmount,
                    _nftAddress,
                    _tokenId,
                    _expiration,
                    _version,
                    _chainId,
                    _linkId
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _signature);
        return isLinkdropSigner[signer];
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _signature ECDSA signature of linkdrop receiver
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
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParamsERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes memory _linkdropSignerSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    public view
    returns (bool)
    {
        // Make sure nft address is not equal to address(0)
        require(_nftAddress != address(0), "Invalid nft address");

        // Make sure link is not claimed
        require(isClaimedLink(_linkId) == false, "Claimed link id");

        // Make sure link is not canceled
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Make sure link is not expired
        require(_expiration >= now, "Expired link");

        // Make sure eth amount is available for this contract
        require(address(this).balance >= _weiAmount, "Insufficient funds");

        // Make sure nft is available for this contract
        require(IERC721(_nftAddress).ownerOf(_tokenId) == address(this), "Unavailable token");

        // Verify that link key is legit and signed by linkdrop signer's private key
        require
        (
            verifyLinkdropSignerSignatureERC721
            (
                _weiAmount,
                _nftAddress,
                _tokenId,
                _expiration,
                version,
                chainId,
                _linkId,
                _linkdropSignerSignature
            ),
            "Invalid linkdrop signer signature"
        );

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
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claimERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes calldata _linkdropSignerSignature,
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
                _linkdropSignerSignature,
                _receiver,
                _receiverSignature
            ),
            "Invalid claim params"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require(_transferFundsERC721(_weiAmount, _nftAddress, _tokenId, _receiver), "Transfer failed");

        // Log claim
        emit ClaimedERC721(_linkId, _weiAmount, _nftAddress, _tokenId, _receiver, now);

        return true;
    }

    /**
    * @dev Internal function to transfer ETH and/or ERC721 tokens
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Amount of tokens to be claimed (in atomic value)
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferFundsERC721(uint _weiAmount, address _nftAddress, uint _tokenId, address payable _receiver)
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