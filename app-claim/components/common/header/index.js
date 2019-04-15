import React from 'react'
import styles from './styles.module'
import { actions, translate } from 'decorators'

@actions(({ user }) => ({ user }))
@translate('components.header')
class Header extends React.Component {
  render () {
    const { title } = this.props
    return <header className={styles.container}>
      {title}
    </header>
  }
}

export default Header
