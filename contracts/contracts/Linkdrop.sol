pragma solidity >= 0.5.6;

import "./interfaces/ILinkdrop.sol";
import "./interfaces/ILinkdropERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Linkdrop is Pausable {

    event Canceled(address linkId, uint timestamp);
    event Claimed(address indexed linkId, address token, uint amount, address receiver, uint timestamp);

    address payable public SENDER; 
    address public SENDER_VERIFICATION_ADDRESS; 

    //Indicates whether the link was used or not
    mapping (address => bool) private claimed;
    mapping (address => bool) private canceled;

    constructor
    (
        address _senderVerificationAddress
    ) 
    public
    {
        SENDER = msg.sender;
        SENDER_VERIFICATION_ADDRESS = _senderVerificationAddress;
    }

    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimed[_linkId];
    }

    function isCanceledLink(address _linkId) public view returns (bool) {
        return canceled[_linkId];
    }
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
        return signer == SENDER_VERIFICATION_ADDRESS;
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
        require(isClaimedLink(_linkId) == false, "Link has already been claimed");
        require(isCanceledLink(_linkId) == false, "Link has been canceled");

        // Verify that ephemeral key is legit and signed by VERIFICATION_ADDRESS's key
        require
        (
            verifySenderSignature(_token, _amount, _expiration, _linkId, _senderSignature),
            "Link key is not signed by sender verification key"
        );

        // Verify the link is not expired
        require(_expiration >= now, "Link has expired");

        // Verify that receiver address is signed by ephemeral key assigned to claim link
        require
        (
            verifyReceiverSignature(_linkId, _receiver, _receiverSignature), 
            "Receiver address is not signed by link key"
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
        claimed[_linkId] = true;

        // Send tokens
        if (_amount > 0 && address(_token) != address(0)) {
            IERC20(_token).transferFrom(SENDER, _receiver, _amount); 
        }

        //Send ether (if thats the case)
        if (_amount > 0 && address(_token) == address(0)) {
            _receiver.transfer(_amount);
        }

        // Log claim
        emit Claimed(_linkId, _token, _amount, _receiver, now);

        return true;
    }

    function cancel(address _linkId) external returns (bool) {
        require(msg.sender == SENDER, "Only sender can cancel");
        canceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    function () external payable {} 
    
}
