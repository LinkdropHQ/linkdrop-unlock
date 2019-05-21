pragma solidity ^0.5.6;

import "../../interfaces/approve/ILinkdropERC20Approve.sol";
import "../../interfaces/approve/ILinkdropFactoryERC20Approve.sol";
import "../LinkdropFactoryCommon.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract LinkdropFactoryERC20Approve is ILinkdropFactoryERC20Approve, LinkdropFactoryCommon {

    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _linkdropSigner Address of linkdrop signer
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @return True if signed with linkdrop signer's private key
    */
    function verifyLinkdropSignerSignature
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address _linkdropSigner,
        bytes memory _linkdropSignerSignature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_weiAmount, _tokenAddress, _tokenAmount, _expiration,  _linkId)));
        address signer = ECDSA.recover(prefixedHash, _linkdropSignerSignature);
        return signer == _linkdropSigner;
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _signature ECDSA signature of linkdrop receiver
    * @return True if signed with link key
    */
    function verifyReceiverSignature
    (
        address _linkId,
        address _receiver,
        bytes memory _signature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params, make sure the link is not claimed or canceled and proxy has sufficient balance
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _approver Approver address
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParams
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address _approver,
        address payable _linkdropSigner,
        bytes memory _linkdropSignerSignature,
        address _receiver,
        bytes memory _receiverSignature,
        address _proxy
    )
    public view
    returns (bool)
    {
        // If proxy is deployed
        if (isDeployed(_linkdropSigner)) {

            return ILinkdropERC20Approve(_deployed[_linkdropSigner]).checkClaimParams
            (
                _weiAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                _linkId,
                _approver,
                _linkdropSignerSignature,
                _receiver,
                _receiverSignature
            );

        }
        else {

            // Make sure claim amount is available for proxy contract
            require
            (
                _proxy.balance >= _weiAmount,"Insufficient amount of eth"
            );

            if (_tokenAddress != address(0)) {
                require(IERC20(_tokenAddress).allowance(_approver, _proxy) >= _tokenAmount, "Insufficient amount of tokens");
            }

            // Verify that link key is legit and signed by linkdrop signer's private key
            require
            (
                verifyLinkdropSignerSignature
                (
                    _weiAmount,
                    _tokenAddress,
                    _tokenAmount,
                    _expiration,
                    _linkId,
                    _linkdropSigner,
                    _linkdropSignerSignature
                ),
                "Invalid linkdrop signer signature"
            );

            // Make sure link is not expired
            require(_expiration >= now, "Expired link");

            // Verify that receiver address is signed by ephemeral key assigned to claim link (link key)
            require
            (
                verifyReceiverSignature(_linkId, _receiver, _receiverSignature),
                "Invalid receiver signature"
            );

            return true;
        }

    }

    /**
    * @dev Function to claim ETH and/or ERC20 tokens
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _approver Approver address
    * @param _linkdropSigner Address of linkdrop signer
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claim
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address _approver,
        address payable _linkdropSigner,
        bytes calldata _linkdropSignerSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    returns (bool)
    {

        // Check whether the proxy is deployed for linkdrop signer and deploy if not
        if (!isDeployed(_linkdropSigner)) {
            deployProxy(_linkdropSigner);
        }

        // Call claim function in the context of proxy contract
        ILinkdropERC20Approve(_deployed[_linkdropSigner]).claim
        (
            _weiAmount,
            _tokenAddress,
            _tokenAmount,
            _expiration,
            _linkId,
            _approver,
            _linkdropSignerSignature,
            _receiver,
            _receiverSignature
        );

        return true;

    }

}