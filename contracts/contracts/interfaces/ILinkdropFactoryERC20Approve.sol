pragma solidity ^0.5.6;

interface ILinkdropFactoryERC20Approve {

    function verifyLinkdropSignerSignature
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        uint _version,
        uint _chainId,
        address _linkId,
        address _linkdropSigner,
        bytes calldata _linkdropSignerSignature
    )
    external pure
    returns (bool);

    function verifyReceiverSignature
    (
        address _linkId,
        address _receiver,
        bytes calldata _signature
    )
    external pure
    returns (bool);

    function checkClaimParamsApprove
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _linkdropMaster,
        bytes calldata _linkdropSignerSignature,
        address _receiver,
        bytes calldata _receiverSignature,
        address _proxy
    )
    external view
    returns (bool);

    function claimApprove
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _linkdropMaster,
        bytes calldata _linkdropSignerSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    returns (bool);

}