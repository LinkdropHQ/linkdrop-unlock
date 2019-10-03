import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'data/store'
import { Loading } from 'components/pages/common'
import AppRouter from '../router'

export default function RouterProvider () {
  const context = useWeb3Context()
  const { account, active } = context

  useEffect(() => {
    context.setFirstValidConnector(['MetaMask', 'Infura'])
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    return <div>error: {context.error.code} (line: {context.error.line}, col: {context.error.column})</div>
  } else {
    return <ConnectedRouter history={history}>
      <Router history={history}>
        <AppRouter account={account} active={active} />
      </Router>
    </ConnectedRouter>
  }
}
