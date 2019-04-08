/* global describe, it */
import { put } from 'redux-saga/effects'
import { expect } from 'chai'
import signIn from 'data/store/saga/user/every/sign-in.js'

describe('sign in', function () {
  const gen = signIn()
  it('must select uris from state', () => {
    expect(
      gen.next().value).to.deep.equal(put({ type: 'SSS' })
    )
  })
})
