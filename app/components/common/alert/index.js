import React from 'react'
import styles from './styles.css'

class Alert extends React.Component {
  render () {
    const { icon } = this.props
    return <div className={styles.container}>
      {icon}
    </div>
  }
}

export default Alert
