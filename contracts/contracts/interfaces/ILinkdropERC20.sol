pragma solidity ^0.5.6;

interface ILinkdropERC20 {

    function verifySenderSignature
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
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
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes calldata _senderSignature,
        address _receiver,
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claim
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes calldata _senderSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external returns (bool);

}