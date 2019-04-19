import React from 'react'
import classNames from 'classnames'
import styles from './styles.module'

class Alert extends React.Component {
  render () {
    const { icon, className, style = {} } = this.props
    return <div style={style} className={classNames(styles.container, className)}>
      {icon}
    </div>
  }
}

export default Alert
