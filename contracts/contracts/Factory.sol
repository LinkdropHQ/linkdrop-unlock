pragma solidity >= 0.5.0;
import "./CloneFactory.sol";
import "./Storage.sol";
import "./interfaces/ILinkdrop.sol";
import "./interfaces/ILinkdropERC721.sol";
import "./interfaces/ICommon.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Factory is Storage, CloneFactory {

    // Maps sender address to its corresponding proxy address
    mapping (address => address) deployed;

    // Events
    event Deployed(address payable proxy, bytes32 salt, uint timestamp);

    /**
    * @dev Constructor that sets the linkdrop mastercopy address
    * @param _masterCopy Address of linkdrop implementation contract
    */
    constructor(address payable _masterCopy) 
    public 
    {
        masterCopy = _masterCopy;
    }

    /**
    * @dev Indicates whether a proxy contract for sender is deployed or not
    * @param _sender Address of lindkrop sender
    * @return True if deployed
    */
    function isDeployed(address _sender) public view returns (bool) {
        return (deployed[_sender] != address(0));
    }

    /**
    * @dev Function to get total amount of tokens available for proxy contract
    * @param _proxy Address of proxy contract
    * @param _sender Address of lindkrop sender
    * @param _token Token address, address(0) for ETH
    * @return Total amount available
    */
    function getBalance(address _proxy, address _sender, address _token) public view returns (uint) {

        if (_token == address(0)) {
            return _proxy.balance;
        }
        else {
            uint allowance = IERC20(_token).allowance(_sender, _proxy);
            uint balance = IERC20(_token).balanceOf(_proxy);
            return allowance + balance;
        }
    }

    /**
    * @dev Function to get whether a NFT with token id is available for proxy contract
    * @param _proxy Address of proxy contract
    * @param _nft NFT address
    * @param _tokenId Token id
    * @return Total amount available
    */
    function isAvailableToken(address _proxy, address _nft, uint _tokenId) public view returns (bool) {
       if (IERC721(_nft).ownerOf(_tokenId) == _proxy) return true;
       else if (IERC721(_nft).getApproved(_tokenId) == _proxy) return true;
    }

    /**
    * @dev Function to deploy a proxy contract for sender
    * @param _sender Address of linkdrop sender
    * @return Proxy contract address
    */
    function deployProxy(address payable _sender) 
    public 
    returns (address payable) 
    {

        // Create clone of the mastercopy
        address payable proxy = createClone(masterCopy, keccak256(abi.encodePacked(_sender)));

        deployed[_sender] = proxy;

        // Initialize sender in newly deployed proxy contract
        require(ICommon(proxy).initializer(_sender), "Failed to initialize");
        emit Deployed( proxy, keccak256(abi.encodePacked(_sender)), now);
        
        return proxy;

    }

    /**
    * @dev Function to verify linkdrop sender's signature
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @return True if signed with sender's private key
    */
    function verifySenderSignature
    (
        address _token,
        uint _amount,
        uint _expiration,
        address _linkId,
        address _sender,
        bytes memory _senderSignature
    )
    public pure 
    returns (bool) 
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_token, _amount, _expiration,  _linkId)));
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

            return ILinkdrop(deployed[_sender]).checkClaimParams
            (
                _token, 
                _amount, 
                _expiration, 
                _linkId, 
                _senderSignature, 
                _receiver, 
                _receiverSignature
            );

        }
        else {

            // Make sure the claim amount is available for proxy contract
            require(getBalance(_proxy, _sender, _token) >= _amount, "Insufficient funds");

            // Verify that link key is legit and signed by sender's private key
            require
            (
                verifySenderSignature(_token, _amount, _expiration, _linkId, _sender, _senderSignature),
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
        
    }

    /**
    * @dev Function to claim ETH or ERC20 token
    * @param _token Token address, address(0) for ETH
    * @param _amount Amount of tokens to be claimed in atomic value
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
        address _token, 
        uint _amount,
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
        ILinkdrop(deployed[_sender]).claim
        (
            _token, 
            _amount,
            _expiration,
            _linkId, 
            _senderSignature, 
            _receiver, 
            _receiverSignature
        );

        return true;
        
    }

    /**
    * @dev Function to claim ERC721 token
    * @param _nft NFT address
    * @param _tokenId Token id to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _sender Address of linkdrop sender
    * @param _senderSignature ECDSA signature of linkdrop sender, signed with sender's private key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver, signed with link key
    * @return True if success
    */
    function claimERC721
    (
        address _nft, 
        uint _tokenId,
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
        ILinkdropERC721(deployed[_sender]).claimERC721
        (
            _nft, 
            _tokenId,
            _expiration,
            _linkId, 
            _senderSignature, 
            _receiver, 
            _receiverSignature
        );

        return true;
        
    }
  
}