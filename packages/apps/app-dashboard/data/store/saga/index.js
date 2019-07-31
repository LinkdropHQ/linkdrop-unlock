import user from './user'
import campaigns from './campaigns'
import tokens from './tokens'
import metamask from './metamask'

function * saga () {
  yield * user()
  yield * campaigns()
  yield * tokens()
  yield * metamask()
}

export default saga
