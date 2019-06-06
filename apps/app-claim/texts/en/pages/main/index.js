export default {
  titles: {
    needWallet: 'You need a wallet to claim tokens',
    haveAnother: 'Have another wallet?',
    claimTo: 'Claim to: <span>{{wallet}}</span>',
    transactionInProcess: 'Transaction is processing',
    claiming: 'Claiming...',
    instructions: 'It may take a few minutes. You can come back later.',
    seeDetails: 'See details on <a target="_blank" href={{transactionLink}}>Etherscan</a>',
    tokensClaimed: '<span>{{tokens}}</span> claimed',
    howToClaim: 'How to claim tokens to {{wallet}}',
    agreeWithTerms: 'By claiming this link you agree to the <a href={{termsHref}}>Terms</a> & <a href={{privacyHref}}>Privacy</a>'
  },
  buttons: {
    useWallet: 'Use {{wallet}}',
    copyLink: 'Copy link'
  },
  errors: {
    LINK_EXPIRED: {
      title: 'Expired',
      description: 'Sorry, link is expired'
    },
    LINK_CANCELED: {
      title: 'Canceled',
      description: 'Sorry, link is canceled'
    },
    LINK_FAILED: {
      title: 'Failed',
      description: 'Oops, something went wrong'
    },
    NETWORK_NOT_SUPPORTED: {
      title: 'Network is not supported',
      description: 'Switch to {{network}}',
      instructions: {
        _1: '1. Go to <span>Settings</span> in your Wallet',
        _2: '2. Swich Network to <span>{{network}}</span>',
        _3: '3. Back to wallet’s DApp browser then reload the claiming link and follow instructions'
      }
    },
    NEED_METAMASK: {
      title: 'You need a wallet to claim tokens',
      description: '',
      instructions: {
        _1: '1. Download <a href="https://metamask.io/" target="_blank">Metamask</a>',
        _2: '2. Then just reload the claim page'
      }
    }
  },
  walletsInstructions: {
    common: {
      _1: {
        withUrl: '1. Download <a href={{href}}>{{title}}</a>',
        withNoUrl: '1. Download {{title}}'
      },
      _2: '2. Copy&Paste the claiming link in a wallet’s DApp browser'
    },
    deepLink: {
      _1: '1. Download <a href={{href}}>{{title}}</a>.',
      _2: '2. Return here and tap on the button below'
    }
  }
}
