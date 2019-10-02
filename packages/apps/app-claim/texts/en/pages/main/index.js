export default {
  titles: {
    needWallet: 'You need Opera to<br>claim Unlock token',
    haveAnother: 'Have another wallet?',
    claimTo: 'Claiming to: <span>{{wallet}}</span>',
    transactionInProcess: 'Transaction is processing',
    claiming: 'Claiming...',
    instructions: 'It may take a few minutes. <a target="_blank" href={{transactionLink}}>Details</a>.',
    tokensClaimed: '<span>{{tokens}}</span><br>is claimed',
    howToClaim: 'How to claim tokens to {{wallet}}',
    claimUnlock: 'Get an Unlock token<br>to access the article',
    agreeWithTerms: 'By claiming you agree to the <a target="_blank" href={{href}}>Terms & Privacy</a>'
  },
  buttons: {
    useWallet: 'Open in {{wallet}}',
    copyLink: 'Copy link',
    readArticle: 'Read Article'
  },
  errors: {
    LINKDROP_PROXY_CONTRACT_PAUSED: {
      title: 'Campaign is paused',
      description: ''
    },
    INVALID_TOKEN_ADDRESS: {
      title: 'Invalid token address',
      description: ''
    },
    LINK_CLAIMED: {
      title: 'Link claimed',
      description: ''
    },
    INSUFFICIENT_ETHERS: {
      title: 'Insufficient ethers',
      description: ''
    },
    INSUFFICIENT_TOKENS: {
      title: 'Insufficient tokens',
      description: ''
    },
    INSUFFICIENT_ALLOWANCE: {
      title: 'Insufficient allowance',
      description: ''
    },
    INVALID_LINKDROP_SIGNER_SIGNATURE: {
      title: 'Invalid Linkdrop signer signature',
      description: ''
    },
    INVALID_RECEIVER_SIGNATURE: {
      title: 'Invalid receiver signature',
      description: ''
    },
    SERVER_ERROR_OCCURED: {
      title: 'Server error occured',
      description: ''
    },
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
    LINK_INVALID: {
      title: 'Invalid Link',
      description: 'Please check the format of claim link'
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
