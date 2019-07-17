const routes = {
  '/linkdrops/claim': {
    post: {
      controller: 'claimController',
      method: 'claim'
    }
  },
  '/linkdrops/getLastTxHash/:linkdropMasterAddress/:linkId': {
    get: {
      controller: 'lastTxHashController',
      method: 'getLastTxHash'
    }
  }
}

module.exports = routes
