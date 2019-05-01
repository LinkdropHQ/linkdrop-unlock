import React from 'react'
import { Button, Alert, Icons, RetinaImage } from 'linkdrop-ui-kit'
import { translate, actions, platform } from 'decorators'
import { getImages, getWalletLink, getWalletData } from 'helpers'
import { copyToClipboard } from 'linkdrop-commons'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'
import Slider from './slider'

import CommonInstruction from './common-instruction'

@actions(({ user: { walletType } }) => ({ walletType }))
@translate('pages.main')
@platform()
class WalletChoosePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSlider: null
    }
  }

  render () {
    const { showSlider } = this.state
    const { walletType } = this.props
    const { platform } = this
    const buttonLink = platform !== 'desktop' && getWalletLink({ platform, wallet: 'trust', currentUrl: window.location.href })
    const buttonTitle = getWalletData({ wallet: 'trust' }).name
    if (walletType && walletType != null) {
      return this.renderWalletInstruction({ walletType })
    } else {
      return <div className={classNames(commonStyles.container, styles.container, {
        [styles.sliderShow]: showSlider,
        [styles.sliderHide]: showSlider === false
      })}>
        <Alert className={styles.alert} icon={<Icons.Exclamation />} />
        <div className={styles.title}>{this.t('titles.needWallet')}</div>
        {platform !== 'desktop' && <Button href={buttonLink} target='_blank' className={styles.button}>
          {this.t('buttons.useWallet', { wallet: buttonTitle })}
        </Button>}
        {this.renderSlider({ walletType })}
      </div>
    }
  }

  renderWalletInstruction ({ walletType }) {
    const { showSlider } = this.state
    const walletTitle = getWalletData({ wallet: walletType }).name
    let instruction = ''
    switch (walletType) {
      case 'trust':
        break
      default:
        instruction = this.renderCommonInstruction({ walletType })
    }
    return <div className={classNames(commonStyles.container, styles.container, {
      [styles.sliderShow]: showSlider,
      [styles.sliderHide]: showSlider === false
    })}>
      <div className={classNames(styles.wallet, styles.withBorder, styles.walletPreview)}>
        <RetinaImage width={60} {...getImages({ src: walletType })} />
      </div>
      <div className={classNames(styles.title, styles.instructionTitle)}>{this.t('titles.howToClaim', { wallet: walletTitle })}</div>
      {instruction}
      {this.renderInstructionButton({ walletType })}
      {this.renderSlider({ walletType })}
    </div>
  }

  renderInstructionButton ({ walletType }) {
    switch (walletType) {
      case 'trust':
        const buttonTitle = getWalletData({ wallet: 'trust' }).name
        return <Button onClick={_ => copyToClipboard({ value: window.location.href })} className={styles.button}>
          {buttonTitle}
        </Button>
      // case 'imtoken':
      // here is the wallets with deeplink available only after application download
      //   return <Button href={} className={styles.button}>
      //     {this.t('buttons.copyLink')}
      //   </Button>
      default:
        return <Button inverted onClick={_ => copyToClipboard({ value: window.location.href })} className={styles.button}>
          {this.t('buttons.copyLink')}
        </Button>
    }
  }

  renderSlider ({ walletType }) {
    return <Slider
      t={this.t}
      walletType={walletType}
      selectWallet={({ id }) => {
        this.toggleSlider({
          showSlider: false,
          callback: () => this.actions().user.setWalletType({ walletType: id })
        })
      }}
      showSlider={_ => {
        this.toggleSlider({
          showSlider: true
        })
      }}
    />
  }

  renderCommonInstruction ({ walletType }) {
    return <CommonInstruction walletType={walletType} styles={styles} t={this.t} />
  }

  toggleSlider ({ showSlider = true, callback }) {
    this.setState({
      showSlider
    }, () => callback && callback())
  }
}

export default WalletChoosePage
