pragma solidity >= 0.5.0;

interface ILinkdropERC721 {

    function verifySenderSignatureERC721
    (
        address _token,
        uint _tokenId,
        uint _expiration,
        address _linkId,
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
        uint _expiration,
        address _linkId, 
        bytes calldata _senderSignature,
        address _receiver, 
        bytes calldata _receiverSignature
    )
    external view returns (bool);

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
    external returns (bool);

}
