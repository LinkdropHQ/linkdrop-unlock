import { history } from 'data/store'

class Routing {
  constructor (actions) {
    this.actions = actions
  }

  goTo ({ location }) {
    history.push(location)
  }
}

export default Routing
