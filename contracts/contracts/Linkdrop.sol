pragma solidity >= 0.5.6;

import "./interfaces/ILinkdrop.sol";
import "./Common.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Linkdrop is ILinkdrop, Common {   

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

}