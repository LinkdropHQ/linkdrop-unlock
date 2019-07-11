import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ethers } from 'ethers'
import classNames from 'classnames'
import { Loading } from 'linkdrop-ui-kit'
import { Select, Input, PageHeader } from 'components/common'
import TokenAddressInput from './token-address-input'
import LinksContent from './links-content'
import NextButton from './next-button'
import AddIconInfo from './add-icon-info'
import AddEthField from './add-eth-field'
import EthTexts from './eth-texts'
import config from 'config-dashboard'

@actions(({ user: { chainId, currentAddress, loading, proxyAddress }, tokens: { assets, symbol } }) => ({ assets, chainId, symbol, loading, proxyAddress, currentAddress }))
@translate('pages.campaignCreate')
class Step2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tokenSymbol: TOKENS[0].value,
      tokenAmount: '0',
      ethAmount: '0',
      linksAmount: '0',
      addEth: false,
      addIconInfo: false,
      tokenAddress: null
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

  render () {
    const { tokenSymbol, ethAmount, linksAmount, tokenAmount, addEth, tokenAddress, addIconInfo } = this.state
    const { symbol, loading } = this.props
    const tokenType = this.defineTokenType({ tokenSymbol })
    // mainnet
    // const { assets } = this.props
    // const tokens = assets.map(({ contract }) => {
    //   return { label: `${contract.symbol} - ${contract.address}`, value: contract.symbol }
    // })
    return <div className={styles.container}>
      {loading && <Loading withOverlay />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <Select options={TOKENS} value={tokenSymbol} onChange={({ value }) => this.setField({ field: 'tokenSymbol', value })} />
          </div>
          {this.renderTokenInputs({ ethAmount, tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, addEth })}
          <div className={styles.linksAmount}>
            <h3 className={styles.subtitle}>{this.t('titles.totalLinks')}</h3>
            <div className={styles.linksAmountContainer}>
              <Input numberInput className={styles.input} value={linksAmount} onChange={({ value }) => this.setField({ field: 'linksAmount', value: parseFloat(value) })} />
              <AddIconInfo addIconInfo={addIconInfo} />
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
          {this.renderTexts({
            tokenAddress,
            ethAmount,
            tokenType,
            linksAmount,
            tokenAmount,
            tokenSymbol: symbol || tokenSymbol,
            addEth
          })}
        </div>
      </div>
      <NextButton
        tokenAmount={tokenAmount}
        ethAmount={ethAmount}
        linksAmount={linksAmount}
        tokenSymbol={symbol}
        tokenType={tokenType}
      />
    </div>
  }

  renderTokenInputs ({ tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, ethAmount, addEth }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    const fieldToChange = tokenType === 'erc20' ? 'tokenAmount' : 'ethAmount'
    const amountInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <Input
          disabled={tokenType === 'erc20' && !symbol}
          numberInput
          suffix={tokenType === 'erc20' ? symbol : tokenSymbol}
          className={styles.input}
          value={value}
          onChange={({ value }) => this.setField({ field: fieldToChange, value: parseFloat(value) })}
        />
        <AddEthField
          tokenType={tokenType}
          addEth={addEth}
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
    switch (tokenType) {
      case 'erc20':
        return <div>
          <TokenAddressInput tokenAddress={tokenAddress} tokenType={tokenType} setField={({ value, field }) => this.setField({ value, field })} />
          {amountInput}
        </div>
      case 'eth':
        return <div>
          {amountInput}
        </div>
    }
  }

  defineTokenType ({ tokenSymbol }) {
    if (tokenSymbol === 'ERC20') { return 'erc20' }
    if (tokenSymbol === 'ETH') { return 'eth' }
    if (tokenSymbol === 'ERC721') { return 'erc721' }
  }

  renderTexts ({ ethAmount, tokenAddress, linksAmount, tokenAmount, tokenSymbol, addEth, tokenType }) {
    const value = tokenSymbol === 'erc20' ? tokenAmount : ethAmount
    if (tokenSymbol === 'erc20') {
      if (!linksAmount || !value || !tokenAddress || !tokenSymbol) {
        return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
      }
    }
    if (tokenSymbol === 'eth') {
      if (!linksAmount || Number(linksAmount) === 0 || !value || Number(value) === 0) {
        return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
      }
    }
    return <div>
      {tokenSymbol === 'erc20' && <p className={classNames(styles.text, styles.textMargin15)}>{value * linksAmount} {tokenSymbol}</p>}
      <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} />
      <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType={tokenType} />
      <p className={styles.text}>{this.t('titles.serviceFee', { price: config.linkPrice * linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.serviceFeePerLink', { price: config.linkPrice * 100 })}</p>
    </div>
  }

  setField ({ value, field }) {
    const { tokenSymbol } = this.state
    const { chainId } = this.props
    if (field === 'tokenAddress' && value.length > 42) { return }
    if (field === 'ethAmount' || field === 'tokenAmount') {
      return this.setState({
        [field]: value && String(value).replace(',', '.')
      })
    }
    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenSymbol') {
        this.setState({
          ethAmount: 0,
          addEth: false
        })
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
    value: 'ERC20'
  }
]
