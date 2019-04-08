
contract IERC20Linkdrop {

    event Canceled(address link, uint timestamp);
    event Claimed(address indexed link, address receiver, uint timestamp);

    function verifySenderSignatureERC20
    (
        address _token,
        uint _amount,
        address _link,
        uint _expiration,
        bytes memory _signature
    )
    public view returns (bool) {}

    function verifyReceiverSignatureERC20
    (
        address _link,
	    address _receiver,
		bytes memory _signature
    )
    public view returns (bool) {}

    function checkClaimParamsERC20
    (
        address _token,
        uint _amount,
        address _link, 
        uint _expiration,
        bytes memory _senderSignature,
        address _receiver, 
        bytes memory _receiverSignature
    )
    public view returns (bool) {}

    function claimERC20
    (
        address _token, 
        uint _amount,
        address _link, 
        uint _expiration,
        bytes memory _senderSignature, 
        address _receiver, 
        bytes memory _receiverSignature
    ) 
    public returns (bool) {}

    function isValidLink(address _link) external view returns (bool) {}
    function isExpiredLink(uint _linkExpiration) external view returns (bool) {}

    function cancel(address _link) external returns (bool) {}
    
}

// ${host}/#/claim?t=${tokenAddress}&a=${claimAmount}&exp=${expirationTime}&pk=${linkKey}&sig=${senderSignature}&c=${contractAddress}
