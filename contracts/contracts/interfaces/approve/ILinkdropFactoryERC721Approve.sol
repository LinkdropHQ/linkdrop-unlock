pragma solidity ^0.5.6;

interface ILinkdropFactoryERC721Approve {

    function verifyLinkdropSignerSignatureERC721
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _expiration,
        uint _version,
        uint _chainId,
        address _linkId,
        address _linkdropSigner,
        bytes calldata _linkdropSignerSignature
    )
    external pure
    returns (bool);

    function verifyReceiverSignatureERC721
    (
        address _linkId,
        address _receiver,
        bytes calldata _signature
    )
    external pure
    returns (bool);

    function checkClaimParamsERC721Approve
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
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

    function claimERC721Approve
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
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