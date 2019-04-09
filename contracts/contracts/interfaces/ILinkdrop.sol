pragma solidity >= 0.5.0;

interface ILinkdrop {

    // event Canceled(address linkId, uint timestamp);
    // event Claimed(address indexed linkId, address token, uint amount, address receiver, uint timestamp);

    function verifySenderSignature
    (
        address _token,
        uint _amount,
        address _linkId,
        uint _expiration,
        bytes calldata _signature
    )
    external view returns (bool);

    function verifyReceiverSignature
    (
        address _linkId,
	    address _receiver,
		bytes calldata _signature
    )
    external view returns (bool);

    function checkClaimParams
    (
        address _token,
        uint _amount,
        address _linkId, 
        uint _expiration,
        bytes calldata _senderSignature,
        address _receiver, 
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claim
    (
        address _token, 
        uint _amount,
        address _linkId, 
        uint _expiration,
        bytes calldata _senderSignature, 
        address payable _receiver, 
        bytes calldata _receiverSignature
    ) 
    external returns (bool);

    function isClaimedLink(address _linkId) external view returns (bool);
    function cancel(address _linkId) external returns (bool);
    
}

// ${host}/#/claim?t=${tokenAddress}&a=${claimAmount}&exp=${expirationTime}&pk=${linkKey}&sig=${senderSignature}&c=${contractAddress}