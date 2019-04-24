# Linkdrop Monorepo
Monorepo for Linkdrop Web Application

## Getting Started

### Installing packages
Go to root folder of monorepo and run the yarn command:
```
cd linkdrop-monorepo
yarn
```

### Application folders
In our monorepo all applications are isolated in single folders, even react-ui-kit. For example to check the token claiming app you have first of all compile bundle file for linkdrop-ui-kit (or run webpack watch command to detect all changes). All ui-components are stored there.
```
cd linkdrop-ui-kit
yarn dev
```

After that you can easily go to 'app-claim' folder and run dev server:
```
cd ../app-claim
yarn dev:server
```

## Running the tests
We use both testing for components and saga-actions logic. Components testing runs with Mocha, Saga testing - with jest/enzyme.

### Components testing in 'linkdrop-ui-kit'
Run the command from 'linkdrop-ui-kit' folder:
```
cd ../linkdrop-ui-kit
yarn test
```

### Saga actions testing in 'app-claim', 'app-landing' and 'app-send' folders
Run the command from an appropriate folder:
```
cd ../app-claim
yarn test
```

### Storybook in 'linkdrop-ui-kit'
Run the command:
```
cd ../linkdrop-ui-kit
yarn storybook
```
