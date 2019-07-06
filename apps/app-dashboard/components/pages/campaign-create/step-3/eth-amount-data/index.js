import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class EthAmountData extends React.Component {
  render () {
    const { ethAmount, linksAmount, tokenAmount } = this.props
    if (!tokenAmount) { return null }
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div className={styles.data}>
      <h3 className={styles.dataTitle}>
        {this.t('titles.totalEthInLinks')}
      </h3>
      <div className={styles.dataContent}>
        {ethAmount * linksAmount} ETH
      </div>
      <div className={styles.extraDataContent}>
        {this.t('titles.ethHold')}
      </div>
    </div>
  }
}

export default EthAmountData
