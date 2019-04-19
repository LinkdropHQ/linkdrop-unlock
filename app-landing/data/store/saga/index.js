import tokens from './tokens'

function * saga () {
  yield * tokens()
}

export default saga
