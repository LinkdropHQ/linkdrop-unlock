# Linkdrop Monorepo
Monorepo for Linkdrop.io, a service enabling send and receive Ether, ERC20 and/or ERC721 tokens via shareable links and QR codes.
This repository is a monorepo including the sdk, server, smart contracts and web apps (demo and claming app).

## Disclaimer
This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Structure
- [Contracts](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/contracts) - linkdrop contracts
- [Server](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/server) - node.js server application that relays claiming transactions so that end-users don't need to have ether to claim linkdrops
- [SDK](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/sdk) - a JS library to generate and claim links (used in web apps)
- [Web apps](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/apps) - web apps to interact with linkdrop service for end-users.  
- [Scripts](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/scripts)  - scripts for setting up, deploying, generating links and claiming linkdrops
- [config](https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/dev/config) - configs used in other components (SDK, server, web apps)


## Building, running & testing
...

## License
The current codebase is released under the [MIT License](https://opensource.org/licenses/MIT)
