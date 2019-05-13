import { takeEvery } from 'redux-saga/effects'

import createLink from './every/create-link'

export default function * () {
  yield takeEvery('*TOKENS.CREATE_LINK', createLink)
}
