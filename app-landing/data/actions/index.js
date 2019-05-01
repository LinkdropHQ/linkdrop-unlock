import User from './user'
import Routing from './routing'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.routing = new Routing(this)
    this.user = new User(this)
  }
}

export default Actions
