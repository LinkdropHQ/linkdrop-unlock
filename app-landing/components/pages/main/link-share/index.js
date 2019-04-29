import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Alert, Button, TextControlBlock, Icons } from 'linkdrop-ui-kit'
import classNames from 'classnames'
import { LinkBlock, QrShare } from 'components/pages/common'

@actions(({ user: { link, loading } }) => ({ link, loading }))
@translate('pages.main')
class LinkSahre extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showQr: false
    }
  }

  componentDidMount () {
    this.actions().user.generateLink()
  }

  render () {
    const { onClick, link } = this.props
    const { showQr } = this.state
    return <LinkBlock title={this.t('titles.shareLink')} style={{ height: 528 }}>
      <div className={classNames({
        [styles.showQr]: showQr
      })}>
        {this.renderMainScreen({ onClick, link })}
        {this.renderQrScreen({ onClose: onClick, link })}
      </div>
    </LinkBlock>
  }

  renderMainScreen ({ onClick, link }) {
    if (!link) return null
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
        value={link}
      />
      <Button onClick={_ => onClick && onClick()} className={styles.button}>{this.t('buttons.copyLink')}</Button>
    </div>
  }

  renderQrScreen ({ onClick, onClose, link }) {
    if (!link) return null
    return <div className={styles.secondary}>
      <QrShare t={this.t} onClose={onClose} value={link} />
    </div>
  }
}

export default LinkSahre

const ALERT_COLOR = '#2BC64F'
