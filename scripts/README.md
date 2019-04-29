# Scripts

## Short description

Scripts for setting up, deploying, generating and claiming linkdrops.

## Configure

Config file should be located in config folder within root directory
Make sure to copy and fill config params from config.json.sample

## General setup

Before running any of the commands below, make sure to have contract artifacts in `contracts/build` directory by running:

```bash
yarn compile-contracts
```

This step requires the following params to be present in config.json: `jsonRpcUrl, host, networkId, senderPrivateKey`
Before generating linkdrops you have to deploy mastercopy and factory contracts:

### Deploy mastercopy

```bash
yarn deploy-mastercopy
```
This will deploy mastercopy contract and append its address to config.json file.

### Deploy factory

Before deploying the factory contract make sure mastercopy address is present in config.json

```bash
yarn deploy-factory
```
This will deploy a factory contract and append its address to config.json


## Generate links and claim ETH
In addition to general setup params from above step, this step requires the following params to be present in config.json: `amount, linksNumber, receiverAddress`

To test ETH linkdrop, you need to:

0. Configure amount of wei to send per link in config.json

1. Generate links. During link generation, ETH needed for claim will be sent to the proxy address
```bash
yarn generate-links
```
This will generate `linksNumber` links and append them to `scripts/output/linkdrop_eth.csv`

2. Claim ETH

**Always make sure to restart the server after deploying any new contract**

With the running server `yarn server`, run the following command: 

```bash
yarn claim
```

## Generate links and claim ERC20 tokens
In addition to general setup params, this step requires the following params to be present in config.json: `token, amount, linksNumber, receiverAddress`

To test ERC20 linkdrop, you need to:

0. Configure ERC20 token address and amount (in atomic value) of tokens to send per link in config.json
If you don't have any ERC20 tokens owned by sender who `senderPrivateKey` belongs to, you can deploy a new one by running:
```bash
yarn deploy-erc20
```
This will deploy mock ERC20 token contract, mint 10^6 mock tokens to deployer and append token address to config.json

1. Generate links. During link generation, tokens needed for claim will be transfered to the proxy address
```bash
yarn generate-links
```
This will generate `linksNumber` links and append them to `scripts/output/linkdrop.csv`

2. Claim tokens

**Always make sure to restart the server after deploying any new contract**

With the running server `yarn server`, run the following command: 

```bash
yarn claim
```

## Generate links and claim ERC721 tokens
In addition to general setup params, this step requires the following params to be present in config.json: `nft, tokenIds, receiverAddress`

To test ERC721 linkdrop, you need to:

0. Configure ERC721 token address and tokenIds (array) to send per link in config.json
If you don't have any ERC721 tokens owned by sender who `senderPrivateKey` belongs to, you can deploy a new one by running:
```bash
yarn deploy-erc721
```
This will deploy mock ERC721 NFT contract, mint 10 mock NFTs to deployer and append nft address to config.json

1. Generate links. During link generation, NFTs with `tokenIds` will be transfered to the proxy address
```bash
yarn generate-links-erc721
```
This will generate links and append them to `scripts/output/linkdrop_erc721.csv`

2. Claim NFT

**Always make sure to restart the server after deploying any new contract**

With the running server `yarn server`, run the following command: 

```bash
yarn claim-erc721
```

## Run server

```bash
yarn server
```
