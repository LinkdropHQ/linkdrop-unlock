import User from './user'
import Routing from './routing'
import NftTokens from './nft-tokens'
import Tokens from './tokens'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.routing = new Routing(this)
    this.user = new User(this)
    this.nftTokens = new NftTokens(this)
    this.tokens = new Tokens(this)
  }
}

export default Actions
