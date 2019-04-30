pragma solidity >= 0.5.6;
import "./Common.sol";
import "./interfaces/ILinkdrop.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Linkdrop is ILinkdrop, Common {   

    // =================================================================================================================
    //                                         ERC20 and ETH Linkdrop
    // =================================================================================================================

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignature
    (
        address _token,
        uint _amount,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_token, _amount, _expiration,  _linkId)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == SENDER;
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
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function checkClaimParams
    (
        address _token,
        uint _amount,
        uint _expiration,
        address _linkId, 
        bytes memory _senderSignature,
        address _receiver, 
        bytes memory _receiverSignature
    )
    public view 
    returns (bool)
    {

        // Make sure the link is not claimed or canceled
        require(isClaimedLink(_linkId) == false, "Claimed link");
        require(isCanceledLink(_linkId) == false, "Canceled link");

        // Verify that link key is legit and signed by sender's private key
        require
        (
            verifySenderSignature(_token, _amount, _expiration, _linkId, _senderSignature),
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
    * @dev Function to claim ETH or ERC20 token. Can only be called when contract is not paused
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function claim
    (
        address _token, 
        uint _amount,
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
        // Make sure that params are valid
        require
        (
            checkClaimParams
            (
                _token,
                _amount,
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

        // Make sure the transfer succeeds
        require(_transferEthOrTokens(_token, _amount, _receiver), "Transfer failed");

        // Log claim
        emit Claimed(_linkId, _token, _amount, _receiver, now);

        return true;
    }

    /**
    * @dev Function to get total amount of tokens available for this contract
    * @param _token Token address, address(0) for ETH
    * @return Total amount available
    */
    function getBalance(address _token) public view returns (uint) {

        if (_token == address(0)) {
            return address(this).balance;
        }
        else {
            uint allowance = IERC20(_token).allowance(SENDER, address(this));
            uint balance = IERC20(_token).balanceOf(address(this));
            return allowance + balance;
        }

    }

    /**
    * @dev Internal function to transfer ETH or ERC20 tokens
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferEthOrTokens(address _token, uint _amount, address payable _receiver)
    internal returns (bool)
    {

        // Transfer ethers
        if (_amount > 0 && address(_token) == address(0)) {
            require(getBalance(address(0)) >= _amount, "Insufficient funds");
            _receiver.transfer(_amount);
        }

        // Transfer tokens
        if (_amount > 0 && address(_token) != address(0)) {
            
            require(getBalance(_token) >= _amount, "Insufficient funds");

            uint balance = IERC20(_token).balanceOf(address(this));

            // First use funds from proxy balance
            if (balance > 0 ) {

                // Get min of two values
                uint fromProxyAmount;
                if (balance >= _amount) 
                    fromProxyAmount = _amount;
                else 
                    fromProxyAmount = balance;

                // Transfer tokens from proxy balance
                IERC20(_token).transfer(_receiver, fromProxyAmount); 
                
                // Transfer rest funds from sender's balance
                uint rest = _amount - fromProxyAmount;
                if (rest != 0) 
                    IERC20(_token).transferFrom(SENDER, _receiver, rest); 
            }

            // Then use funds approved
            else {
                IERC20(_token).transferFrom(SENDER, _receiver, _amount); 
            }

        }        

        return true;
    }

}