import user from './user'
import campaigns from './campaigns'
import tokens from './tokens'

function * saga () {
  yield * user()
  yield * campaigns()
  yield * tokens()
}

export default saga
