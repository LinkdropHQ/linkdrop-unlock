import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { TextControlBlock, Button } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'
import QRCode from 'qrcode.react'
import { copyToClipboard } from 'helpers'

@translate('pages.main')
class TokensSend extends React.Component {
  render () {
    const { onClick } = this.props
    return <LinkBlock title={this.t('titles.sendTokensToAddress')} style={{ height: 528 }}>
      <div className={styles.container}>
        <div className={styles.qr}>
          <QRCode size={170} value='http://facebook.github.io/react/' />
        </div>
        <TextControlBlock blinkOnClick value='0x5f770e2c1f7b2c4ad788fe35eaffdf0eac2a4fcc' className={styles.copyBlock} style={{ maxWidth: 340 }} onClick={({ value }) => copyToClipboard({ value })} />
        <Button onClick={_ => onClick && onClick()} className={styles.button}>{this.t('buttons.continue')}</Button>
      </div>
    </LinkBlock>
  }
}

export default TokensSend
