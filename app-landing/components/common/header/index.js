import React from 'react'
import { translate } from 'decorators'
import Logo from './logo'
import styles from './styles.module'

@translate('pages.main')
class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <Logo />

      <div className={styles.controls} />

      <div className={styles.socials} />
    </header>
  }
}

export default Header
