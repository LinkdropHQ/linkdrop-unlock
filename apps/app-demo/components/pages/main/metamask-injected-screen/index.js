import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Select, Button, Loading } from 'linkdrop-ui-kit'
import AssetValueInput from './asset-value-input'
import CustomAssetAddressInput from './custom-asset-address-input'
import { LinkBlock } from 'components/pages/common'
import { getHashVariables } from 'linkdrop-commons'
import { ethers } from 'ethers'
import { LoadingBar } from 'components/common'
import configs from 'config-demo'
import debounce from 'debounce'

@actions(({
  user: { loading, wallet, errors },
  metamask: { mmStatus, mmBalanceFormatted, mmAssetBalanceFormatted, mmAssetSymbol, mmLoading, mmAssetDecimals },
  tokens: { assets, balanceFormatted, assetBalanceFormatted, tokenId }
}) => ({
  loading,
  mmAssetBalanceFormatted,
  mmBalanceFormatted,
  assets,
  symbol: mmAssetSymbol,
  balanceFormatted,
  assetBalanceFormatted,
  wallet,
  mmLoading,
  mmStatus,
  mmAssetDecimals,
  tokenId,
  errors
}))
@translate('pages.main')
class MetamaskInjectedScreen extends React.Component {
  constructor (props) {
    super(props)
    const { chainId = '4' } = getHashVariables()
    this.state = {
      currentAsset: ethers.constants.AddressZero,
      assetAddress: '',
      assetAmount: 0,
      ethAmount: 0,
      assetId: ''
    }
    this.checkErc20Balance = debounce(this.checkErc20Balance.bind(this, chainId, props.account), 500)
    this.checkErc721Presence = debounce(this.checkErc721Presence.bind(this, chainId, props.account), 500)
  }

  componentDidMount () {
    const { chainId = '4' } = getHashVariables()
    const { account } = this.props
    if (Number(chainId) !== 4) {
      // get all assets if network is Rinkeby
      return this.actions().tokens.getAssets({ account })
    }
    // otherwise call eth balance from current wallet
    this.actions().metamask.getEthBalance({ account, chainId })
  }

  componentWillReceiveProps ({ errors, balanceFormatted, symbol, mmStatus, wallet, assetBalanceFormatted, tokenId }) {
    const { chainId = '4' } = getHashVariables()
    const { assetAddress, currentAsset, assetId } = this.state
    const { balanceFormatted: prevBalanceFormatted, onFinish, mmStatus: prevMmStatus, assetBalanceFormatted: prevAssetBalanceFormatted, tokenId: prevTokenId, errors: prevErrors } = this.props
    if (mmStatus && mmStatus === 'finished' && mmStatus !== prevMmStatus) {
      this.setState({
        searchStarted: true
      }, _ => {
        if (currentAsset === 'erc20' || currentAsset === ethers.constants.AddressZero) {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.checkBalance({ account: wallet, chainId, tokenAddress: assetAddress }), configs.balanceCheckInterval)
        } else {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.checkErc721Balance({ account: wallet, chainId, tokenAddress: assetAddress, tokenId: assetId }), configs.balanceCheckInterval)
        }
      })
      return
    }
    if (assetAddress !== '' && errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.setState({
        searchStarted: false
      }, _ => {
        this.intervalCheck && window.clearInterval(this.intervalCheck)
      })
    }
    if (
      (balanceFormatted && Number(balanceFormatted) > 0 && balanceFormatted !== prevBalanceFormatted) ||
      (assetBalanceFormatted && Number(assetBalanceFormatted) > 0 && assetBalanceFormatted !== prevAssetBalanceFormatted) ||
      (tokenId && !prevTokenId && prevTokenId !== tokenId)
    ) {
      this.intervalCheck && window.clearInterval(this.intervalCheck)
      this.setState({ tokensUploaded: true }, _ => {
        window.setTimeout(_ => onFinish && onFinish(), configs.showLinkTimeout)
      })
    }
  }

  render () {
    const { chainId = '4' } = getHashVariables()
    const { errors, assets, account, mmBalanceFormatted, mmLoading, symbol, mmAssetBalanceFormatted } = this.props
    const { currentAsset, assetAddress, assetAmount, ethAmount, searchStarted, tokensUploaded, assetId } = this.state
    const options = this.getOptions({ chainId, assets })
    return <LinkBlock title={this.t('titles.sendWithMetamask')}>
      <div className={styles.container}>
        <Select
          placeholder={this.t(`titles.chooseAsset`)}
          options={options}
          value={currentAsset}
          className={styles.select}
          onChange={({ value }) => {
            this.setState({ currentAsset: value, assetAddress: '', assetAmount: 0 })
          }}
        />
        {this.renderAddressInput({ chainId, account, loading: mmLoading, currentAsset })}
        {this.renderBalances({ mmBalanceFormatted, assetAddress, symbol, mmAssetBalanceFormatted, loading: mmLoading, currentAsset })}
        {this.renderEthValueInput({ loading: mmLoading, value: ethAmount, currentAsset })}
        {this.renderTokenValueInput({ loading: mmLoading, currentAsset, symbol, value: assetAmount })}
        {this.renderTokenIdInput({ loading: mmLoading, currentAsset, symbol, value: assetId })}
        {this.renderButton({ errors, loading: mmLoading, tokensUploaded, assetAmount, ethAmount, account, chainId, currentAsset, assetAddress, searchStarted, mmAssetBalanceFormatted, assetId })}
      </div>
    </LinkBlock>
  }

  getOptions ({ chainId, assets }) {
    // if network is 4, then show only two options
    if (Number(chainId) === 4) {
      const ethWalletContract = ethers.constants.AddressZero
      return [
        { value: ethWalletContract, label: this.t('titles.eth') },
        { value: 'erc20', label: this.t('titles.erc20') },
        { value: 'erc721', label: this.t('titles.erc721') }
      ]
    }
    // otherwise show all options
    return assets.map(({ contract: { name, symbol, address } }) => ({ value: address, label: symbol }))
  }

  renderButton ({ loading, errors, tokensUploaded, assetAmount, ethAmount, account, chainId, currentAsset, assetAddress, searchStarted, mmAssetBalanceFormatted, assetId }) {
    // now sending stuff to wallet
    if (searchStarted) {
      return <LoadingBar
        className={styles.loading}
        success={tokensUploaded}
      />
    }
    let disabled = false
    if (
      loading ||
      (currentAsset === 'erc721' && assetId.length === 0) ||
      (currentAsset === 'erc20' && (!assetAmount || Number(assetAmount) <= 0 || !mmAssetBalanceFormatted)) ||
      (currentAsset === ethers.constants.AddressZero && Number(ethAmount) <= 0)
    ) {
      disabled = true
    }
    return <Button
      className={styles.button}
      disabled={disabled}
      onClick={_ => {
        this.actions().metamask.sendTokensFromMetamask({ currentAsset, chainId, assetAmount, ethAmount, account, tokenAddress: assetAddress, assetId })
      }}
    >
      {this.t('buttons.continue')}
    </Button>
  }

  renderBalances ({ mmBalanceFormatted, loading, symbol, mmAssetBalanceFormatted, assetAddress, currentAsset }) {
    const currentAssetData = assetAddress.length > 0 && mmAssetBalanceFormatted
    if (currentAsset === 'erc721') { return null }
    if (currentAsset === 'erc20' && symbol && currentAssetData) {
      return <div className={styles.balances}>
        {loading && <Loading size='small' className={styles.loading} />}
        {!loading && <div>{`${symbol}: ${mmAssetBalanceFormatted}`}</div>}
      </div>
    }
    if (currentAsset === ethers.constants.AddressZero) {
      return <div className={styles.balances}>
        {loading && <Loading size='small' className={styles.loading} />}
        {<div>{this.t('titles.eth')}: {mmBalanceFormatted != null && Number(mmBalanceFormatted).toFixed(4)}</div>}
      </div>
    }
  }

  renderAddressInput ({ loading, chainId, account, currentAsset }) {
    if (Number(chainId) === 4) {
      // if network id is 4, then show input to add custom asset address
      const ethWalletContract = ethers.constants.AddressZero
      if (currentAsset != null && currentAsset !== ethWalletContract) {
        return <div className={styles.inputContainer}>
          <CustomAssetAddressInput disabled={loading} onChange={({ value }) => {
            this.setState({ assetAddress: value }, _ => {
              if (currentAsset === 'erc20') {
                this.checkErc20Balance(value)
              } else if (currentAsset === 'erc721') {
                this.checkErc721Presence(value)
              }
            })
          }} />
        </div>
      }
    }
  }

  checkErc20Balance (chainId, account, value) {
    if (value.length < 42) { return }
    this.actions().metamask.getAssetBalance({ chainId, tokenAddress: value, account })
  }

  checkErc721Presence (chainId, account, value) {
    if (value.length < 42) { return }
    this.actions().metamask.checkAssetPresence({ chainId, tokenAddress: value, account })
  }

  renderTokenValueInput ({ currentAsset, symbol, value, loading }) {
    if (!currentAsset || currentAsset !== 'erc20' || !symbol) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ assetAmount: value })} value={value} title={symbol} />
  }

  renderTokenIdInput ({ currentAsset, symbol, value, loading }) {
    if (!currentAsset || currentAsset !== 'erc721' || !symbol) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ assetId: value })} value={value} title='ID: ' />
  }

  renderEthValueInput ({ currentAsset, value, loading }) {
    if (!currentAsset || currentAsset !== ethers.constants.AddressZero) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ ethAmount: value })} value={value} title={this.t('titles.eth')} />
  }
}

export default MetamaskInjectedScreen
