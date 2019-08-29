# Linkdrop SDK

## Short description

SDK for computing proxy address, generating and claiming linkdrops

## Installation

```bash
yarn add @linkdrop/sdk
```

## Usage

```js
const LinkdropSDK = require('@linkdrop/sdk')

// OR

import LinkdropSDK from '@linkdrop/sdk'
```

### Initialization

```js
const linkdropSDK = new LinkdropSDK({
  linkdropMasterAddress: <LINKDROP_MASTER_ADDRESS>,
  factoryAddress: <LINKDROP_FACTORY_ADDRESS>,
  // optional params:
  // chain = <CHAIN>, // 'rinkeby' by default
  // jsonRpcUrl = <JSON_RPC_URL>, // `https://${chain}.infura.io` by default,
  // apiHost = <API_HOST>, // `https://${chain}.linkdrop.io` by default
  // claimHost = <CLAIM_HOST>, // 'https://claim.linkdrop.io' by default
}))
```

Linkdrop SDK constructor takes following params:

- Required params:
  - linkdropMasterAddress - Linkdrop master address
  - factoryAddress - Linkdrop factory contract address

- Optional params:
  - chain - Chain name, Currently supported chains are ‘mainnet’, ‘rinkeby’, ‘ropsten’ and ’goerli’. Will use ‘rinkeby’ by default
  - jsonRpcUrl - JSON RPC URL to Ethereum node. Will use `${chain}.infura.io` by default
  - apiHost - Linkdrop Relayer Service API host. Will use `${chain}.linkdrop.io` by default
  - claimHost - Claiming page url host. Will use `claim.linkdrop.io` by default

You can deploy your own Linkdrop factory contract or use ours deployed on Mainnet, Rinkeby and Goerli networks at `0xBa051891B752ecE3670671812486fe8dd34CC1c8`


### Precompute proxy address

```js
let campaignId = 1
let proxyAddress = linkdropSDK.getProxyAddress(campaignId)
```

### Topup and approve ERC20 tokens to proxy contract

```js
const { topupTxHash, approveTxHash } = await linkdropSDK.topupAndApprove({ 
    signingKeyOrWallet,
    proxyAddress,
    weiAmount = 0,
    tokenAddress = '0x0000000000000000000000000000000000000000',
    tokenAmount = 0
})
```
This function will topup the provided proxy address and approve `tokenAmount` tokens to it

### Topup and approve ERC721 tokens to proxy contract

```js
const { topupTxHash, approveTxHash } = await linkdropSDK.topupAndApproveERC721({ 
    signingKeyOrWallet,
    proxyAddress,
    weiAmount = 0,
    nftAddress
})
```
This function will topup the provided proxy address and approve all NFTs to it

### Deploy proxy contract

```js
const txHash = await linkdropSDK.deployProxy({ signingKeyOrWallet, campaignId = 0 })
```
This function will deploy a proxy contract for a given campaign id.


⚠️ Don't forget to topup and approve tokens to precomputed proxy address before any links can be claimed from it.


### Generate link for ETH or ERC20

```js
const {
  url,
  linkId,
  linkKey,
  linkdropSignerSignature
} = await linkdropSDK.generateLink({
    signingKeyOrWallet, // Signing private key or ethers.js Wallet instance
    weiAmount, // Amount of wei per claim
    tokenAddress, // ERC20 token address
    tokenAmount, // Amount of ERC20 tokens per claim
    expirationTime = 12345678910, // Link expiration time
    campaignId = 0, // Campaign id
  })
```

This function will generate link for claiming ETH or any ERC20 token and return the following params `url, linkId, linkKey, linkdropSignerSignature`

### Generate link for ERC721

```js
const {
  url,
  linkId,
  linkKey,
  linkdropSignerSignature
} = await linkdropSDK.generateLinkERC721({
    signingKeyOrWallet, // Signing private key or ethers.js Wallet instance
    weiAmount, // Amount of wei per claim
    nftAddress, // ERC721 token address
    tokenId, // Token id
    expirationTime = 12345678910, // Link expiration time
    campaignId = 0, // Campaign id
  })
```

This function will generate link for claiming ERC721 token and return the following params `url, linkId, linkKey, linkdropSignerSignature`

### Claim ETH or ERC20

```js
const txHash = await linkdropSDK.claim({
    weiAmount, // Amount of wei per claim
    tokenAddress, // ERC20 token address
    tokenAmount, // Amount of ERC20 tokens to claim
    expirationTime = 12345678910, // Link expiration time
    linkKey, // Link ephemeral key
    linkdropSignerSignature, // Signature of linkdrop signer
    receiverAddress, // Address of receiver
    campaignId = 0, // Campaign id
}
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`.

### Claim ERC721

```js
const txHash = await linkdropSDK.claim({
    weiAmount, // Amount of wei per claim
    nftAddress, // ERC721 token address
    tokenId, // Token id to claim
    expirationTime = 12345678910, // Link expiration time
    linkKey, // Link ephemeral key
    linkdropSignerSignature, // Signature of linkdrop signer
    receiverAddress, // Address of receiver
    campaignId = 0, // Campaign id
}
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`.
