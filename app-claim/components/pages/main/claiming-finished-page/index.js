import React from 'react'
import { Alert, Icons } from 'linkdrop-ui-kit'
import { translate } from 'decorators'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { transactionId, amount, symbol } = this.props
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.tokensClaimed', { tokens: `${amount} ${symbol}` }) }} />
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('titles.seeDetails', { transactionLink: `https://etherscan.io/tx/${transactionId}` }) }} />
    </div>
  }
}

export default ClaimingFinishedPage
