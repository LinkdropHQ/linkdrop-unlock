import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'

import store, { history } from 'data/store'
import AppRouter from './router'

class Application extends React.Component {
  render () {
    return <div>
      <Provider store={store()}>
        <ConnectedRouter history={history}>
          <Router history={history}>
            <AppRouter />
          </Router>
        </ConnectedRouter>
      </Provider>
    </div>
  }
}
export default Application
