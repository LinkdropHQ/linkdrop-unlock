import user from './user'
import tokens from './tokens'

function * saga () {
  yield * user()
  yield * tokens()
}

export default saga
