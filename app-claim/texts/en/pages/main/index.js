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
    howToClaim: 'How to claim tokens to {{wallet}}'
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
    }
  },
  walletsInstructions: {
    common: {
      _1: '1. Download/Open <a href={{href}}>{{title}}</a>',
      _2: '2. Create new or import existing wallet',
      _3: '3. Copy&Paste the claiming link in a {{title}} DApp browser and follow simple instructions'
    }
  }
}
