import React from 'react'
import styles from './styles.module'
import { Icons } from 'components/common'
import { actions, translate } from 'decorators'

@actions(({ user }) => ({ user }))
@translate('components.header')
class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <Icons.LinkdropLogo />
    </header>
  }
}

export default Header
