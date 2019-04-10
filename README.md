# Linkdrop Monorepo
Monorepo for Linkdrop Web Application

## Getting Started

### Installing packages
Go to app folder and run the yarn command:
```
cd app
yarn
```

### Compile files
in dev mode:
```
yarn dev
```

## Running the tests
We use both testing for components and saga-actions logic. Components testing runs with Mocha, Saga testing - with jest/enzyme.

### Components testing
Run the command:
```
yarn test-components
```

### Saga actions testing
Run the command:
```
yarn test-saga
```