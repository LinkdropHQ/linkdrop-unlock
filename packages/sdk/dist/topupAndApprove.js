"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topupAndApproveERC721 = exports.topupAndApprove = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _TokenMock = _interopRequireDefault(require("../../contracts/build/TokenMock.json"));

var _NFTMock = _interopRequireDefault(require("../../contracts/build/NFTMock.json"));

var topupAndApprove =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, signingKeyOrWallet, proxyAddress, weiAmount, tokenAddress, tokenAmount, provider, wallet, topupTx, approveTx, tokenContract;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, signingKeyOrWallet = _ref.signingKeyOrWallet, proxyAddress = _ref.proxyAddress, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context.next = 3;
              break;
            }

            throw new Error("Please provide json rpc url");

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context.next = 5;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 5:
            if (!(proxyAddress == null || proxyAddress === '')) {
              _context.next = 7;
              break;
            }

            throw new Error("Please provide proxy address");

          case 7:
            if (!(weiAmount == null || weiAmount === '')) {
              _context.next = 9;
              break;
            }

            throw new Error("Please provide wei amount");

          case 9:
            if (!(tokenAddress == null || tokenAddress === '')) {
              _context.next = 11;
              break;
            }

            throw new Error("Please provide token address");

          case 11:
            if (!(tokenAmount == null || tokenAmount === '')) {
              _context.next = 13;
              break;
            }

            throw new Error("Please provide token amount");

          case 13:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              wallet = signingKeyOrWallet;
            }

            if (!(weiAmount > 0)) {
              _context.next = 19;
              break;
            }

            _context.next = 18;
            return wallet.sendTransaction({
              to: proxyAddress,
              value: weiAmount
            });

          case 18:
            topupTx = _context.sent;

          case 19:
            if (!(tokenAmount > 0 && tokenAddress !== '0x0000000000000000000000000000000000000000')) {
              _context.next = 24;
              break;
            }

            tokenContract = new _ethers.ethers.Contract(tokenAddress, _TokenMock["default"].abi, wallet);
            _context.next = 23;
            return tokenContract.approve(proxyAddress, tokenAmount);

          case 23:
            approveTx = _context.sent;

          case 24:
            return _context.abrupt("return", {
              topupTxHash: topupTx.hash,
              approveTxHash: approveTx.hash
            });

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function topupAndApprove(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.topupAndApprove = topupAndApprove;

var topupAndApproveERC721 =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var jsonRpcUrl, signingKeyOrWallet, proxyAddress, _ref3$weiAmount, weiAmount, nftAddress, provider, wallet, topupTx, nftContract, approveTx;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jsonRpcUrl = _ref3.jsonRpcUrl, signingKeyOrWallet = _ref3.signingKeyOrWallet, proxyAddress = _ref3.proxyAddress, _ref3$weiAmount = _ref3.weiAmount, weiAmount = _ref3$weiAmount === void 0 ? 0 : _ref3$weiAmount, nftAddress = _ref3.nftAddress;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error("Please provide json rpc url");

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 5:
            if (!(proxyAddress == null || proxyAddress === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error("Please provide proxy address");

          case 7:
            if (!(weiAmount == null || weiAmount === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error("Please provide wei amount");

          case 9:
            if (!(nftAddress == null || nftAddress === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error("Please provide nft address");

          case 11:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              wallet = signingKeyOrWallet;
            }

            if (!(weiAmount > 0)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 16;
            return wallet.sendTransaction({
              to: proxyAddress,
              value: weiAmount
            });

          case 16:
            topupTx = _context2.sent;

          case 17:
            nftContract = new _ethers.ethers.Contract(nftAddress, _NFTMock["default"].abi, wallet);
            _context2.next = 20;
            return nftContract.setApprovalForAll(proxyAddress, true);

          case 20:
            approveTx = _context2.sent;
            return _context2.abrupt("return", {
              topupTxHash: topupTx.hash,
              approveTxHash: approveTx.hash
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function topupAndApproveERC721(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.topupAndApproveERC721 = topupAndApproveERC721;