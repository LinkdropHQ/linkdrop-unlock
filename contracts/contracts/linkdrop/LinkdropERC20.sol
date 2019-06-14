pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/ILinkdropERC20.sol";
import "./LinkdropCommon.sol";

contract LinkdropERC20 is ILinkdropERC20, LinkdropCommon {

    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _version Linkdrop contract version
    * @param _chainId Network id
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop signer
    * @return True if signed with linkdrop signer's private key
    */
    function verifyLinkdropSignerSignature
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        uint _version,
        uint _chainId,
        address _linkId,
        bytes memory _signature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash
        (
            keccak256
            (
                abi.encodePacked
                (
                    _weiAmount,
                    _tokenAddress,
                    _tokenAmount,
                    _expiration,
                    _version,
                    _chainId,
                    _linkId
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _signature);
        return isLinkdropSigner[signer];
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
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params and make sure the link is not claimed or canceled
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver,
    * @return True if success
    */
    function checkClaimParams
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes memory _linkdropSignerSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    public view
    returns (bool)
    {
        // If tokens are being claimed
        if (_tokenAmount > 0) {
            require(_tokenAddress != address(0), "Invalid token address");
        }

        // Make sure link is not claimed
        require(isClaimedLink(_linkId) == false, "Claimed link");

        // Make sure link is not canceled
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Make sure link is not expired
        require(_expiration >= now, "Expired link");

        // Make sure eth amount is available for this contract
        require(address(this).balance >= _weiAmount, "Insufficient amount of eth");

        // Make sure tokens are available for this contract
        if (_tokenAddress != address(0)) {
            require(IERC20(_tokenAddress).balanceOf(address(this)) >= _tokenAmount, "Insufficient amount of tokens");
        }

        // Verify that link key is legit and signed by linkdrop signer
        require
        (
            verifyLinkdropSignerSignature
            (
                _weiAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                version,
                chainId,
                _linkId,
                _linkdropSignerSignature
            ),
            "Invalid linkdrop signer signature"
        );

        // Verify that receiver address is signed by ephemeral key assigned to claim link (link key)
        require
        (
            verifyReceiverSignature(_linkId, _receiver, _receiverSignature),
            "Invalid receiver signature"
        );

        return true;
    }

    /**
    * @dev Function to claim ETH and/or ERC20 tokens. Can only be called when contract is not paused
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
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
        bytes calldata _linkdropSignerSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    whenNotPaused
    returns (bool)
    {
        // Make sure params are valid
        require
        (
            checkClaimParams
            (
                _weiAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                _linkId,
                _linkdropSignerSignature,
                _receiver,
                _receiverSignature
            ),
            "Invalid claim params"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require(_transferFunds(_weiAmount, _tokenAddress, _tokenAmount, _receiver), "Transfer failed");

        // Emit claim event
        emit Claimed(_linkId, _weiAmount, _tokenAddress, _tokenAmount, _receiver, now);

        return true;
    }

    /**
    * @dev Internal function to transfer ETH and/or ERC20 tokens
    * @param _weiAmount Amount of wei to be claimed
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferFunds(uint _weiAmount, address _tokenAddress, uint _tokenAmount, address payable _receiver)
    internal returns (bool)
    {
        // Transfer ETH
        if (_weiAmount > 0) {
            _receiver.transfer(_weiAmount);
        }

        // Transfer tokens
        if (_tokenAmount > 0) {
            IERC20(_tokenAddress).transfer(_receiver, _tokenAmount);
        }

        return true;
    }

}