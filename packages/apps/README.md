# Linkdrop Web Apps
Web apps to interact with linkdrop service for end-users: 
- dashboard deployed at https://dashboard.linkdrop.io, to generate linkdrops
- claiming app deployed at https://claim.linkdrop.io, to claim linkdrops. 

## Getting Started

### Update configs
After deploying the mastercopy and factory you will get an actual config file in linkdrop-monorepo/configs/scripts.config.json.
Just copy masterCopy and factory from that config, and create new file - app.config.json (according to app.config.json.sample scheme) with needed values. Also you can check dashboard.config.json and claim.config.json for your needs.

### Installing packages
Go to root folder of monorepo and run the lerna command:
```
cd linkdrop-monorepo
lerna bootstrap
```

### Application folders
In our monorepo all applications are isolated in single folders, even linkdrop-ui-kit. For example to check the token claiming app you have first of all compile bundle file for linkdrop-ui-kit (or run webpack watch command to detect all changes). All ui-components are stored there.
```
cd linkdrop-monorepo/packages/apps/linkdrop-ui-kit
yarn build
```

**Running Claiming App**  
After that you can easily go to 'app-claim' folder and run dev server (port: 9002):
```
cd linkdrop-monorepo/packages/apps/app-claim
yarn dev:server
```

**Running Dashboard**  
Also go to 'app-dashboard' folder and run dev server (port: 9003):
```
cd linkdrop-monorepo/packages/apps/app-dashboard
yarn dev:server
```


### Bundles
To create bundle for production you can run command 'yarn build' in 'app-claim' and 'app-dashboard' folders:
```
cd linkdrop-monorepo/packages/apps/app-claim
yarn build
```

Bundles for 'app-claim' and 'app-dashboard' can be found in 'assets/scripts' folders in each sub-project. For 'linkdrop-ui-kit' it can be found in 'dist' folder as bundle.


### Running the tests
We use both testing for components and saga-actions logic. Components testing runs with Mocha, Saga testing - with jest/enzyme.

### Components testing in 'linkdrop-ui-kit'
Run the command from 'linkdrop-ui-kit' folder:
```
cd linkdrop-monorepo/packages/apps/linkdrop-ui-kit
yarn test
```

### Saga actions testing in 'app-claim' folder
Run the command from root folder:
```
cd linkdrop-monorepo
yarn test:claim
```

### Storybook in 'linkdrop-ui-kit'
Run the command from linkdrop-ui-kit folder:
```
cd linkdrop-monorepo/packages/apps/linkdrop-ui-kit
yarn storybook
```
