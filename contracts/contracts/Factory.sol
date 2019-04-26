pragma solidity >= 0.5.0;
import "./CloneFactory.sol";
import "./Storage.sol";
import "./interfaces/ILinkdrop.sol";
import "./interfaces/ILinkdropERC721.sol";

contract Factory is Storage, CloneFactory {

    // Sender => Proxy address
    mapping (address => address) deployed;

    event Deployed(address payable proxy, bytes32 salt, uint timestamp);

    // Initialize the master code
    constructor(address payable _implementation) 
    public 
    {
      implementation = _implementation;
    }

    // Indicates whether a proxy is deployed or not
    function isDeployed(address _sender) public view returns (bool) {
        return (deployed[_sender] != address(0));
    }

    // Deploy new proxy contract
    function deployProxy(address payable _sender) 
    public 
    returns (address payable) 
    {

        address payable proxy = createClone(implementation, keccak256(abi.encodePacked(_sender)));

        deployed[_sender] = proxy;

        // Initialize sender in newly deployed contract
        require(ILinkdrop(proxy).initializer(_sender), "Failed to initialize");
        emit Deployed( proxy, keccak256(abi.encodePacked(_sender)), now);
        
        return proxy;

    }

    // Function to claim tokens. Deploys proxy if not deployed yet
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
        if (!isDeployed(_sender)) {
            deployProxy(_sender);
        }

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

    // Function to claim NFT. Deploys proxy if not deployed yet
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
        if (!isDeployed(_sender)) {
            deployProxy(_sender);
        }

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