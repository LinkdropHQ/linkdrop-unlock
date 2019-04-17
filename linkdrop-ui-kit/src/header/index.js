import React from 'react'
import styles from './styles.module'

class Header extends React.Component {
  render () {
    const { title } = this.props
    return <header className={styles.container}>
      {title}
    </header>
  }
}

export default Header
