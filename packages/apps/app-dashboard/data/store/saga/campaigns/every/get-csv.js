import { put } from 'redux-saga/effects'
import { convertArrayToCSV } from 'convert-array-to-csv'
const generator = function * ({ payload }) {
  try {
    const { links, id } = payload
    const linksData = links.map((link, idx) => ({ link, id: idx + 1 }))
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const csv = convertArrayToCSV(linksData)
    const hiddenElement = document.createElement('a')
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    hiddenElement.target = '_blank'
    hiddenElement.download = `links-${id}.csv`
    hiddenElement.click()
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
