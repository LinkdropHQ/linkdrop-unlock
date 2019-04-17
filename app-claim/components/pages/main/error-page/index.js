import React from 'react'
import { Alert, Icons } from 'linkdrop-ui-kit'
import { translate } from 'decorators'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class ErrorPage extends React.Component {
  render () {
    const { error } = this.props
    return <div className={commonStyles.container}>
      <Alert className={styles.alert} icon={this.defineIcon({ error })} />
      <div className={styles.title}>{this.t(`errors.${error}.title`)}</div>
      <div className={styles.description}>{this.t(`errors.${error}.description`)}</div>
    </div>
  }

  defineIcon ({ error }) {
    switch (error) {
      case 'LINK_EXPIRED':
        return <Icons.Clock />
      case 'LINK_CANCELED':
        return <Icons.Cross />
      default:
        return <Icons.Exclamation />
    }
  }
}

export default ErrorPage
