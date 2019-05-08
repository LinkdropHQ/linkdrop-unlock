import React from 'react'
import { translate, actions } from 'decorators'
import { LoadingBar } from 'components/common'
import styles from './styles.module'
import { TextCopyBlock, Input, Button, Checkbox } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'
import QRCode from 'qrcode.react'
import { copyToClipboard, getHashVariables } from 'linkdrop-commons'
import classNames from 'classnames'
import text from 'texts'
import configs from 'config-landing'

@actions(({ user: { wallet, balance, alert }, tokens: { decimals, symbol, tokenId } }) => ({ wallet, balance, alert, decimals, symbol, tokenId }))
@translate('pages.main')
class TokensSend extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      manualTokenCheck: false,
      tokenAddress: '',
      started: false,
      manualStarted: false,
      isERC721: false
    }
  }

  componentWillReceiveProps ({ balance, symbol, tokenId }) {
    const { balance: prevBalance, onFinish, symbol: prevSymbol, tokenId: prevTokenId } = this.props
    const { n } = getHashVariables()
    const { isERC721 } = this.state
    if (
      (balance && balance > 0 && balance !== prevBalance) ||
      (tokenId != null && prevTokenId === null)
    ) {
      this.intervalCheck && window.clearInterval(this.intervalCheck)
      this.manualTokensCheck && window.clearInterval(this.manualTokensCheck)
      this.alertTimeout && window.clearTimeout(this.alertTimeout)
      this.setState({ tokensUploaded: true }, _ => {
        window.setTimeout(_ => onFinish && onFinish(), configs.showLinkTimeout)
      })
    }
    if (prevSymbol === null && symbol != null && symbol !== prevSymbol) {
      this.manualTokensCheck = window.setInterval(_ => this.actions().tokens.checkTokensManually({ isERC721, networkId: n }), configs.balanceCheckIntervalManual)
    }
  }

  render () {
    const { tokensUploaded, manualTokenCheck, tokenAddress, started, manualStarted, isERC721 } = this.state || {}
    const { wallet, alert, symbol } = this.props
    return manualTokenCheck ? this.renderManualTokenCheckScreen({ tokenAddress, manualStarted, symbol, isERC721 }) : this.renderOriginalScreen({ wallet, tokensUploaded, alert, started })
  }

  renderOriginalScreen ({ wallet, tokensUploaded, alert, started }) {
    const { n } = getHashVariables()
    return <LinkBlock title={this.t('titles.sendTokensToAddress')} style={{ height: 528 }}>
      <div className={classNames(styles.container, {
        [styles.rinkeby]: n === '4'
      })}>
        <div className={styles.qr}>
          <QRCode size={170} value={wallet} />
        </div>
        {n === '4' && <div className={styles.network}>Rinkeby network</div>}
        <TextCopyBlock
          value={wallet}
          className={styles.copyBlock}
          style={{ maxWidth: 340 }}
          onClick={({ value }) => copyToClipboard({ value })}
        />
        {this.renderLoadingOrButton({ started, tokensUploaded, alert })}
        {this.renderTermsOrAlert({ alert })}
      </div>
    </LinkBlock>
  }

  renderLoadingOrButton ({ started, tokensUploaded, alert }) {
    if (started) {
      return <LoadingBar
        className={styles.loading}
        success={tokensUploaded}
        alert={alert}
        onClick={_ => this.setState({ manualTokenCheck: true }, _ => this.intervalCheck && window.clearInterval(this.intervalCheck))}
      />
    }
    return <Button onClick={_ => this.startSearchingForTokens()} className={styles.nextButton}>{this.t('buttons.next')}</Button>
  }

  startSearchingForTokens () {
    const { n } = getHashVariables()
    this.setState({
      started: true
    }, _ => {
      const { wallet } = this.props
      this.intervalCheck = window.setInterval(_ => this.actions().tokens.checkBalance({ account: wallet, networkId: n }), configs.balanceCheckInterval)
      this.alertTimeout = window.setTimeout(_ => this.actions().user.setAlert({ alert: this.t('errors.addManually') }), configs.showManualTimeout)
    })
  }

  renderManualTokenCheckScreen ({ tokenAddress, manualStarted, symbol, isERC721 }) {
    const { n } = getHashVariables()
    return <LinkBlock title={this.t('titles.addManually')} style={{ height: 528 }}>
      <div className={classNames(styles.container, styles.containerCentered)}>
        <Input
          value={tokenAddress}
          onChange={({ value }) => this.setState({
            tokenAddress: value
          })}
          className={styles.input}
          placeholder={this.t('titles.tokenAddress')}
        />
        {manualStarted ? <LoadingBar
          className={styles.secondaryLoading}
          loadingTitle={this.t('titles.waitingFor', { tokenSymbol: symbol })}
        /> : <Button
          disabled={!tokenAddress}
          className={styles.button}
          onClick={_ => this.checkTokenAdressManually({ tokenAddress, isERC721, networkId: n })}
        >
          {text('common.buttons.addToken')}
        </Button>}
        <Checkbox disabled={manualStarted} checked={isERC721} onChange={({ value }) => this.setState({ isERC721: value })} title={this.t('titles.isERC721')} />
      </div>
    </LinkBlock>
  }

  checkTokenAdressManually ({ tokenAddress, isERC721, networkId }) {
    this.setState({
      manualStarted: true
    }, _ => {
      this.intervalCheck && window.clearInterval(this.intervalCheck)
      this.actions().tokens.getTokensData({ tokenAddress, isERC721, networkId })
    })
  }

  renderTermsOrAlert ({ alert }) {
    const text = alert ? this.t('titles.footerAddManually') : this.t('titles.terms')
    return <div className={styles.terms} dangerouslySetInnerHTML={{ __html: text }} />
  }
}

export default TokensSend
