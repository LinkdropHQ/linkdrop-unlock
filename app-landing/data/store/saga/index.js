import user from './user'
import tokens from './tokens'
import metamask from './metamask'

function * saga () {
  yield * user()
  yield * tokens()
  yield * metamask()
}

export default saga
