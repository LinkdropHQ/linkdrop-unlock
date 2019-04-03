import { call, put, select } from 'redux-saga/effects'

const generator = function * () {
  try {
    console.log('user sign in generator')
  } catch (e) {
    console.error(e)
  }
}

export default generator
