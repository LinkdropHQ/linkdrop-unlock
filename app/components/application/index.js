import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createBrowserHistory from 'history/createBrowserHistory'

import data from 'data'
import AppRouter from './router'

class Application extends React.Component {
  componentWillMount () {
    this.store = data.store()
    this.history = createBrowserHistory()

    syncHistoryWithStore(this.history, this.store)
  }

  render () {
    const { store, history } = this
    return <Provider store={store}>
      <Router history={history}>
        <AppRouter />
      </Router>
    </Provider>
  }
}
export default Application
