pragma solidity >= 0.5.6;

import "./interfaces/ILinkdropERC721.sol";
import "./Common.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LinkdropERC721 is ILinkdropERC721, Common {    
    
    // =================================================================================================================
    //                                         ERC721
    // =================================================================================================================

    function verifySenderSignatureERC721
    (
        address _token,
        uint _tokenId,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_token, _tokenId, _expiration, _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == SENDER;
    }

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

    function checkClaimParamsERC721
    (
        address _token,
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
        // Verify that link wasn't claimed before
        require(isClaimedLink(_linkId) == false, "Claimed link");
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Verify that ephemeral key is legit and signed by VERIFICATION_ADDRESS's key
        require
        (
            verifySenderSignatureERC721(_token, _tokenId, _expiration, _linkId, _senderSignature),
            "Invalid sender signature"
        );

        // Verify the link is not expired
        require(_expiration >= now, "Expired link");

        // Verify that receiver address is signed by ephemeral key assigned to claim link
        require
        (
            verifyReceiverSignatureERC721(_linkId, _receiver, _receiverSignature), 
            "Invalid receiver signature"
        );

        return true;
    }

    function claimERC721
    (
        address _token, 
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
        require(_token != address(0), "");

        require
        (
            checkClaimParamsERC721
            (
                _token,
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

        // Send NFT
        IERC721(_token).transferFrom(address(this), _receiver, _tokenId); 

        // Log claim
        emit Claimed(_linkId, _token, _tokenId, _receiver, now);

        return true;
    }
    
}