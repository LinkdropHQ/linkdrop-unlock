import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ethers } from 'ethers'
import classNames from 'classnames'
import { Icons, Loading } from 'linkdrop-ui-kit'
import { convertFromExponents } from 'linkdrop-commons'
import { Button, Select, Input } from 'components/common'
import TokenAddressInput from './token-address-input'

@actions(({ user: { chainId, currentAddress, loading, proxyAddress }, tokens: { assets, symbol } }) => ({ assets, chainId, symbol, loading, proxyAddress, currentAddress }))
@translate('pages.campaignCreate')
class Step2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // mainnet
      tokenSymbol: this.defineCurrentAsset(),
      tokenAmount: '0',
      ethAmount: '0',
      linksAmount: '0',
      addEth: false,
      addIconInfo: false,
      tokenAddress: null
    }
  }

  componentDidMount () {
    const { proxyAddress, currentAddress } = this.props
    if (!proxyAddress) {
      this.actions().user.createProxyAddress({ currentAddress })
    }
  }

  // mainnet
  // componentDidMount () {
  //   const { account } = this.props
  //   this.actions().tokens.getAssets({ account })
  // }
  // componentWillReceiveProps ({ assets }) {
  //   const { assets: prevAssets } = this.props

  //   if (assets != null && assets.length > 0 && !Immutable.fromJS(assets).equals(Immutable.fromJS(prevAssets))) {
  //     this.setState({
  //       tokenSymbol: this.defineCurrentAsset(assets)
  //     })
  //   }
  // }

  // mainnet
  // defineCurrentAsset (assets) {
  //   let allAssets = assets || this.props.assets
  //   return ((allAssets[0] || {}).contract || {}).symbol
  // }

  defineCurrentAsset (assets) {
    return TOKENS[0].value
  }

  render () {
    const { tokenSymbol, ethAmount, linksAmount, tokenAmount, addEth, tokenAddress } = this.state
    const { symbol, loading } = this.props
    const tokenType = this.defineTokenType({ tokenSymbol })
    // mainnet
    // const { assets } = this.props
    // const tokens = assets.map(({ contract }) => {
    //   return { label: `${contract.symbol} - ${contract.address}`, value: contract.symbol }
    // })
    return <div className={styles.container}>
      {loading && <Loading withOverlay />}
      <div className={styles.title}>{this.t('titles.setupCampaign')}</div>
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <Select options={TOKENS} value={tokenSymbol} onChange={({ value }) => this.setField({ field: 'tokenSymbol', value })} />
          </div>
          {this.renderTokenInputs({ tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount })}
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
          {this.renderTexts({ ethAmount, linksAmount, tokenAmount, tokenSymbol: symbol || tokenSymbol, addEth })}
        </div>
      </div>
      {this.renderNextButton({ tokenAmount, ethAmount, linksAmount, tokenSymbol: symbol || tokenSymbol })}
    </div>
  }

  renderTokenInputs ({ tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, ethAmount }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    const fieldToChange = tokenType === 'erc20' ? 'tokenAmount' : 'ethAmount'
    const amountInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <Input disabled={tokenType === 'erc20' && !symbol} numberInput suffix={tokenType === 'erc20' ? symbol : tokenSymbol} className={styles.input} value={value} onChange={({ value }) => this.setField({ field: fieldToChange, value: parseFloat(value) })} />
        {tokenType !== 'eth' && this.renderAddEthField()}
      </div>
    </div>
    switch (tokenType) {
      case 'erc20':
        return <div>
          {this.renderTokenAddressInput({ tokenAddress, tokenType })}
          {amountInput}
        </div>
      case 'eth':
        return <div>
          {amountInput}
        </div>
    }
  }

  defineTokenType ({ tokenSymbol }) {
    if (tokenSymbol === 'erc20') { return 'erc20' }
    if (tokenSymbol === 'ETH') { return 'eth' }
    if (tokenSymbol === 'erc721') { return 'erc721' }
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

  renderNextButton ({ tokenAmount, ethAmount, linksAmount, tokenSymbol }) {
    let action
    if (tokenSymbol === 'ETH') {
      action = _ => this.actions().campaigns.prepareNewEthData({ ethAmount, linksAmount, tokenSymbol })
    } else {
      action = _ => this.actions().campaigns.prepareNewTokensData({ tokenAmount, ethAmount, linksAmount, tokenSymbol })
    }
    return <div className={styles.controls}>
      <Button onClick={action}>{this.t('buttons.next')}</Button>
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
    const value = tokenSymbol === 'erc20' ? tokenAmount : ethAmount
    if (!linksAmount || Number(linksAmount) === 0 || !value || Number(value) === 0) {
      return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
    }
    return <div>
      {tokenSymbol === 'erc20' && <p className={classNames(styles.text, styles.textMargin15)}>{value * linksAmount} {tokenSymbol}</p>}
      {this.renderEthTexts({ ethAmount, linksAmount, addEth })}
      {this.renderLinkContents({ tokenAmount, tokenSymbol, ethAmount, addEth, linksAmount })}
      <p className={styles.text}>{this.t('titles.serviceFee', { price: CONVERSION_RATE * linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.serviceFeePerLink', { price: CONVERSION_RATE * 100 })}</p>
    </div>
  }

  renderEthTexts ({ ethAmount, linksAmount, addEth }) {
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div>
      <p className={styles.text}>{this.t('titles.ethInLinks', { ethAmount: ethAmount * linksAmount, linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.holdEth')}</p>
    </div>
  }

  renderLinkContents ({ tokenAmount, tokenSymbol, ethAmount, addEth, linksAmount }) {
    if (!tokenAmount || Number(tokenAmount) === 0) {
      return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: ethAmount, tokenSymbol })}`}
      </p>
    }
    return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>
      {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContentsWithEth', { tokenAmount, tokenSymbol, ethAmount: convertFromExponents(ethAmount) })}`}
    </p>
  }

  renderTokenAddressInput ({ tokenAddress, tokenType }) {
    if (tokenType === 'eth') { return null }
    return <TokenAddressInput tokenAddress={tokenAddress} setField={({ value, field }) => this.setField({ value, field })} />
  }

  setField ({ value, field }) {
    const { tokenSymbol } = this.state
    const { chainId } = this.props
    if (field === 'tokenAddress' && value.length > 42) { return }
    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenSymbol') {
        if (value === 'ETH') {
          this.setState({
            ethAmount: 0,
            addEth: false
          })
        }
      }

      if (field === 'tokenAddress') {
        const tokenType = this.defineTokenType({ tokenSymbol })
        if (value.length === 42) {
          if (tokenType === 'erc20') {
            this.actions().tokens.getTokenERC20Data({ tokenAddress: value, chainId })
          }
        }
      }
    })
  }
}

export default Step2

const TOKENS = [
  {
    label: `ETH — ${(ethers.constants.AddressZero).slice(0, 35)}...`,
    value: 'ETH'
  }, {
    label: 'Custom Token ERC20',
    value: 'erc20'
  }
]

const CONVERSION_RATE = 0.2
