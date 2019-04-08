
contract IERC721Linkdrop {

    event Canceled(address link, uint timestamp);
    event Claimed(address indexed link, address receiver, uint timestamp);

    function verifySenderSignatureERC721
    (
        address _token,
        uint _tokenId,
        address _link,
        uint _expiration,
        bytes memory _signature
    )
    public view returns (bool) {}

    function verifyReceiverSignatureERC721
    (
        address _link,
	    address _receiver,
		bytes memory _signature
    )
    public view returns (bool) {}

    function checkClaimParamsERC721
    (
        address _token,
        uint _tokenId,
        address _link, 
        uint _expiration,
        bytes memory _senderSignature,
        address _receiver, 
        bytes memory _receiverSignature
    )
    public view returns (bool) {}

    function claimERC721
    (
        address _token, 
        uint _tokenId,
        address _link, 
        uint _expiration,
        address _receiver, 
        bytes memory _senderSignature, 
        bytes memory _receiverSignature
    ) 
    public returns (bool) {}

    function isValidLink(address _link) external view returns (bool) {}
    function isExpiredLink(uint _linkExpiration) external view returns (bool) {}
    
    function cancel(address _link) external returns (bool) {}
    
}

// ${host}/#/claim?t=${tokenAddress}&id=${tokenId}&exp=${expirationTime}&pk=${linkKey}&sig=${senderSignature}&c=${contractAddress}
