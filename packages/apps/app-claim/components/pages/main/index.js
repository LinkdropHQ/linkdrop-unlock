import React from 'react'
import { Loading } from 'components/pages/common'
import { actions, translate, platform, detectBrowser } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import OperaInstruction from './opera-instruction'
import ClaimingFinishedPage from './claiming-finished-page'
import { getHashVariables, defineNetworkName, capitalize } from '@linkdrop/commons'
import { Web3Consumer } from 'web3-react'

@actions(({ user: { errors, step, loading: userLoading, readyToClaim, alreadyClaimed }, tokens: { name, transactionId }, contract: { loading, decimals, amount, symbol, icon } }) => ({
  userLoading,
  loading,
  decimals,
  symbol,
  amount,
  icon,
  name,
  step,
  transactionId,
  errors,
  alreadyClaimed,
  readyToClaim
}))
@platform()
@detectBrowser()
@translate('pages.claim')
class Claim extends React.Component {
  componentDidMount () {
    const { account, active } = this.props
    const {
      linkKey,
      chainId,
      linkdropMasterAddress,
      campaignId,
      lock
    } = getHashVariables()
    if (active && account) {
      console.log('here')
      this.actions().tokens.checkIfClaimed({ address: account, lock, linkKey, chainId, linkdropMasterAddress, campaignId })
    }
    this.actions().user.createSdk({ linkdropMasterAddress, chainId, linkKey, campaignId })
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed }) {
    const { readyToClaim: prevReadyToClaim } = this.props
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) { return }
    const {
      tokenAddress,
      weiAmount,
      tokenAmount,
      expirationTime,
      chainId,
      nftAddress,
      tokenId
    } = getHashVariables()
    // params in url:
    // token - contract/token address,
    // amount - tokens amount,
    // expirationTime - expiration time of link,
    // sender,
    // linkdropSignerSignature,
    // linkKey - private key for link,
    // chainId - network id

    // params needed for claim
    // sender: sender key address, e.g. 0x1234...ff
    // linkdropSignerSignature: ECDSA signature signed by sender (contained in claim link)
    // receiverSignature: ECDSA signature signed by receiver using link key

    // destination: destination address - can be received from web3-react context
    // token: ERC20 token address, 0x000...000 for ether - can be received from url params
    // tokenAmount: token amount in atomic values - can be received from url params
    // expirationTime: link expiration time - can be received from url params
    if (Number(expirationTime) < (+(new Date()) / 1000)) {
      // show error page if link expired
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }

    if (nftAddress && tokenId) {
      return this.actions().contract.getTokenERC721Data({ nftAddress, tokenId, chainId })
    }
    this.actions().contract.getTokenERC20Data({ tokenAddress, weiAmount, tokenAmount, chainId })
  }

  render () {
    return <Web3Consumer>
      {context => this.renderCurrentPage({ context })}
    </Web3Consumer>
  }

  renderCurrentPage ({ context }) {
    const { decimals, amount, symbol, icon, step, userLoading, errors, alreadyClaimed } = this.props
    // in context we can find:
    // active,
    // connectorName,
    // connector,
    // library,
    // networkId,
    // account,
    // error
    const {
      account,
      networkId,
      active
    } = context
    const {
      chainId,
      linkdropMasterAddress
    } = getHashVariables()
    const commonData = { linkdropMasterAddress, chainId, decimals, amount, symbol, icon, wallet: account, loading: userLoading }
    const initialPage = <InitialPage
      {...commonData}
      onClick={_ => {
        if (this.isOpera && !account && this.platform !== 'desktop') {
          // to instruction page
          return this.actions().user.setStep({ step: 3 })
        }
        if (!account) {
          // to wallet choose page
          return this.actions().user.setStep({ step: 2 })
        }
        // to claiming page
        return this.actions().user.setStep({ step: 5 })
      }}
    />

    const walletChoosePage = <WalletChoosePage />

    if (this.platform === 'desktop' && (!account || !active)) {
      // if network id in the link and in the web3 are different
      return <ErrorPage error='NEED_METAMASK' />
    }

    if ((!account || !active) && (step === 1 || step === 0)) {
      return initialPage
    }

    if ((!account || !active) && step === 2) {
      return walletChoosePage
    }

    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage error={errors[0]} />
    }

    if (
      (this.platform === 'desktop' && networkId && Number(chainId) !== Number(networkId)) ||
      (this.platform !== 'desktop' && account && networkId && Number(chainId) !== Number(networkId))) {
      // if network id in the link and in the web3 are different
      return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    }

    if (alreadyClaimed) {
      // if tokens we already claimed (if wallet is totally empty).
      return <ClaimingFinishedPage
        {...commonData}
      />
    }
    switch (step) {
      case 1:
        return initialPage
      case 2:
        // page with wallet select component
        return walletChoosePage
      case 3:
        return <OperaInstruction />
      case 4:
        // page with info about current wallet and button to claim tokens
        return <InitialPage
          {...commonData}
          onClick={_ => {
            this.actions().user.setStep({ step: 5 })
          }}
        />
      case 5:
        // claiming is in process
        return <ClaimingProcessPage
          {...commonData}
        />
      case 6:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
        />
      default:
        // loading
        return <Loading />
    }
  }
}

export default Claim
