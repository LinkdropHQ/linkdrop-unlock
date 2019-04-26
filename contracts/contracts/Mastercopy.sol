pragma solidity >= 0.5.6;

import "./interfaces/ILinkdrop.sol";
import "./interfaces/ILinkdropERC721.sol";
import "./Storage.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Mastercopy is Storage, ILinkdrop, ILinkdropERC721 {   

    // =================================================================================================================
    //                                         Common
    // =================================================================================================================

    function initializer
    (   
        address payable _sender
    ) 
    public
    returns (bool)
    {
        require(_initialized == false, "Initialized");
        SENDER = _sender;
        _initialized = true;
        return true;
    }

    modifier onlySender() {
        require(msg.sender == SENDER, "Only sender");
        _;
    }

    modifier whenNotPaused() {
        require(!paused(), "Paused");
        _;
    }
    
    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimedTo[_linkId] != address(0); 
    }

    function isCanceledLink(address _linkId) public view returns (bool) {
        return _canceled[_linkId];
    }

    function paused() public view returns (bool) {
        return _paused;
    }

    function cancel(address _linkId) external onlySender returns (bool) {
        require(isClaimedLink(_linkId) == false, "Claimed link");
        _canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    // Withdraw ether
    function withdraw() external onlySender returns (bool) {
        SENDER.transfer(address(this).balance);
        return true;
    }

    function pause() external onlySender whenNotPaused returns (bool) {
        _paused = true;
        emit Paused(now);
        return true;
    }

    function unpause() external onlySender returns (bool) {
        require(paused(), "Unpaused");
        _paused = false;
        emit Unpaused(now);
        return true;
    }

    // Fallback function to accept ethers
    function () external payable {} 

    // =================================================================================================================
    //                                         ERC20, Ether
    // =================================================================================================================

    function verifySenderSignature
    (
        address _token,
        uint _amount,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_token, _amount, _expiration,  _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == SENDER;
    }

    function verifyReceiverSignature
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

    function checkClaimParams
    (
        address _token,
        uint _amount,
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
            verifySenderSignature(_token, _amount, _expiration, _linkId, _senderSignature),
            "Invalid sender signature"
        );

        // Verify the link is not expired
        require(_expiration >= now, "Expired link");

        // Verify that receiver address is signed by ephemeral key assigned to claim link
        require
        (
            verifyReceiverSignature(_linkId, _receiver, _receiverSignature), 
            "Invalid receiver signature"
        );

        return true;
    }

    function claim
    (
        address _token, 
        uint _amount,
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
        require
        (
            checkClaimParams
            (
                _token,
                _amount,
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

        require(_transferEthOrTokens(_token, _amount, _receiver), "Transfer failed");

        // Log claim
        emit Claimed(_linkId, _token, _amount, _receiver, now);

        return true;
    }

    function _transferEthOrTokens(address _token, uint _amount, address payable _receiver)
    internal returns (bool)
    {

        // Send tokens
        if (_amount > 0 && address(_token) != address(0)) {
            IERC20(_token).transfer(_receiver, _amount); 
        }

        // Send ether (if thats the case)
        if (_amount > 0 && address(_token) == address(0)) {
            _receiver.transfer(_amount);
        }

        return true;
    }

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
        IERC721(_token).safeTransferFrom(address(this), _receiver, _tokenId); 

        // Log claim
        emit Claimed(_linkId, _token, _tokenId, _receiver, now);

        return true;
    }

}