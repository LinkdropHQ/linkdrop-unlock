import React from 'react'
import classNames from 'classnames'
import styles from './styles.module'

class ProgressBar extends React.Component {
  render () {
    const { className, current, max } = this.props
    const value = current / max * 100
    return <div className={classNames(styles.container, className)}>
      <div className={styles.bar} style={{ width: `${value}%` }} />
      <div className={styles.data}>
        <div className={styles.current}>{current}</div> / <div className={styles.current}>{max}</div>
      </div>
    </div>
  }
}

export default ProgressBar
