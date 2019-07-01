import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'
import classNames from 'classnames'
import { Icons } from 'linkdrop-ui-kit'
import { Button, Input } from 'components/common'

@actions(({ campaigns: { ethAmount, tokenAmount, linksAmount, tokenSymbol } }) => ({ ethAmount, tokenAmount, linksAmount, tokenSymbol }))
@translate('pages.campaignCreate')
class Step3 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardNumber: '0000 0000 0000 0000'
    }
  }
  render () {
    const { ethAmount, tokenAmount, linksAmount, tokenSymbol } = this.props
    const { cardNumber } = this.state
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <div className={styles.title}>{this.t('titles.summaryPay')}</div>
        <div className={styles.main}>
          <div className={styles.summary}>
            <div className={styles.summaryBox}>
              <div>
                <div className={styles.data}>
                  <h3 className={styles.dataTitle}>
                    {this.t('titles.linksToGenerate')}
                  </h3>

                  <div className={styles.dataContent}>
                    {linksAmount}
                  </div>
                </div>
                <div className={styles.data}>
                  <h3 className={styles.dataTitle}>
                    {this.t('titles.serviceFeeTitle')}
                  </h3>
                  <div className={styles.dataContent}>
                    {`$ ${linksAmount * CONVERSION_RATE}`}
                  </div>
                  <div className={styles.extraDataContent}>
                    {this.t('titles.centsPerLink', { cents: CONVERSION_RATE * 100 })}
                  </div>

                </div>
              </div>

              <div>
                <div className={styles.data}>
                  <h3 className={styles.dataTitle}>
                    {this.t('titles.oneLinkContainsTitle')}
                  </h3>
                  <div className={styles.dataContent}>
                    {this.renderLinkContents({ ethAmount, tokenAmount, linksAmount, tokenSymbol })}
                  </div>

                </div>
                {this.renderEthAmoundData({ ethAmount })}
              </div>
            </div>

            <div className={styles.payment}>
              <div className={styles.priceSummary} dangerouslySetInnerHTML={{ __html: this.t('titles.charge', { price: CONVERSION_RATE * 10 * linksAmount }) }} />
              <div className={styles.methods}>{this.t('titles.methods')} <Icons.Lock /></div>
              <Input format='#### #### #### ####' numberInput onChange={({ value }) => this.setField({ field: 'cardNumber', value })} className={styles.input} value={cardNumber} />
            </div>
          </div>
          <div className={styles.description}>
            <p className={styles.text}>{this.t('texts._6')}</p>
            <p className={styles.text}>{this.t('texts._7')}</p>
            <p className={styles.text}>{this.t('texts._8')}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <Button onClick={_ => this.actions().campaigns.proceedPayment({ cardNumber })}>{this.t('buttons.next')}</Button>
        </div>
      </div>}
    </Web3Consumer>
  }

  setField ({ value, field }) {
    this.setState({
      [field]: value
    })
  }

  renderEthAmoundData ({ ethAmount }) {
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div className={styles.data}>
      <h3 className={styles.dataTitle}>
        {this.t('titles.totalEthInLinks')}
      </h3>
      <div className={styles.dataContent}>
        {ethAmount} ETH
      </div>
      <div className={styles.extraDataContent}>
        {this.t('titles.ethHold')}
      </div>
    </div>
  }

  renderLinkContents ({ tokenAmount, tokenSymbol, ethAmount, linksAmount }) {
    if (!ethAmount || Number(ethAmount) === 0) {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount: tokenAmount / linksAmount, tokenSymbol })}
      </p>
    }
    return <p className={styles.dataContent}>
      {this.t('titles.oneLinkContentsWithEth', { tokenAmount: tokenAmount / linksAmount, tokenSymbol, ethAmount: ethAmount / linksAmount })}
    </p>
  }
}

export default Step3

const CONVERSION_RATE = 0.2
