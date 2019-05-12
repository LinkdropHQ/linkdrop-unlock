pragma solidity >= 0.5.6;
import "./Common.sol";
import "./interfaces/ILinkdrop.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Linkdrop is ILinkdrop, Common {
    using SafeMath for uint;
    // =================================================================================================================
    //                                         ERC20 and ETH Linkdrop
    // =================================================================================================================

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _ethAmount Amount of ETH to be claimed (in atomic value)
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignature
    (
        uint _ethAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_ethAmount, _tokenAddress, _tokenAmount, _expiration,  _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == sender;
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
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params and make sure the link is not claimed or canceled
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
        bytes memory _senderSignature,
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

        // Make sure claim amount is available for this contract
        require(getAvailableBalance(address(0)) >= _ethAmount && getAvailableBalance(_tokenAddress) >= _tokenAmount, "Insufficient funds");

        // Make sure link is not claimed or canceled
        require(isClaimedLink(_linkId) == false, "Claimed link");
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Verify that link key is legit and signed by sender's private key
        require
        (
            verifySenderSignature(_ethAmount, _tokenAddress, _tokenAmount, _expiration, _linkId, _senderSignature),
            "Invalid sender signature"
        );

        // Make sure the link is not expired
        require(_expiration >= now, "Expired link");

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
    external
    whenNotPaused
    returns (bool)
    {
        // Make sure params are valid
        require
        (
            checkClaimParams
            (
                _ethAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                 _linkId,
                _senderSignature,
                _receiver,
                _receiverSignature
            ),
            "Invalid claim params"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require(_transfer(_ethAmount, _tokenAddress, _tokenAmount, _receiver), "Transfer failed");

        // Emit claim event
        emit Claimed(_linkId, _ethAmount, _tokenAddress, _tokenAmount, _receiver, now);

        return true;
    }

    /**
    * @dev Function to get total amount of tokens available for this contract
    * @param _tokenAddress Token address
    * @return Total amount available
    */
    function getAvailableBalance(address _tokenAddress) public view returns (uint) {

        if (_tokenAddress == address(0)) {
            return address(this).balance;
        }
        else {
            uint allowance = IERC20(_tokenAddress).allowance(sender, address(this));
            uint balance = IERC20(_tokenAddress).balanceOf(address(this));
            return allowance.add(balance);
        }

    }

    /**
    * @dev Internal function to transfer ETH and/or ERC20 tokens
    * @param _ethAmount Amount of ETH to be claimed (in atomic value)
    * @param _tokenAddress Token address
    * @param _tokenAmount Amount of tokens to be claimed (in atomic value)
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transfer(uint _ethAmount, address _tokenAddress, uint _tokenAmount, address payable _receiver)
    internal returns (bool)
    {
        // Transfer ETH
        if (_ethAmount > 0) {
            _receiver.transfer(_ethAmount);
        }

        // Transfer tokens
        if (_tokenAmount > 0 && address(_tokenAddress) != address(0)) {

            uint balance = IERC20(_tokenAddress).balanceOf(address(this));
            // First use funds from proxy balance
            if (balance > 0 ) {
                // Get min of two values
                uint fromProxyAmount;
                if (balance >= _tokenAmount)
                    fromProxyAmount = _tokenAmount;
                else
                    fromProxyAmount = balance;

                // Transfer tokens from proxy balance
                IERC20(_tokenAddress).transfer(_receiver, fromProxyAmount);

                // Transfer remaining funds from sender's balance
                uint remainder = _tokenAmount.sub(fromProxyAmount);
                if (remainder != 0)
                    IERC20(_tokenAddress).transferFrom(sender, _receiver, remainder);
            }

            // Then use funds approved
            else {
                IERC20(_tokenAddress).transferFrom(sender, _receiver, _tokenAmount);
            }

        }

        return true;
    }

}