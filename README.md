# Linkdrop Monorepo
Monorepo for linkdrop.io, a service enabling send and receive Ether, ERC20 and/or ERC721 tokens via shareable links and QR codes.
This repository is a monorepo including the sdk, server, smart contracts and web apps (demo and claming app).

## Disclaimer
This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Structure
- [Contracts](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/contracts) - linkdrop contracts
- [Server](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/server) - node.js server application that relays claiming transactions so that end-users don't need to have ether to claim linkdrops
- [SDK](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/sdk) - a JS library to generate and claim links (used in web apps)
- [Web apps](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/apps) - web apps to interact with linkdrop service for end-users.  
- [Scripts](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/scripts)  - scripts for setting up, deploying, generating links and claiming linkdrops
- [Configs](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/configs) - configs used in other components (SDK, server, web apps)


## Building, running & testing locally 

To build and run locally, first follow the instructions in `scripts` - https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/scripts  
After server is running, you can follow instructions in `apps` to serve front-end apps (demo and claiming apps) - https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/apps

## Demo
You can play with demo at https://demo.linkdrop.io. The App supports only Rinkeby Test network right now.


## License
The current codebase is released under the [MIT License](https://opensource.org/licenses/MIT)
