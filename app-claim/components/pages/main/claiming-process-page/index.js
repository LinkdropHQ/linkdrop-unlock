import React from 'react'
import { Loading } from 'components/common'
import { translate } from 'decorators'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class ClaimingProcessPage extends React.Component {
  render () {
    const { transactionId } = this.props
    return <div className={commonStyles.container}>
      <Loading container size='small' className={styles.loading} />
      <div className={styles.title}>{this.t('titles.claiming')}</div>
      <div className={styles.subtitle}>{this.t('titles.transactionInProcess')}</div>
      <div className={styles.description}>{this.t('titles.instructions')}</div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('titles.seeDetails', { transactionLink: `https://etherscan.io/tx/${transactionId}` }) }} />
    </div>
  }
}

export default ClaimingProcessPage
