# Scripts

## Short description

Scripts for setting up, deploying, generating and claiming linkdrops.

## Configure

Config file should be located in config folder within root directory
Make sure to copy and fill config params from config.json.sample

## General setup

This step requires the following params to be present in config.json: ```jsonRpcUrl, host, networkId, senderPrivateKey```

Before generating linkdrops you need to deploy mastercopy and factory contracts:

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
In addition to general setup params from above step, this step requires the following params to be present in config.json: ```amount, linksNumber```

To test ETH linkdrop, you need to:

0. Configure amount of wei to send per link in config.json
1. Generate links. During link generation, ETH needed for claim will be sent to the proxy address
```bash
yarn generate-links
```
This will generate `linksNumber` links and append them to scripts/output/linkdrop_eth.csv

2. Claim ETH
```bash
yarn claim
```

## Generate links and claim ERC20 tokens
In addition to general setup params, this step requires the following params to be present in config.json: ```token, amount, linksNumber```

To test ERC20 linkdrop, you need to:

0. Configure ERC20 token address and amount (in atomic value) of tokens to send per link in config.json
If you don't have any ERC20 tokens owned by sender who ```senderPrivateKey``` belong to, you can deploy a new one by running:
```bash
yarn deploy-erc20
```
This will deploy mock ERC20 token contract, mint 10^6 mock tokens to deployer and append token address to config.json

1. Generate links. During link generation, tokens needed for claim will be transfered to the proxy address
```bash
yarn generate-links
```
This will generate `linksNumber` links and append them to scripts/output/linkdrop.csv

2. Claim tokens
```bash
yarn claim
```

## Generate links and claim ERC721 tokens
In addition to general setup params, this step requires the following params to be present in config.json: ```nft, tokenIds```

To test ERC721 linkdrop, you need to:

0. Configure ERC721 token address and tokenIds (array) to send per link in config.json
If you don't have any ERC721 tokens owned by sender who ```senderPrivateKey``` belong to, you can deploy a new one by running:
```bash
yarn deploy-erc721
```
This will deploy mock ERC721 NFT contract, mint 10 mock NFTs to deployer and append nft address to config.json

1. Generate links. During link generation, NFTs with `tokenIds` will be transfered to the proxy address
```bash
yarn generate-links-erc721
```
This will generate links and append them to scripts/output/linkdrop_erc721.csv

2. Claim tokens
```bash
yarn claim
```

### Compile contracts to get metadata

```bash
 yarn compile-contracts
```

### Deploy ERC20 Token

```bash
yarn deploy-erc20
```

### Deploy ERC721 Token

```bash
yarn deploy-erc721
```

### Deploy factory

```bash
yarn deploy-factory
```

### Deploy linkdrop mastercopy

```bash
yarn deploy-mastercopy
```

### Generate links for ether or ERC20

```bash
yarn generate-links
```

### Generate links for ERC721

```bash
yarn generate-links-erc721
```

### Setup linkdrop for ether or ERC20 (deploys factory, linkdrop mastercopy and generates links)

```bash
yarn setup-linkdrop
```

### Setup linkdrop for ERC721 (deploys factory, linkdrop mastercopy and generates links)

```bash
yarn setup-linkdrop-erc721
```

### Run server

```bash
yarn server
```

### Claim tokens

```bash
yarn claim
```


