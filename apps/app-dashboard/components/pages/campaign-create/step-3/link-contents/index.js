import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class LinkContents extends React.Component {
  render () {
    const { ethAmount, tokenAmount, tokenSymbol } = this.props
    if (ethAmount && !tokenAmount && tokenSymbol === 'ETH') {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount: ethAmount, tokenSymbol })}
      </p>
    }
    if (!ethAmount || Number(ethAmount) === 0) {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount, tokenSymbol })}
      </p>
    }
    return <p className={styles.dataContent}>
      {this.t('titles.oneLinkContentsWithEth', { tokenAmount, tokenSymbol, ethAmount })}
    </p>
  }
}

export default LinkContents
