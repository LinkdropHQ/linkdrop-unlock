const _withoutProtocol = (url) => {
  return url.replace(/(^\w+:|^)\/\//, '')
}

export default {
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    walletURL: 'https://trustwalletapp.com',
    dappStoreUrl: 'https://dapps.trustwalletapp.com/',
    mobile: {
      android: {
        support: true,
        deepLink: (url) => `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${encodeURIComponent(url)}`
      },
      ios: {
        support: true,
        deepLink: (url) => `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${encodeURIComponent(url)}`
      }
    }
  },
  portis: {
    id: 'portis',
    name: 'Portis',
    walletURL: 'https://portis.io/',
    dappStoreUrl: 'https://wallet.portis.io/',
    mobile: {
      android: {
        support: true,
        deepLink: () => {}
      },
      ios: {
        support: true,
        deepLink: () => {}
      }
    }
  },
  opera: {
    id: 'opera',
    name: 'Opera',
    walletURL: 'https://play.google.com/store/apps/details?id=com.opera.browser',
    dappStoreUrl: 'https://www.opera.com/dapps-store',
    mobile: {
      android: {
        support: true,
        deepLink: (url) => `intent://${_withoutProtocol(url)}/#Intent;scheme=http;package=com.opera.browser;end`
      },
      ios: {
        support: false,
        deepLink: () => null
      }
    }
  },
  status: {
    id: 'status',
    name: 'Status',
    walletURL: 'https://status.im/',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
      },
      ios: {
        support: true,
        deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
      }
    }
  },
  tokenpocket: {
    id: 'token_pocket',
    name: 'Token Pocket',
    walletURL: 'https://tokenpocket.jp/index_en.html',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: (url) => `https://tokenpocket.github.io/applink?dappUrl=${encodeURIComponent(url)}`
      }
    }
  },
  coinbase: {
    id: 'coinbase_wallet',
    name: 'Coinbase Wallet',
    walletURL: 'https://www.toshi.org',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: (url) => null
      }
    }
  },
  'imtoken': {
    id: 'imtoken',
    name: 'imToken Wallet',
    walletURL: '',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: (url) => null
      }
    }
  },
  'gowallet': {
    id: 'gowallet',
    name: 'GoWallet',
    walletURL: '',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: (url) => null
      }
    }
  },
  'buntoy': {
    id: 'buntoy',
    name: 'Buntoy',
    walletURL: '',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: (url) => null
      }
    }
  }
}
