import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import numeral from 'numeral'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class ApproveSummary extends React.Component {
  render () {
    const { serviceFee, linksAmount, ethAmount, tokenAmount, tokenSymbol, tokenType } = this.props
    const ethAmountFinal = numeral(ethAmount).add(serviceFee).multiply(linksAmount).value()
    const onlyServiceFee = numeral(serviceFee).multiply(linksAmount).value()
    const onlyEthForLinks = numeral(ethAmount).multiply(linksAmount).value()
    if (tokenType === 'erc20') {
      return <div className={styles.container}>
        <div dangerouslySetInnerHTML={{ __html: this.t('titles.approveTokens', { tokenAmount: Number(tokenAmount) * Number(linksAmount), tokenSymbol }) }} />
      </div>
    }
    return <div className={styles.container}>
      <div dangerouslySetInnerHTML={{ __html: this.t('titles.sendEthToGenerate', { ethAmount: ethAmountFinal }) }} />
      <div className={styles.contents}>
        <div className={styles.contentsItem} dangerouslySetInnerHTML={{ __html: this.t('titles.etherToDistribute', { ethAmount: onlyEthForLinks }) }} />
        <div className={styles.contentsItem} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeeToDistribute', { ethAmount: onlyServiceFee }) }} />
      </div>
    </div>
  }
}

export default ApproveSummary
