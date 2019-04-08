import nftTokens from './nft-tokens'
import tokens from './tokens'

function * saga () {
  yield * nftTokens()
  yield * tokens()
}

export default saga
