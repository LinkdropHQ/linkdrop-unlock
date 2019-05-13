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
        <a target='_blank' href='https://medium.com/linkdrop-protocol/introducing-linkdrop-protocol-f612ae181e31'>{this.t('titles.whatIsLinkdrop')}</a>
      </div>
    </header>
  }
}

export default Header
