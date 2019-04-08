pragma solidity >= 0.5.6;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

/**
 * @title Linkdrop ERC20Referral Contract
 * @dev Contract sends tokens from linkdropper's account to receiver on claim.
 * 
 * When deploying contract, linkdropper provides linkdrop parameters: 
 * (token address, amount of tokens to be linkdropped, linkdrop verification address).
 * 
 * Linkdrop verification address is used to verify that links are signed by LINKDROPPER. 
 * 
 * Linkdropper generates claim links. Each link contains an ephemeral private key 
 * signed by the private key corresponding to linkdrop verification address. 
 * The ephemeral private key assigned to link can only! be used once to sign receiver's address
 * Receiver claims tokens by providing signature to the Relayer Server, 
 * which then calls smart contract to claim tokens
 * 
 * On claim smart contract verifies, that receiver provided address signed 
 * with ephemeral private key assigned to the link. 
 * If everything is correct, smart contract sends tokens to receiver.
 * 
 */
contract LinkdropERC20Referral is Pausable {

    // ERC20 token to be distributed
    address public TOKEN_ADDRESS; 

    // amount of tokens to be claimed per link
    uint public CLAIM_AMOUNT; 

    // referral reward
    uint public REFERRAL_REWARD;

    // address that holds tokens to distribute (owner of this contract)
    address payable public LINKDROPPER; 

    // special address, used on claim to verify that links signed by the LINKDROPPER
    address public LINKDROP_VERIFICATION_ADDRESS; 

    //Indicates whether the link was used or not
    mapping (address => bool) claimed;

    event Claimed(address indexed linkAddress, address receiver, uint timestamp);

    /**
    * @dev Contructor that sets linkdrop params. 
    * @param _tokenAddress address Token address to be distributed
    * @param _claimAmount uint tokens (in atomic values) claimed per link
    * @param _linkdropVerificationAddress address used to verify links were signed by LINKDROPPER
    */
    constructor
    (
        address _tokenAddress,
        uint _claimAmount,
        uint  _referralAmount,
        address _linkdropVerificationAddress
    ) 
    public 
    {
        LINKDROPPER = msg.sender;
        TOKEN_ADDRESS = _tokenAddress;
        CLAIM_AMOUNT = _claimAmount;
        REFERRAL_REWARD = _referralAmount;
        LINKDROP_VERIFICATION_ADDRESS = _linkdropVerificationAddress;
    }

  /**
   * @dev Verify that address corresponding to link key is signed with linkdrop verification key
   * @param _linkAddress address corresponding to link key
   * @param _signature ECDSA signature
   * @return True if signature is correct.
   */
    function verifyLinkKey
    (
        address _linkAddress, // address corresponding to link key
        address _referralAddress,
        bytes memory _signature
    )
    public view 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_linkAddress, _referralAddress)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == LINKDROP_VERIFICATION_ADDRESS;
    }


  /**
   * @dev Verify that address to receive tokens is signed with link key
   * @param _linkAddress address corresponding to link key
   * @param _receiver address to receive token.
   * @param _signature ECDSA signature
   * @return True if signature is correct.
   */
    function verifyReceiverAddress
    (
        address _linkAddress,
        address _receiver,
        bytes memory _signature
    )
    public pure 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkAddress;
    }

    /**
    * @dev Verify that claim params are correct and the link's ephemeral key wasn't used before.  
    * @param _receiver address to receive tokens.
    * @param _linkAddress address that corresponds to link key
    * @param _linkdropperSignature ECDSA signature. Signed by linkdrop verification key.
    * @param _receiverSignature ECDSA signature. Signed by link key
    */
    function checkClaimParams
    (
        address _receiver,
        address _referralAddress,
        address _linkAddress,
        bytes memory _linkdropperSignature,
        bytes memory _receiverSignature
    )
    public view
    returns (bool)
    {
        // verify that link wasn't claimed before
        require(claimed[_linkAddress] == false, "Link has already been claimed");

        // verify that ephemeral key is legit and signed by LINKDROP_VERIFICATION_ADDRESS's key
        require
        (
            verifyLinkKey(_linkAddress, _referralAddress, _linkdropperSignature), 
            "Link key is not signed by linkdrop verification key"
        );

        // verify that receiver address is signed by ephemeral key assigned to claim link
        require
        (
            verifyReceiverAddress(_linkAddress, _receiver, _receiverSignature), 
            "Receiver address is not signed by link key"
        );

        return true;
    }

    /**
    * @dev Claim tokens to receiver address if claim params are correct.
    * @param _receiver address to receive tokens.
    * @param _linkAddress address corresponding to link key 
    * @param _linkdropperSignature ECDSA signature. Signed by the airdrop transit key.
    * @param _receiverSignature ECDSA signature. Signed by the link's ephemeral key.
    * @return True if tokens were successfully sent to receiver.
    */
    function claim
    (
        address payable _receiver,
        address _referralAddress,
        address _linkAddress,
        bytes memory _linkdropperSignature,
        bytes memory _receiverSignature
    )
    public
    whenNotPaused
    returns (bool) 
    {   
        require
        (
            checkClaimParams
            (
                _receiver,
                _referralAddress,
                _linkAddress,
                _linkdropperSignature,
                _receiverSignature
            ),
            "Invalid claim params"
        );

        // mark link as claimed
        claimed[_linkAddress] = true;

        // send tokens
        if (CLAIM_AMOUNT > 0 && TOKEN_ADDRESS != address(0)) {
            IERC20(TOKEN_ADDRESS).transferFrom(LINKDROPPER, _receiver, CLAIM_AMOUNT); 
        }

        // send tokens to the address who refferred the airdrop
        if (REFERRAL_REWARD > 0 && _referralAddress != address(0)) {
            IERC20(TOKEN_ADDRESS).transferFrom(LINKDROPPER, _referralAddress, REFERRAL_REWARD);
        }

        // log claim
        emit Claimed(_linkAddress, _receiver, now);

        return true;
    }

    /**
    * @dev Get boolean if link is already claimed. 
    * @param _linkAddress address corresponding to link key
    * @return True if the link key was already used. 
    */
    function isClaimedLink(address _linkAddress)
    public view 
    returns (bool) 
    {
        return claimed[_linkAddress];
    }

}