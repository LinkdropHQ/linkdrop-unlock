import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'
import classNames from 'classnames'
import { Icons } from 'linkdrop-ui-kit'
import { convertFromExponents } from 'linkdrop-commons'
import { Button, Select, Input } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class Step2 extends React.Component {
  constructor (props) {
    super(props)
    const tokenSymbol = (TOKENS[0] || {}).value
    this.state = {
      tokenSymbol,
      tokenAmount: '0',
      ethAmount: '0',
      linksAmount: '0',
      addEth: false,
      addIconInfo: false
    }
  }

  render () {
    const { tokenSymbol, ethAmount, linksAmount, tokenAmount, addEth } = this.state
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <div className={styles.title}>{this.t('titles.setupCampaign')}</div>
        <div className={styles.main}>
          <div className={styles.form}>
            <div className={styles.chooseTokens}>
              <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
              <Select options={TOKENS} value={tokenSymbol} onChange={({ value }) => this.setField({ field: 'tokenSymbol', value })} />
            </div>
            <div className={styles.tokensAmount}>
              <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
              <div className={styles.tokensAmountContainer}>
                <Input numberInput suffix={tokenSymbol} className={styles.input} value={tokenAmount || 0} onChange={({ value }) => this.setField({ field: 'tokenAmount', value: parseFloat(value) })} />
                {this.renderAddEthField()}
              </div>
            </div>

            <div className={styles.linksAmount}>
              <h3 className={styles.subtitle}>{this.t('titles.totalLinks')}</h3>
              <div className={styles.linksAmountContainer}>
                <Input numberInput className={styles.input} value={linksAmount || 0} onChange={({ value }) => this.setField({ field: 'linksAmount', value: parseFloat(value) })} />
                {this.renderAddIconInfo()}
              </div>
            </div>
          </div>

          <div className={styles.summary}>
            <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
            {this.renderTexts({ ethAmount, linksAmount, tokenAmount, tokenSymbol, addEth })}
          </div>
        </div>

        <div className={styles.controls}>
          <Button onClick={_ => this.actions().campaigns.prepareNew({ tokenAmount, ethAmount, linksAmount, tokenSymbol })}>{this.t('buttons.next')}</Button>
        </div>
      </div>}
    </Web3Consumer>
  }

  renderAddIconInfo () {
    const { addIconInfo } = this.state
    if (!addIconInfo) {
      return <div className={styles.iconInfoButton}>
        <Button transparent className={styles.extraButton} onClick={_ => this.setField({ field: 'addIconInfo', value: true })}>{this.t('buttons.addTokenIcon')}</Button>
      </div>
    }
    return <div className={styles.iconInfoText}>
      <span>{this.t('titles.howTo')}</span>
      <div dangerouslySetInnerHTML={{ __html: this.t('titles.addIcon') }} />
    </div>
  }

  renderAddEthField () {
    const { addEth, ethAmount } = this.state
    if (!addEth) {
      return <div className={styles.ethAddButton}>
        <Button transparent className={styles.extraButton} onClick={_ => this.setField({ field: 'addEth', value: true })}>{this.t('buttons.addEth')}</Button>
      </div>
    }
    return <div className={styles.ethAddInput}>
      <span>+</span>
      <Input numberInput suffix='ETH' className={styles.ethInput} value={ethAmount || 0} onChange={({ value }) => this.setField({ field: 'ethAmount', value: parseFloat(value) })} />
      <Icons.CloseButton onClick={_ => this.setField({ field: 'addEth', value: false })} />
    </div>
  }

  renderTexts ({ ethAmount, linksAmount, tokenAmount, tokenSymbol, addEth }) {
    if (!linksAmount || Number(linksAmount) === 0 || !tokenAmount || Number(tokenAmount) === 0) {
      return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
    }
    return <div>
      <p className={classNames(styles.text, styles.textMargin15)}>{tokenAmount} {tokenSymbol}</p>
      {this.renderEthTexts({ ethAmount, linksAmount, addEth })}
      {this.renderLinkContents({ tokenAmount, tokenSymbol, ethAmount, addEth, linksAmount })}
      <p className={styles.text}>{this.t('titles.serviceFee', { price: CONVERSION_RATE * linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.serviceFeePerLink', { price: CONVERSION_RATE * 100 })}</p>
    </div>
  }

  renderEthTexts ({ ethAmount, linksAmount, addEth }) {
    if (!ethAmount || Number(ethAmount) === 0 || !addEth) { return null }
    return <div>
      <p className={styles.text}>{this.t('titles.ethInLinks', { ethAmount, linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.holdEth')}</p>
    </div>
  }

  renderLinkContents ({ tokenAmount, tokenSymbol, ethAmount, addEth, linksAmount }) {
    if (!ethAmount || Number(ethAmount) === 0 || !addEth) {
      return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: tokenAmount / linksAmount, tokenSymbol })}`}
      </p>
    }
    return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>
      {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContentsWithEth', { tokenAmount: tokenAmount / linksAmount, tokenSymbol, ethAmount: convertFromExponents(ethAmount / linksAmount) })}`}
    </p>
  }

  setField ({ value, field }) {
    this.setState({
      [field]: value
    })
  }
}

export default Step2

const TOKENS = [
  {
    label: 'BNB — 0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    value: 'BNB'
  }, {
    label: 'DAI — 0x33421a6b4bbe1b6faa2625fe562bdd9a23260359',
    value: 'DAI'
  }
]

const CONVERSION_RATE = 0.2
