# Linkdrop Monorepo (Unlock version)
Monorepo for linkdrop.io, a service enabling send and receive Unlock keys (ERC-721 NFTs) via shareable links and QR codes.
This repository is a monorepo including the sdk, server, smart contracts and web apps (demo and claming app).

## Disclaimer
This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Generating links
1. Clone the repo and install dependencies:  
```bash
git clone https://github.com/LinkdropHQ/linkdrop-unlock.git
cd linkdrop-unlock
yarn # install deps
yarn compile-contracts # compile linkdrops contracts
```  

2. Run the following command to generate links: 
```bash
# Run the following command to generate links:
yarn generate-unlock-links --pk <PRIVATE_KEY_WITH_ETH_TO_COVER_COSTS> --lock <LOCK_ADDRESS> --n <NUMBER_OF_LINKS> --network <NETWORK_NAME>
#
# Args: 
# --pk: private key of an Ethereum account that has ETH to cover gas costs
# --lock: the lock Ethereum address, e.g. 0x778064F4D23e3E74De6505C35a3407D62002fB8F
# --n: number of links, e.g. 500
# --network: 'mainnet' or 'rinkeby'
#
# e.g. to generate 500 links for a rinkeby lock:  
# yarn generate-unlock-links --pk 0x000...000 --lock 0x778064F4D23e3E74De6505C35a3407D62002fB8F --n 500 --network rinkeby
#
# e.g. to generate 400 links for a mainnet lock:  
# yarn generate-unlock-links --pk 0x000...000 --lock 0x778064F4D23e3E74De6505C35a3407D62002fB8F --n 400 --network mainnet
```
**Note: The script deploys an escrow linkdrop contract and sends ETH to cover claiming gas costs (0.002 * number of links, e.g. for 500 links the script will send 1 ETH). Sender will be able to withdraw ETH for all unclaimed links back at any time.**  

The script will generate a CSV file with links at `linkdrop-unlock/packages/scripts/output/linkdrop_eth_unlock_mainnet.csv`


## License
The current codebase is released under the GPL-3.0 License
