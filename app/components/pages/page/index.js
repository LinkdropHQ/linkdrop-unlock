import React from 'react'
import { Header } from 'components/common'
import styles from './styles.css'

class Page extends React.Component {
  render () {
    return <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        {this.props.children}
      </div>
    </div>
  }
}

export default Page
