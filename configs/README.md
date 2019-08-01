# Config directory
This directory has config files used in the apps in the monorepo. 

## Updating configs
### Scripts
To run [scripts](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/scripts) copy the `scripts.config.json.sample` into `scripts.config.json` and fill in the `linkdropSignerPrivateKey`. You can also adjust other configs to your needs. 

### Server
To run [server](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/server) copy the `server.config.json.sample` into `server.config.json` and fill in the missing params. You can also adjust other configs to your needs. 


### Web apps
After deploying the mastercopy and factory you will get an actual config file in `scripts.config.json`. Just copy masterCopy and factory from that config, and create new file - `app.config.json` (according to `app.config.json.sample` scheme) with needed values. Also you can check `landing.json` and `claim.json` for your needs.
