import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class IconedLink extends React.Component {
  render () {
    const { icon, className, onClick } = this.props
    return <div className={classNames(styles.container, className)} onClick={_ => onClick && onClick()}>
      {icon}
    </div>
  }
}

export default IconedLink
