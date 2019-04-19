import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Alert, Button, TextControlBlock, Icons } from 'linkdrop-ui-kit'
import classNames from 'classnames'
import { LinkBlock } from 'components/pages/common'
import QRCode from 'qrcode.react'

@translate('pages.main')
class LinkSahre extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showQr: false
    }
  }

  render () {
    const { onClick } = this.props
    const { showQr } = this.state
    return <LinkBlock title={this.t('titles.shareLink')} style={{ height: 528 }}>
      <div className={classNames({
        [styles.showQr]: showQr
      })}>
        {this.renderMainScreen({ onClick })}
        {this.renderQrScreen({ onClose: () => this.setState({ showQr: false }) })}
      </div>
    </LinkBlock>
  }

  renderMainScreen ({ onClick }) {
    return <div className={classNames(styles.container, styles.main)}>
      <Alert className={styles.alert} icon={<Icons.Check fill={ALERT_COLOR} stroke={ALERT_COLOR} />} style={{ borderColor: ALERT_COLOR }} />
      <div className={styles.title}>{this.t('titles.linkDone')}</div>
      <TextControlBlock
        icon={<Icons.Qr />}
        className={styles.copyBlock}
        style={{ maxWidth: 340 }}
        onClick={({ value }) => this.setState({
          showQr: true
        })}
        value='0x5f770e2c1f7b2c4ad788fe35eaffdf0eac2a4fcc'
      />
      <Button onClick={_ => onClick && onClick()} className={styles.button}>{this.t('buttons.copyLink')}</Button>
    </div>
  }

  renderQrScreen ({ onClick, onClose }) {
    return <div className={classNames(styles.container, styles.secondary)}>
      <div className={styles.mainTitle}>{this.t('titles.scanCode')}</div>
      <div className={styles.qr}>
        <QRCode size={200} value='http://facebook.github.io/react/' />
      </div>
      <Button inverted onClick={_ => onClose && onClose()} className={styles.button}>{this.t('buttons.close')}</Button>
    </div>
  }
}

export default LinkSahre

const ALERT_COLOR = '#2BC64F'
