import tokens from './tokens'
import contract from './contract'
import user from './user'

function * saga () {
  yield * tokens()
  yield * contract()
  yield * user()
}

export default saga
