pragma solidity ^0.5.6;

import "../interfaces/ILinkdropERC20.sol";
import "./LinkdropFactoryCommon.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract LinkdropFactoryERC20 is LinkdropFactoryCommon {

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _ethAmount Amount of ETH to be claimed (in atomic value)
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignature
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address _sender,
        bytes memory _senderSignature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_ethAmount, _tokenAddress, _tokenAmount, _expiration,  _linkId)));
        address signer = ECDSA.recover(prefixedHash, _senderSignature);
        return signer == _sender;
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _signature ECDSA signature of linkdrop receiver, signed with link key
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
    * @param _ethAmount Amount of ETH to be claimed (in atomic value)
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function checkClaimParams
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _sender,
        bytes memory _senderSignature,
        address _receiver,
        bytes memory _receiverSignature,
        address _proxy
    )
    public view
    returns (bool)
    {
        // If proxy is deployed
        if (isDeployed(_sender)) {

            return ILinkdropERC20(deployed[_sender]).checkClaimParams
            (
                _ethAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                _linkId,
                _senderSignature,
                _receiver,
                _receiverSignature
            );

        }
        else {

            // Make sure claim amount is available for proxy contract
            require
            (
                getAvailableBalance(_proxy, _sender, address(0)) >= _ethAmount &&
                getAvailableBalance(_proxy, _sender, _tokenAddress) >= _tokenAmount,
                "Insufficient funds"
            );

            // Verify that link key is legit and signed by sender's private key
            require
            (
                verifySenderSignature(_ethAmount, _tokenAddress, _tokenAmount, _expiration, _linkId, _sender, _senderSignature),
                "Invalid sender signature"
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
    * @param _ethAmount Amount of ETH to be claimed (in atomic value)
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function claim
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _sender,
        bytes calldata _senderSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    returns (bool)
    {

        // Check whether the proxy is deployed for sender and deploy if not
        if (!isDeployed(_sender)) {
            deployProxy(_sender);
        }

        // Call claim function in the context of proxy contract
        ILinkdropERC20(deployed[_sender]).claim
        (
            _ethAmount,
            _tokenAddress,
            _tokenAmount,
            _expiration,
            _linkId,
            _senderSignature,
            _receiver,
            _receiverSignature
        );

        return true;

    }

    /**
    * @dev Function to get total amount of tokens available for proxy contract
    * @param _proxy Address of proxy contract
    * @param _sender Address of lindkrop sender
    * @param _tokenAddress Token address, address(0) for ETH
    * @return Total amount available
    */
    function getAvailableBalance(address _proxy, address _sender, address _tokenAddress) public view returns (uint) {

        if (_tokenAddress == address(0)) {
            return _proxy.balance;
        }
        else {
            uint allowance = IERC20(_tokenAddress).allowance(_sender, _proxy);
            uint balance = IERC20(_tokenAddress).balanceOf(_proxy);
            return allowance.add(balance);
        }
    }
}