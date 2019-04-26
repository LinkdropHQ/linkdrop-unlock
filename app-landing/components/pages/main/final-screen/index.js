import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Icons, Button, TextControlBlock } from 'linkdrop-ui-kit'
import { LinkBlock, QrShare } from 'components/pages/common'
import classNames from 'classnames'
import { copyToClipboard } from 'helpers'

@translate('pages.main')
class FinalScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showQr: false,
      blink: false
    }
  }
  render () {
    const { onClick } = this.props
    const { showQr } = this.state
    return <LinkBlock title={this.t('titles.getYourLink')}>
      <div className={classNames({
        [styles.showQr]: showQr
      })}>
        {this.renderMainScreen({ onClick })}
        {this.renderQrScreen({ onClose: _ => this.setState({ showQr: false }) })}
      </div>
    </LinkBlock>
  }

  renderMainScreen ({ onClick }) {
    const { blink } = this.state
    return <div className={classNames(styles.container, styles.main)}>
      <TextControlBlock
        blinkOnClick
        blink={blink}
        icon={<Icons.Qr />}
        className={styles.copyBlock}
        style={{ maxWidth: 340 }}
        onBlickChange={({ value }) => this.setState({ blink: value })}
        onClick={({ value }) => this.setState({
          showQr: true
        })}
        value='0x5f770e2c1f7b2c4ad788fe35eaffdf0eac2a4fcc'
      />
      <Button className={styles.button} onClick={_ => this.setState({ blink: true })}>
        {this.t('buttons.copyLink')}
      </Button>
      <div className={styles.description}>{this.t('descriptions.newLinkInstruction')}</div>

      <div className={styles.title}>
        {this.t('titles.linkdrop')}
      </div>

      <div className={styles.listItem}>
        <Icons.CheckSmall /> {this.t('titles.multipleLinks')}
      </div>

      <Button inverted className={styles.button} >
        {this.t('buttons.joinWaitlist')}
      </Button>
    </div>
  }

  renderQrScreen ({ onClick, onClose }) {
    return <div className={styles.secondary}>
      <QrShare t={this.t} onClose={onClose} value='http://facebook.github.io/react/' />
    </div>
  }
}

export default FinalScreen
