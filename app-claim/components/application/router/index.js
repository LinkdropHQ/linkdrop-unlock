/* global web3 */

import React from 'react'
import i18next from 'i18next'
import { Switch, Route } from 'react-router'
import { Main, Page, NotFound } from 'components/pages'
import './styles'

import { actions } from 'decorators'
@actions(({ user }) => ({
  locale: (user || {}).locale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
  }

  componentDidMount () {
    try {
      web3.eth && web3.eth.getAccounts && web3.eth.getAccounts((err, res) => {
        if (err) {
          return console.error({ err })
        }
        const web3Wallet = res[0]
        if (web3Wallet) {
          // this.actions().user.setWeb3Provider({ provider: web3.currentProvider })
          this.actions().user.setWallet({ wallet: web3Wallet })
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  render () {
    return <Page>
      <Switch>
        {/* <Route path='/' component={Main} /> */}
        <Route path='/' component={Main} />
        <Route path='*' component={NotFound} />
      </Switch>
    </Page>
  }
}

export default AppRouter
