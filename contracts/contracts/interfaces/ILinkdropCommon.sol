pragma solidity ^0.5.6;

interface ILinkdropCommon {

    function initializer(address payable _sender) external returns (bool);
    function isClaimedLink(address _linkId) external view returns (bool);
    function isCanceledLink(address _linkId) external view returns (bool);
    function paused() external view returns (bool);
    function cancel(address _linkId) external  returns (bool);
    function withdraw() external returns (bool);
    function pause() external returns (bool);
    function unpause() external returns (bool);
    function () external payable;
    
}