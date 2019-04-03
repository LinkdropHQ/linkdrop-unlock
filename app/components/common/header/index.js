import React from 'react'
import styles from './styles.css'
import { actions, translate } from 'decorators'

@actions(({ user }) => ({ user }))
@translate('components.header')
class Header extends React.Component {
  render () {
    const { user } = this.props
    return <header className={styles.container}>
      {this.t('title')}
    </header>
  }
}

export default Header
