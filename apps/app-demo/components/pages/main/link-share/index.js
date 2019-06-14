/* global web3 */
import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Alert, Button, TextControlBlock, Icons, Loading } from 'linkdrop-ui-kit'
import classNames from 'classnames'
import { LinkBlock, QrShare } from 'components/pages/common'
import { copyToClipboard, getHashVariables } from 'linkdrop-commons'
import variables from 'variables'
import { ethers } from 'ethers'

@actions(({ user: { link, loading, errors }, tokens: { standard } }) => ({ link, loading, standard, errors }))
@translate('pages.main')
class LinkShare extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showQr: false
    }
  }

  componentWillReceiveProps ({ errors, standard, link, account, connector }) {
    const { errors: prevErrors, standard: prevStandard } = this.props
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
    }
    if (standard && !prevStandard && account && connector) {
      this.generateLink({ standard, link, account, connector })
    }
  }

  componentDidMount () {
    const { standard, link, account, connector } = this.props
    this.generateLink({ standard, link, account, connector })
  }

  generateLink ({ standard, link, account, connector }) {
    const {
      chainId = '4'
    } = getHashVariables()
    if (link) { return }
    if (standard === 'erc20') {
      if (connector === 'MetaMask' && account) {
        const provider = new ethers.providers.Web3Provider(web3.currentProvider)
        return this.actions().user.generateERC20Web3Link({ chainId, provider })
      }
      return this.actions().user.generateERC20Link({ chainId })
    } else if (standard === 'erc721') {
      if (connector === 'MetaMask' && account) {
        const provider = new ethers.providers.Web3Provider(web3.currentProvider)
        return this.actions().user.generateERC721Web3Link({ chainId, provider })
      }
      this.actions().user.generateERC721Link({ chainId })
    }
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
    if (!link) return <Loading />
    return <div className={classNames(styles.container, styles.main)}>
      <Alert className={styles.alert} icon={<Icons.Check fill={variables.greenColor} stroke={variables.greenColor} />} style={{ borderColor: variables.greenColor }} />
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
      <Button onClick={_ => {
        copyToClipboard({ value: link })
        onClick && onClick()
      }} className={styles.button}>{this.t('buttons.copyLink')}</Button>
    </div>
  }

  renderQrScreen ({ onClick, onClose, link }) {
    if (!link) return null
    return <div className={styles.secondary}>
      <QrShare t={this.t} onClose={onClose} value={link} />
    </div>
  }
}

export default LinkShare
