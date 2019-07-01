import user from './user'
import campaigns from './campaigns'

function * saga () {
  yield * user()
  yield * campaigns()
}

export default saga
