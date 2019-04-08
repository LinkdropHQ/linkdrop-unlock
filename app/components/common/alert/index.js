import React from 'react'
import classNames from 'classnames'
import styles from './styles.css'

class Alert extends React.Component {
  render () {
    const { icon, className } = this.props
    return <div className={classNames(styles.container, className)}>
      {icon}
    </div>
  }
}

export default Alert
