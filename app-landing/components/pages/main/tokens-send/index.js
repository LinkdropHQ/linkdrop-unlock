import React from 'react'
import { translate } from 'decorators'
import { LoadingBar } from 'components/common'
import styles from './styles.module'
import { TextCopyBlock } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'
import QRCode from 'qrcode.react'
import { copyToClipboard } from 'helpers'

@translate('pages.main')
class TokensSend extends React.Component {
  componentDidMount () {
    const { onClick } = this.props
    window.setTimeout(_ => this.setState({ tokensUploaded: true }, _ => {
      window.setTimeout(_ => onClick && onClick(), 3000)
    }), 3000)
  }

  render () {
    const { tokensUploaded } = this.state || {}
    return <LinkBlock title={this.t('titles.sendTokensToAddress')} style={{ height: 528 }}>
      <div className={styles.container}>
        <div className={styles.qr}>
          <QRCode size={170} value='http://facebook.github.io/react/' />
        </div>
        <TextCopyBlock
          value='0x5f770e2c1f7b2c4ad788fe35eaffdf0eac2a4fcc'
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
