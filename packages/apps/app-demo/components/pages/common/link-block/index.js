import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
const localStorage = window.localStorage
const location = window.location

@translate('pages.common.linkBlock')
class LinkBlock extends React.Component {
  render () {
    const { children, title, style = {} } = this.props
    return <div className={styles.container} style={style}>
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
      {children}
      <div className={styles.invisibleButton} onClick={_ => this.emptyStoragesAndReload()} />
    </div>
  }

  emptyStoragesAndReload () {
    localStorage && localStorage.removeItem('link')
    localStorage && localStorage.removeItem('privateKey')
    localStorage && localStorage.removeItem('wallet')
    localStorage && localStorage.removeItem('account')
    localStorage && localStorage.removeItem('masterAddress')
    location && location.reload(true)
  }
}

export default LinkBlock
