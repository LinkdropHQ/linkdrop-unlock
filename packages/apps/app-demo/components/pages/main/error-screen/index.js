import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Icons, Alert } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@translate('pages.main')
class ErrorScreen extends React.Component {
  render () {
    const { error, title, chainId } = this.props
    return <LinkBlock title={title || this.t(`titles.errorOccured`)}>
      <div className={styles.container}>
        <Alert className={styles.alert} icon={<Icons.Exclamation />} />
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t(`errors.${error}`, { network: chainId }) }} />
      </div>
    </LinkBlock>
  }
}

export default ErrorScreen
