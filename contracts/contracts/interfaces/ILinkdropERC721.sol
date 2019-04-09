
interface ILinkdropERC721 {

    event Canceled(address linkId, uint timestamp);
    event Claimed(address indexed linkId, uint indexed tokenId, address receiver, uint timestamp);

    function verifySenderSignatureERC721
    (
        address _token,
        uint _tokenId,
        address _linkId,
        uint _expiration,
        bytes calldata _signature
    )
    external view returns (bool);

    function verifyReceiverSignatureERC721
    (
        address _linkId,
	    address _receiver,
		bytes calldata _signature
    )
    external view returns (bool);

    function checkClaimParamsERC721
    (
        address _token,
        uint _tokenId,
        address _linkId, 
        uint _expiration,
        bytes calldata _senderSignature,
        address _receiver, 
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claimERC721
    (
        address _token, 
        uint _tokenId,
        address _linkId, 
        uint _expiration,
        bytes calldata _senderSignature, 
        address _receiver, 
        bytes calldata _receiverSignature
    ) 
    external returns (bool);

    function isClaimedLink(address _linkId) external view returns (bool);
    function cancel(address _linkId) external returns (bool);
    
}

// ${host}/#/claim?t=${tokenAddress}&id=${tokenId}&exp=${expirationTime}&pk=${linkKey}&sig=${senderSignature}&c=${contractAddress}