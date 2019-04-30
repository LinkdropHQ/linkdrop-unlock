pragma solidity >= 0.5.6;
import "./Common.sol";
import "./interfaces/ILinkdropERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropERC721 is ILinkdropERC721, Common {    
    
    // =================================================================================================================
    //                                         ERC721 Linkdrop
    // =================================================================================================================

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _nft NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignatureERC721
    (
        address _nft,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_nft, _tokenId, _expiration, _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == SENDER;
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
    * @param _nft NFT address
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
        address _nft,
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
        // Make sure the token is available for this contract
        require(isAvailableToken(_nft, _tokenId), "Unavailable token");

        // Make sure the link is not claimed or canceled
        require(isClaimedLink(_linkId) == false, "Claimed link");
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Verify that link key is legit and signed by sender's private key
        require
        (
            verifySenderSignatureERC721(_nft, _tokenId, _expiration, _linkId, _senderSignature),
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

    /**
    * @dev Function to claim ERC721 token. Can only be called when contract is not paused
    * @param _nft NFT address
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
        address _nft, 
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
        // Make sure that nft address is not equal to address(0)
        require(_nft != address(0), "");

        // Make sure that params are valid
        require
        (
            checkClaimParamsERC721
            (
                _nft,
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

        // Transfer NFT
        if (IERC721(_nft).ownerOf(_tokenId) == address(this)) 
            IERC721(_nft).safeTransferFrom(address(this), _receiver, _tokenId); 
        else if (IERC721(_nft).getApproved(_tokenId) == address(this)) 
            IERC721(_nft).safeTransferFrom(SENDER, _receiver, _tokenId); 
        else revert();

        // Log claim
        emit Claimed(_linkId, _nft, _tokenId, _receiver, now);

        return true;
    }

    /**
    * @dev Function to get whether a NFT with token id is available for this contract
    * @param _nft NFT address
    * @param _tokenId Token id
    * @return Total amount available
    */
    function isAvailableToken(address _nft, uint _tokenId) public view returns (bool) {
       if (IERC721(_nft).ownerOf(_tokenId) == address(this)) return true;
       else if (IERC721(_nft).getApproved(_tokenId) == address(this)) return true;
    }
    
}