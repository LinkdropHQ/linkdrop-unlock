import React from 'react'
import styles from './styles.module'
import { Aside, Header } from 'components/common'
import { translate, actions } from 'decorators'
import { Scrollbars } from 'react-custom-scrollbars'
import MetamaskInjector from './metamask-injector'
import { Loading } from 'linkdrop-ui-kit'
const ls = window.localStorage

@actions(({ user: { currentAddress } }) => ({ currentAddress }))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    this.actions().user.checkCurrentProvider()
  }

  defineContent ({ currentAddress }) {
    if (currentAddress === null) {
      return <Loading />
    }
    if (!currentAddress) {
      return <MetamaskInjector />
    }
    return this.props.children
  }

  render () {
    const { currentAddress } = this.props
    const content = this.defineContent({ currentAddress })
    return <div className={styles.container}>
      <div className={styles.easterEgg} onClick={_ => this.emptyLs()} />
      <Aside />
      <div className={styles.mainWrapper}>
        <Scrollbars style={{ heigth: '100%', width: '100%' }}>
          <div className={styles.main}>
            <Header />
            {content}
          </div>
        </Scrollbars>
      </div>
    </div>
  }

  emptyLs () {
    ls && ls.removeItem('campaigns')
    ls && ls.removeItem('proxyAddr')
    ls && ls.removeItem('privateKey')
    window.location.reload()
  }
}

export default Page
