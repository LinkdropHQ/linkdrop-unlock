pragma solidity >= 0.5.6;

import "./interfaces/ILinkdropERC721.sol";
import "./Storage.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract LinkdropERC721 is Storage, ILinkdropERC721, Pausable {    

    function initializer
    (   
        address payable _sender
    ) 
    public
    returns (bool)
    {
        require(initialized == false, "Initializer can only be called once");
        SENDER = _sender;
        initialized = true;
        return true;
    }
    

    // =================================================================================================================
    //                                         Common
    // =================================================================================================================

    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimedTo[_linkId] != address(0); 
    }

    function isCanceledLink(address _linkId) public view returns (bool) {
        return canceled[_linkId];
    }

    function cancel(address _linkId) external returns (bool) {
        require(msg.sender == SENDER, "Only sender can cancel");
        require(isClaimedLink(_linkId) == false, "Link has been claimed");
        canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    // Withdraw ether
    function withdraw() external returns (bool) {
        require(msg.sender == SENDER, "Only sender can withdraw ether");
        SENDER.transfer(address(this).balance);
        return true;
    }

    // Fallback function to accept ethers
    function () external payable {} 
    
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
        require(isClaimedLink(_linkId) == false, "Link has already been claimed");
        require(isCanceledLink(_linkId) == false, "Link has been canceled");

        // Verify that ephemeral key is legit and signed by VERIFICATION_ADDRESS's key
        require
        (
            verifySenderSignatureERC721(_token, _tokenId, _expiration, _linkId, _senderSignature),
            "Link key is not signed by sender verification key"
        );

        // Verify the link is not expired
        require(_expiration >= now, "Link has expired");

        // Verify that receiver address is signed by ephemeral key assigned to claim link
        require
        (
            verifyReceiverSignatureERC721(_linkId, _receiver, _receiverSignature), 
            "Receiver address is not signed by link key"
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
        require(_token != address(0), "Cannot claim ethers");

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
        IERC721(_token).safeTransferFrom(SENDER, _receiver, _tokenId); 

        // Log claim
        emit Claimed(_linkId, _token, _tokenId, _receiver, now);

        return true;
    }
    
}
