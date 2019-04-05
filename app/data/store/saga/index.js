import nftTokens from './nft-tokens'

function * saga () {
  yield * nftTokens()
}

export default saga
