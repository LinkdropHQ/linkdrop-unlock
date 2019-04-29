import React from 'react'
import { translate, actions } from 'decorators'
import { LoadingBar } from 'components/common'
import styles from './styles.module'
import { TextCopyBlock } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'
import QRCode from 'qrcode.react'
import { copyToClipboard } from 'helpers'

@actions(({ user: { wallet, balance } }) => ({ wallet, balance }))
@translate('pages.main')
class TokensSend extends React.Component {
  componentDidMount () {
    // const { onClick } = this.props
    // window.setTimeout(_ => this.setState({ tokensUploaded: true }, _ => {
    //   window.setTimeout(_ => onClick && onClick(), 3000)
    // }), 3000)
    const { wallet } = this.props
    this.intervalCheck = window.setInterval(_ => this.actions().user.checkBalance({ account: wallet }), 3000)
  }

  componentWillReceiveProps ({ balance }) {
    const { balance: prevBalance, onFinish } = this.props
    if (balance && balance > 0 && balance !== prevBalance) {
      window.clearInterval(this.intervalCheck)
      this.setState({ tokensUploaded: true }, _ => {
        window.setTimeout(_ => onFinish && onFinish(), 3000)
      })
    }
  }

  render () {
    const { tokensUploaded } = this.state || {}
    const { wallet } = this.props
    return <LinkBlock title={this.t('titles.sendTokensToAddress')} style={{ height: 528 }}>
      <div className={styles.container}>
        <div className={styles.qr}>
          <QRCode size={170} value={wallet} />
        </div>
        <TextCopyBlock
          value={wallet}
          className={styles.copyBlock}
          style={{ maxWidth: 340 }}
          onClick={({ value }) => copyToClipboard({ value })}
        />
        <LoadingBar className={styles.loading} success={tokensUploaded} />
        <div className={styles.terms} dangerouslySetInnerHTML={{ __html: this.t('titles.terms') }} />
      </div>
    </LinkBlock>
  }
}

export default TokensSend
