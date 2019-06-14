# Linkdrop Web Apps
Web apps to interact with linkdrop service for end-users: 
- demo app deployed at https://demo.linkdrop.io, to generate demo linkdrops
- claiming app deployed at https://claim.linkdrop.io, to claim linkdrops. 

## Getting Started

### Update configs
After deploying the mastercopy and factory you will get an actual config file in linkdrop-monorepo/configs/scripts.config.json.
Just copy masterCopy and factory from that config, and create new file - app.config.json (according to app.config.json.sample scheme) with needed values. Also you can check demo.config.json and claim.config.json for your needs.

### Installing packages
Go to root folder of monorepo and run the yarn command:
```
cd linkdrop-monorepo
yarn
```

### Application folders
In our monorepo all applications are isolated in single folders, even react-ui-kit. For example to check the token claiming app you have first of all compile bundle file for linkdrop-ui-kit (or run webpack watch command to detect all changes). All ui-components are stored there.
```
cd linkdrop-monorepo/apps/linkdrop-ui-kit
yarn build
```

**Running Claiming App**  
After that you can easily go to 'app-claim' folder and run dev server (port: 9002):
```
cd linkdrop-monorepo/apps/app-claim
yarn dev:server
```

**Running Demo App**  
Or go to 'app-demo' and run dev server (port: 9001):
```
cd linkdrop-monorepo/apps/app-demo
yarn dev:server
```

### Bundles
To create bundles for production you can run command 'yarn build' in 'app-claim' and 'app-demo' folders:
```
cd linkdrop-monorepo/apps/app-demo
yarn build
```

Bundles for 'app-claim' and 'app-folder' can be found in 'assets/scripts' folders in each sub-project. For 'linkdrop-ui-kit' it can be found in 'dist' folder as bundle.


### Running the tests
We use both testing for components and saga-actions logic. Components testing runs with Mocha, Saga testing - with jest/enzyme.

### Components testing in 'linkdrop-ui-kit'
Run the command from 'linkdrop-ui-kit' folder:
```
cd linkdrop-monorepo/apps/linkdrop-ui-kit
yarn test
```

### Saga actions testing in 'app-claim', 'app-demo' and 'app-send' folders
Run the command from root folder:
```
cd linkdrop-monorepo
yarn test:demo
```
or
```
cd linkdrop-monorepo
yarn test:claim
```

### Storybook in 'linkdrop-ui-kit'
Run the command from linkdrop-ui-kit folder:
```
cd linkdrop-monorepo/apps/linkdrop-ui-kit
yarn storybook
```
