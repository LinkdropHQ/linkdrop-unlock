import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'

@translate('pages.common.linkBlock')
class LinkBlock extends React.Component {
  render () {
    const { children, title, style = {} } = this.props
    return <div className={styles.container} style={style}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  }
}

export default LinkBlock
