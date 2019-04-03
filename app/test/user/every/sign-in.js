import { describe, before, it } from 'mocha'
import { call, put, select } from 'redux-saga/effects'
import assert from 'assert'
import signIn from '../../../data/store/saga/user/every/sign-in.js'

describe('sign in', function () {
  const gen = signIn()

  assert.deepEqual(
    gen.next().value,
    put({ type: 'SSS' }),
    'it should wait for a user to choose a color'
  )
})
