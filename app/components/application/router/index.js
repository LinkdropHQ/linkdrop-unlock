import React from 'react'
import i18next from 'i18next'
import { Switch, Route } from 'react-router'
import { Main, Page } from 'components/pages'

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

  render () {
    const { user } = this.props
    return <Page>
      <Switch>
        <Route path='/spa' component={Main} />
      </Switch>
    </Page>
  }
}

export default AppRouter
