import React from 'react'
import Logo from './logo'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('components.header')
class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <Logo />
      <div className={styles.links}>
        <a>{this.t('titles.whatIsLinkdrop')}</a>
      </div>
    </header>
  }
}

export default Header
