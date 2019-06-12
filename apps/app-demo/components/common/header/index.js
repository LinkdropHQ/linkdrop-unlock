import React from 'react'
import Logo from './logo'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('components.header')
class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <Logo />
      <div className={styles.notification}>
        <div dangerouslySetInnerHTML={{ __html: this.t('bugBountyNote') }} />
      </div>
      <div className={styles.links}>
        <a target='_blank' href='https://linkdrop.io/'>{this.t('titles.whatIsLinkdrop')}</a>
      </div>
    </header>
  }
}

export default Header
