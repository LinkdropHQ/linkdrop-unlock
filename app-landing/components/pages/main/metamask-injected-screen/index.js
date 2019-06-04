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
import configs from 'config-landing'

@actions(({
  user: { loading, wallet },
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
  tokenId
}))
@translate('pages.main')
class MetamaskInjectedScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentAsset: ethers.constants.AddressZero,
      assetAddress: '',
      assetAmount: 0,
      ethAmount: 0,
      assetId: ''
    }
  }
  componentDidMount () {
    const { n = '4' } = getHashVariables()
    const { account } = this.props
    if (Number(n) !== 4) {
      // get all assets if network is Rinkeby
      return this.actions().tokens.getAssets({ account })
    }
    // otherwise call eth balance from current wallet
    this.actions().metamask.getEthBalance({ account, networkId: n })
  }

  componentWillReceiveProps ({ balanceFormatted, symbol, mmStatus, wallet, assetBalanceFormatted, tokenId }) {
    const { n = '4' } = getHashVariables()
    const { assetAddress, currentAsset, assetId } = this.state
    const { balanceFormatted: prevBalanceFormatted, onFinish, mmStatus: prevMmStatus, assetBalanceFormatted: prevAssetBalanceFormatted, tokenId: prevTokenId } = this.props
    if (mmStatus && mmStatus === 'finished' && mmStatus !== prevMmStatus) {
      this.setState({
        searchStarted: true
      }, _ => {
        if (currentAsset === 'erc20' || currentAsset === ethers.constants.AddressZero) {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.checkBalance({ account: wallet, networkId: n, tokenAddress: assetAddress }), configs.balanceCheckInterval)
        } else {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.checkErc721Balance({ account: wallet, networkId: n, tokenAddress: assetAddress, tokenId: assetId }), configs.balanceCheckInterval)
        }
      })
      return
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
    const { n = '4' } = getHashVariables()
    const { assets, account, mmBalanceFormatted, mmLoading, symbol, mmAssetBalanceFormatted } = this.props
    const { currentAsset, assetAddress, assetAmount, ethAmount, searchStarted, tokensUploaded, assetId } = this.state
    const options = this.getOptions({ networkId: n, assets })
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
        {this.renderAddressInput({ networkId: n, account, loading: mmLoading, currentAsset })}
        {this.renderBalances({ mmBalanceFormatted, assetAddress, symbol, mmAssetBalanceFormatted, loading: mmLoading, currentAsset })}
        {this.renderEthValueInput({ networkId: n, loading: mmLoading, account, value: ethAmount, currentAsset })}
        {this.renderTokenValueInput({ networkId: n, loading: mmLoading, account, currentAsset, symbol, value: assetAmount })}
        {this.renderTokenIdInput({ loading: mmLoading, networkId: n, account, currentAsset, symbol, value: assetId })}
        {this.renderButton({ tokensUploaded, assetAmount, ethAmount, account, networkId: n, currentAsset, assetAddress, searchStarted, mmAssetBalanceFormatted, assetId })}
      </div>
    </LinkBlock>
  }

  getOptions ({ networkId: n, assets }) {
    // if network is 4, then show only two options
    if (Number(n) === 4) {
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

  renderButton ({ tokensUploaded, assetAmount, ethAmount, account, networkId, currentAsset, assetAddress, searchStarted, mmAssetBalanceFormatted, assetId }) {
    // now sending stuff to wallet
    if (searchStarted) {
      return <LoadingBar
        className={styles.loading}
        success={tokensUploaded}
      />
    }
    let disabled = false
    if (
      (currentAsset === 'erc20' && (!assetAmount || Number(assetAmount) <= 0 || !mmAssetBalanceFormatted)) ||
      (currentAsset === ethers.constants.AddressZero && Number(ethAmount) <= 0)
    ) {
      disabled = true
    }
    return <Button
      className={styles.button}
      disabled={disabled}
      onClick={_ => {
        this.actions().metamask.sendTokensFromMetamask({ currentAsset, networkId, assetAmount, ethAmount, account, tokenAddress: assetAddress, assetId })
      }}
    >
      {this.t('buttons.continue')}
    </Button>
  }

  renderBalances ({ mmBalanceFormatted, loading, symbol, mmAssetBalanceFormatted, assetAddress, currentAsset }) {
    const currentAssetData = assetAddress.length > 0 && mmAssetBalanceFormatted
    return <div className={styles.balances}>
      {loading && <Loading size='small' className={styles.loading} />}
      <div>{this.t('titles.eth')}: {mmBalanceFormatted != null && Number(mmBalanceFormatted).toFixed(4)}</div>
      {!loading && currentAsset === 'erc20' && symbol && currentAssetData && <div>{`${symbol}: ${mmAssetBalanceFormatted}`}</div>}
    </div>
  }

  renderAddressInput ({ loading, networkId, account, currentAsset }) {
    if (Number(networkId) === 4) {
      // if network id is 4, then show input to add custom asset address
      const ethWalletContract = ethers.constants.AddressZero
      if (currentAsset != null && currentAsset !== ethWalletContract) {
        return <div className={styles.inputContainer}>
          <CustomAssetAddressInput disabled={loading} currentAsset={currentAsset} networkId={networkId} account={account} onChange={({ value }) => {
            this.setState({ assetAddress: value }, _ => {
              if (currentAsset === 'erc20') {
                this.actions().metamask.getAssetBalance({ networkId, tokenAddress: value, account })
              } else if (currentAsset === 'erc721') {
                this.actions().metamask.checkAssetPresence({ networkId, tokenAddress: value, account })
              }
            })
          }} />
        </div>
      }
    }
  }

  renderTokenValueInput ({ networkId, account, currentAsset, symbol, value, loading }) {
    if (!currentAsset || currentAsset !== 'erc20' || !symbol) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ assetAmount: value })} value={value} title={symbol} networkId={networkId} account={account} />
  }

  renderTokenIdInput ({ networkId, account, currentAsset, symbol, value, loading }) {
    if (!currentAsset || currentAsset !== 'erc721' || !symbol) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ assetId: value })} value={value} title='ID: ' networkId={networkId} account={account} />
  }

  renderEthValueInput ({ networkId, account, currentAsset, value, loading }) {
    if (!currentAsset || currentAsset !== ethers.constants.AddressZero) { return }
    return <AssetValueInput disabled={loading} onChange={({ value }) => this.setState({ ethAmount: value })} value={value} title={this.t('titles.eth')} networkId={networkId} account={account} />
  }
}

export default MetamaskInjectedScreen
