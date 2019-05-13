# Linkdrop SDK

## Short description

SDK for computing proxy address, generating claim links and claiming linkdrops

## Installation

```bash
yarn add https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/sdk
```

## Usage

```js
const LinkdropSDK = require('sdk')
```

### Compute proxy address

```js
const proxyAddress = LinkdropSDK.computeProxyAddress(factoryAddress, senderAddress, masterCopyAddress)
```

This function will use hash of `senderAddress` as salt and return built CREATE2 address


### Generate link for ETH or ERC20

```js
const {url, linkId, linkKey, senderSignature} = await LinkdropSDK.generateLink(jsonRpcUrl, networkId, host, senderPrivateKey, token, amount, expirationTime)
```

This function will generate link for claiming ETH or any ERC20 token and return the following params `url, linkId, linkKey, senderSignature`

### Generate link for ERC721

```js
const {url, linkId, linkKey, senderSignature} = await LinkdropSDK.generateLinkERC721(jsonRpcUrl, networkId, host, senderPrivateKey, nft, tokenId, expirationTime)
```

This function will generate link for claiming ERC721 token and return the following params `url, linkId, linkKey, senderSignature`


### Claim ETH or ERC20

```js
const txHash = await LinkdropSDK.claim(jsonRpcUrl, host, token, amount, expirationTime, linkKey, senderAddress, senderSignature, receiverAddress)
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`

Upon successful request function will log tx hash to the console

### Claim ERC721

```js
const txHash = await LinkdropSDK.claimERC721(jsonRpcUrl, host, nft, tokenId, expirationTime, linkKey, senderAddress, senderSignature, receiverAddress)
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`.

Upon successful request function will log tx hash to the console