import tokens from './tokens'
import contract from './contract'

function * saga () {
  yield * tokens()
  yield * contract()
}

export default saga
